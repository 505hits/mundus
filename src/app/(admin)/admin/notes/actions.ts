"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addAdminNote(_state:{error?:string;success?:string},form:FormData){
  const {user}=await requireRole("admin");
  const subjectId=String(form.get("subject_id")??"");
  const note=String(form.get("note")??"").trim();
  if(!/^[0-9a-f-]{36}$/i.test(subjectId)||note.length<1||note.length>3000) return {error:"Skontrolujte poznámku."};
  const db=await createSupabaseServerClient();
  const {data:profile}=await db.from("profiles").select("id").eq("id",subjectId).maybeSingle();
  if(!profile) return {error:"Účet sa nenašiel."};
  const {error}=await db.from("admin_profile_notes").insert({subject_profile_id:subjectId,note,created_by:user.id});
  if(error) return {error:"Poznámku sa nepodarilo uložiť."};
  revalidatePath("/admin/notes");
  return {success:"Poznámka bola uložená."};
}
