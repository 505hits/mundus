"use server";
import {revalidatePath} from "next/cache";
import {requireRole} from "@/lib/auth";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {parseBratislavaMonth} from "@/lib/month";

export async function saveTeacherRate(_state:{error?:string;success?:string},form:FormData){
 const {user}=await requireRole("admin");
 const teacherId=String(form.get("teacher_id")??"");
 const monthValue=String(form.get("month")??"");
 const month=parseBratislavaMonth(monthValue);
 const rate=Number(form.get("rate_eur"));
 if(!/^[0-9a-f-]{36}$/i.test(teacherId)||!month||!Number.isFinite(rate)||rate<0||rate>1000) return {error:"Skontrolujte lektora, mesiac a sadzbu."};
 const db=await createSupabaseServerClient();
 const {data:teacher}=await db.from("profiles").select("id").eq("id",teacherId).eq("role","teacher").maybeSingle();
 if(!teacher) return {error:"Lektor sa nenašiel."};
 const cents=Math.round(rate*100);
 const {error}=await db.from("teacher_pay_rates").upsert({teacher_id:teacherId,effective_month:month.key,rate_cents_per_lesson:cents,created_by:user.id,updated_at:new Date().toISOString()},{onConflict:"teacher_id,effective_month"});
 if(error) return {error:"Sadzbu sa nepodarilo uložiť."};
 revalidatePath("/admin/payouts");
 return {success:"Sadzba bola uložená pre vybraný mesiac."};
}
