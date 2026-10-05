"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
type State = { error?: string; success?: string };
export async function saveRenewalFollowup(_previous:State,form:FormData):Promise<State> {
 const {user}=await requireRole("admin");
 try {
  const studentId=String(form.get("student_id")||"");
  const status=String(form.get("status")||"");
  const note=String(form.get("note")||"").trim();
  const date=(name:string)=>{const value=String(form.get(name)||"");if(!value)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw new Error("date");return value;};
  if(!/^[0-9a-f-]{36}$/i.test(studentId)||!['to_contact','contacted','waiting','later','closed'].includes(status)||note.length>2000)return {error:"Skontrolujte stav a poznámku (najviac 2000 znakov)."};
  const values={student_id:studentId,status,note,last_contact:date("last_contact"),next_followup:date("next_followup"),updated_by:user.id};
  const supabase=await createSupabaseServerClient();
  const version=String(form.get("version")||"");
  const query=version?supabase.from("renewal_followups").update(values).eq("student_id",studentId).eq("updated_at",version):supabase.from("renewal_followups").insert(values);
  const {data,error}=await query.select("student_id");
  if(error||!data?.length)return {error:"Údaje sa nepodarilo uložiť alebo sa medzičasom zmenili. Obnovte stránku a skontrolujte aktuálny záznam."};
  revalidatePath("/admin/dashboard");return {success:"Záznam uložený. Správa študentovi sa automaticky neposiela."};
 }catch{return {error:"Skontrolujte dátumy a pripojenie. Vaše vyplnené údaje zostali zachované."};}
}
