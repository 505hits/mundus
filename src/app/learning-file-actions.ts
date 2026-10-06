"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { persistLearningMetadata } from "@/lib/learning-upload-persistence";
import { allowedLearningFile, LEARNING_FILE_LIMIT } from "@/lib/learning-files";
import { formUiLanguage, uiText } from "@/lib/i18n";

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
 const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
 try {
  const studentId=String(form.get("student_id")||""); const {user,role}=await authorizeStudent(studentId);
  const kind=String(form.get("kind")||"");
  if(role==="student" ? kind!=="homework_submission" : !["material","homework_assignment"].includes(kind)) return {error:t("Tento typ súboru nemôžete nahrať.","You cannot upload this file type.")};
  const title=String(form.get("title")||"").trim();const file=form.get("file");
  if(!title || title.length>150 || !(file instanceof File) || file.size>LEARNING_FILE_LIMIT) return {error:t("Vyplňte názov a vyberte PDF, PNG, JPG alebo TXT do 3 MB.","Enter a title and choose a PDF, PNG, JPG or TXT file up to 3 MB.")};
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!allowedLearningFile(bytes,file.type)) return {error:t("Nepodporovaný alebo poškodený súbor. Povolené sú PDF, PNG, JPG a TXT do 3 MB.","Unsupported or damaged file. Allowed formats are PDF, PNG, JPG and TXT up to 3 MB.")};
  const admin=createSupabaseAdminClient();
  // Verify metadata storage before uploading, so missing migrations cannot create orphan files.
  const {error:readyError}=await admin.from("learning_files").select("id").limit(1);
  if(readyError) return {error:t("Nahrávanie momentálne nie je dostupné.","Uploading is currently unavailable.")};
  const objectPath=`${studentId}/${user.id}/${randomUUID()}`;
  const {error:uploadError}=await admin.storage.from("mundus-learning").upload(objectPath,bytes,{contentType:file.type,upsert:false});
  if(uploadError) return {error:t("Súbor sa nepodarilo nahrať. Skúste znova.","The file could not be uploaded. Try again.")};
  const {error}=await persistLearningMetadata(
   () => admin.from("learning_files").insert({student_id:studentId,uploaded_by:user.id,kind,title,object_path:objectPath,file_name:file.name.replace(/[\r\n/\\]/g,"_").slice(0,150),mime_type:file.type,size_bytes:file.size}),
   () => admin.storage.from("mundus-learning").remove([objectPath]),
   async () => {
    const { data, error } = await admin.from("learning_files").select("id")
     .eq("object_path", objectPath).eq("student_id", studentId).eq("uploaded_by", user.id).maybeSingle();
    if(error) throw error;
    return Boolean(data);
   },
  );
  if(error) return {error:t("Súbor sa nepodarilo uložiť. Skúste znova.","The file could not be saved. Try again.")};
  revalidatePath("/learning"); revalidatePath(`/teacher/student/${studentId}`);
  return {success:t("Súbor bol uložený.","File saved.")};
 } catch{return {error:t("Nahrávanie sa nepodarilo. Skúste znova alebo kontaktujte Mundus.","Upload failed. Try again or contact Mundus.")};}
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
