"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { persistLearningMetadata } from "@/lib/learning-upload-persistence";
import { allowedLearningFile, LEARNING_FILE_LIMIT } from "@/lib/learning-files";

type State = { error?: string; success?: string };
async function authorizeStudent(studentId: string) {
 const supabase=await createSupabaseServerClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user?.email_confirmed_at) throw new Error("Unauthorized");
 const {data:profile}=await supabase.from("profiles").select("role,status").eq("id",user.id).single();
 if(profile?.status!=="active") throw new Error("Unauthorized");
 if(profile.role==="student" && studentId===user.id) return {user,role:profile.role};
 if(profile.role==="admin") return {user,role:profile.role};
 if(profile.role==="teacher") {
  const {data}=await supabase.from("lessons").select("id").eq("teacher_id",user.id).eq("student_id",studentId).limit(1).maybeSingle();
  if(data) return {user,role:profile.role};
 }
 throw new Error("Unauthorized");
}
export async function uploadLearningFile(_previous: State, form: FormData): Promise<State> {
 try {
  const studentId=String(form.get("student_id")||""); const {user,role}=await authorizeStudent(studentId);
  const kind=String(form.get("kind")||"");
  if(role==="student" ? kind!=="homework_submission" : !["material","homework_assignment"].includes(kind)) return {error:"Tento typ súboru nemôžete nahrať."};
  const title=String(form.get("title")||"").trim();const file=form.get("file");
  if(!title || title.length>150 || !(file instanceof File) || file.size>LEARNING_FILE_LIMIT) return {error:"Vyplňte názov a vyberte PDF, PNG, JPG alebo TXT do 3 MB."};
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!allowedLearningFile(bytes,file.type)) return {error:"Nepodporovaný alebo poškodený súbor. Povolené sú PDF, PNG, JPG a TXT do 3 MB."};
  const admin=createSupabaseAdminClient();
  // Verify metadata storage before uploading, so missing migrations cannot create orphan files.
  const {error:readyError}=await admin.from("learning_files").select("id").limit(1);
  if(readyError) return {error:"Nahrávanie momentálne nie je dostupné."};
  const objectPath=`${studentId}/${user.id}/${randomUUID()}`;
  const {error:uploadError}=await admin.storage.from("mundus-learning").upload(objectPath,bytes,{contentType:file.type,upsert:false});
  if(uploadError) return {error:"Súbor sa nepodarilo nahrať. Skúste znova."};
  const {error}=await persistLearningMetadata(
   () => admin.from("learning_files").insert({student_id:studentId,uploaded_by:user.id,kind,title,object_path:objectPath,file_name:file.name.replace(/[\r\n/\\]/g,"_").slice(0,150),mime_type:file.type,size_bytes:file.size}),
   () => admin.storage.from("mundus-learning").remove([objectPath]),
  );
  if(error) return {error:"Súbor sa nepodarilo uložiť. Skúste znova."};
  revalidatePath("/learning"); revalidatePath(`/teacher/student/${studentId}`);
  return {success:"Súbor bol uložený."};
 } catch{return {error:"Nahrávanie sa nepodarilo. Skúste znova alebo kontaktujte Mundus."};}
}
export async function downloadLearningFile(form: FormData) {
 let url:string|null=null;
 try {
  const supabase=await createSupabaseServerClient();
  const {data:file}=await supabase.from("learning_files").select("student_id,object_path,file_name").eq("id",String(form.get("file_id")||"")).single();
  if(!file) throw new Error("Not found");
  await authorizeStudent(file.student_id);
  const {data,error}=await createSupabaseAdminClient().storage.from("mundus-learning").createSignedUrl(file.object_path,60,{download:file.file_name});
  if(!error)url=data.signedUrl;
 }catch{}
 if(!url)redirect("/contact");
 redirect(url);
}
