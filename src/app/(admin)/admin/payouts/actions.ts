"use server";
import {revalidatePath} from "next/cache";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {parseBratislavaMonth} from "@/lib/month";
import {formUiLanguage,uiText} from "@/lib/i18n";

export type TeacherRateState={error?:string;success?:string};
export async function saveTeacherRate(_state:TeacherRateState,form:FormData):Promise<TeacherRateState>{
 const {user}=await requireRole("admin");
 const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
 const teacherId=String(form.get("teacher_id")??"");
 const monthValue=String(form.get("month")??"");
 const month=parseBratislavaMonth(monthValue);
 const rate=Number(form.get("rate_eur"));
 if(!/^[0-9a-f-]{36}$/i.test(teacherId)||!month||!Number.isFinite(rate)||rate<0||rate>1000) return {error:t("Skontrolujte lektora, mesiac a sadzbu.","Check the teacher, month and rate.")};
 const db=await createSupabaseServerClient();
 const {data:teacher}=await db.from("profiles").select("id").eq("id",teacherId).eq("role","teacher").maybeSingle();
 if(!teacher) return {error:t("Lektor sa nenašiel.","Teacher not found.")};
 const cents=Math.round(rate*100);
 const {error}=await db.from("teacher_pay_rates").upsert({teacher_id:teacherId,effective_month:month.key,rate_cents_per_lesson:cents,created_by:user.id,updated_at:new Date().toISOString()},{onConflict:"teacher_id,effective_month"});
 if(error) return {error:t("Sadzbu sa nepodarilo uložiť.","The rate could not be saved.")};
 revalidatePath("/admin/payouts");
 return {success:t("Sadzba bola uložená pre vybraný mesiac.","Rate saved for the selected month.")};
}
