"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formUiLanguage, uiText } from "@/lib/i18n";

export type AdminNoteState={error?:string;success?:string};
export async function addAdminNote(_state:AdminNoteState,form:FormData):Promise<AdminNoteState>{
  const {user}=await requireRole("admin");
  const language=formUiLanguage(form);
  const t=(sk:string,en:string)=>uiText(language,sk,en);
  const subjectId=String(form.get("subject_id")??"");
  const note=String(form.get("note")??"").trim();
  if(!/^[0-9a-f-]{36}$/i.test(subjectId)||note.length<1||note.length>3000) return {error:t("Skontrolujte poznámku.","Check the note.")};
  const db=await createSupabaseServerClient();
  const {data:profile}=await db.from("profiles").select("id").eq("id",subjectId).maybeSingle();
  if(!profile) return {error:t("Účet sa nenašiel.","Account not found.")};
  const {error}=await db.from("admin_profile_notes").insert({subject_profile_id:subjectId,note,created_by:user.id});
  if(error) return {error:t("Poznámku sa nepodarilo uložiť.","The note could not be saved.")};
  revalidatePath("/admin/notes");
  return {success:t("Poznámka bola uložená.","Note saved.")};
}
