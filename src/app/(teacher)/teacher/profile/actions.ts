"use server";

import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { revalidatePath } from "next/cache";
import { formUiLanguage, uiText } from "@/lib/i18n";

export type TeacherProfileState={error?:string;success?:string};

export async function saveTeacherProfile(_previous:TeacherProfileState,form:FormData):Promise<TeacherProfileState>{
  const {user}=await requireRole("teacher");
  const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
  const headline=String(form.get("headline")||"").trim();
  const bio=String(form.get("bio")||"").trim();
  const languages=form.getAll("languages").map(String).filter(value=>(MUNDUS_LANGUAGE_VALUES as readonly string[]).includes(value));
  const visible=form.get("website_visible")==="true";
  const photo=form.get("photo");
  if(headline.length>120||bio.length>1000||!languages.length) return {error:t("Vyberte aspoň jeden jazyk a skontrolujte dĺžku textov.","Choose at least one language and check the text lengths.")};
  if(visible && (headline.length<3 || bio.length<20)) return {error:t("Ak chcete profil zobraziť na hlavnom webe, doplňte krátky titulok a aspoň 20 znakov predstavenia.","To show your profile on the main website, add a short headline and at least 20 characters of introduction.")};

  const admin=createSupabaseAdminClient();
  const existing=await admin.from("teacher_public_profiles").select("photo_path").eq("teacher_id",user.id).maybeSingle();
  let photoPath:string|undefined;
  if(photo instanceof File && photo.size>0){
    if(photo.size>5*1024*1024||!["image/jpeg","image/png","image/webp"].includes(photo.type)) return {error:t("Fotka musí byť JPG, PNG alebo WebP do 5 MB.","Photo must be JPG, PNG or WebP up to 5 MB.")};
    const ext=photo.type==="image/png"?"png":photo.type==="image/webp"?"webp":"jpg";
    photoPath=`${user.id}/profile.${ext}`;
    const bytes=Buffer.from(await photo.arrayBuffer());
    const {error:uploadError}=await admin.storage.from("teacher-public").upload(photoPath,bytes,{contentType:photo.type,upsert:true,cacheControl:"3600"});
    if(uploadError) return {error:t("Fotku sa nepodarilo nahrať. Skúste to znova.","Photo upload failed. Try again.")};
  }

  const effectivePhotoPath=photoPath??existing.data?.photo_path??null;
  if(visible && !effectivePhotoPath) return {error:t("Ak chcete profil zobraziť na hlavnom webe, pridajte profilovú fotku.","To show your profile on the main website, add a profile photo.")};

  const {error}=await admin.from("teacher_public_profiles").upsert({
    teacher_id:user.id,headline,bio,languages,website_visible:visible,
    photo_path:effectivePhotoPath,updated_at:new Date().toISOString()
  });
  if(error) return {error:t("Profil sa nepodarilo uložiť.","Profile could not be saved.")};
  if(photoPath && existing.data?.photo_path && existing.data.photo_path !== photoPath) {
    await admin.storage.from("teacher-public").remove([existing.data.photo_path]).catch(()=>undefined);
  }

  const current=await admin.from("teacher_preferences").select("*").eq("teacher_id",user.id).maybeSingle();
  const pref=current.data;
  const {error:prefError}=await admin.from("teacher_preferences").upsert({
    teacher_id:user.id,languages,
    accepting_students:pref?.accepting_students??false,
    levels:pref?.levels??[],days:pref?.days??[],time_from:pref?.time_from??null,time_to:pref?.time_to??null,
    max_new_students:pref?.max_new_students??0,note:pref?.note??""
  });
  if(prefError) return {error:t("Profil bol uložený, ale jazyky sa nepodarilo synchronizovať s kapacitou.","Profile was saved, but languages could not be synchronized with availability.")};
  revalidatePath("/");
  revalidatePath("/teacher/profile");
  revalidatePath("/admin/matching");
  return {success:t("Profil bol uložený.","Profile saved.")};
}
