"use server";

import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { revalidatePath } from "next/cache";

export type TeacherProfileState={error?:string;success?:string};

export async function saveTeacherProfile(_previous:TeacherProfileState,form:FormData):Promise<TeacherProfileState>{
  const {user}=await requireRole("teacher");
  const headline=String(form.get("headline")||"").trim();
  const bio=String(form.get("bio")||"").trim();
  const languages=form.getAll("languages").map(String).filter(value=>(MUNDUS_LANGUAGE_VALUES as readonly string[]).includes(value));
  const visible=form.get("website_visible")==="true";
  const photo=form.get("photo");
  if(headline.length>120||bio.length>1000||!languages.length) return {error:"Vyberte aspoň jeden jazyk a skontrolujte dĺžku textov."};

  const admin=createSupabaseAdminClient();
  let photoPath:string|undefined;
  if(photo instanceof File && photo.size>0){
    if(photo.size>5*1024*1024||!["image/jpeg","image/png","image/webp"].includes(photo.type)) return {error:"Fotka musí byť JPG, PNG alebo WebP do 5 MB."};
    const ext=photo.type==="image/png"?"png":photo.type==="image/webp"?"webp":"jpg";
    photoPath=`${user.id}/profile.${ext}`;
    const bytes=Buffer.from(await photo.arrayBuffer());
    const {error:uploadError}=await admin.storage.from("teacher-public").upload(photoPath,bytes,{contentType:photo.type,upsert:true,cacheControl:"3600"});
    if(uploadError) return {error:"Fotku sa nepodarilo nahrať. Skúste to znova."};
  }

  const existing=await admin.from("teacher_public_profiles").select("photo_path").eq("teacher_id",user.id).maybeSingle();
  const {error}=await admin.from("teacher_public_profiles").upsert({
    teacher_id:user.id,headline,bio,languages,website_visible:visible,
    photo_path:photoPath??existing.data?.photo_path??null,updated_at:new Date().toISOString()
  });
  if(error) return {error:"Profil sa nepodarilo uložiť."};

  const current=await admin.from("teacher_preferences").select("*").eq("teacher_id",user.id).maybeSingle();
  const pref=current.data;
  const {error:prefError}=await admin.from("teacher_preferences").upsert({
    teacher_id:user.id,languages,
    accepting_students:pref?.accepting_students??false,
    levels:pref?.levels??[],days:pref?.days??[],time_from:pref?.time_from??null,time_to:pref?.time_to??null,
    max_new_students:pref?.max_new_students??0,note:pref?.note??""
  });
  if(prefError) return {error:"Profil bol uložený, ale jazyky sa nepodarilo synchronizovať s kapacitou."};
  revalidatePath("/");
  revalidatePath("/teacher/profile");
  revalidatePath("/admin/matching");
  return {success:"Profil bol uložený."};
}
