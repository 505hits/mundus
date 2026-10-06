"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formUiLanguage, uiText } from "@/lib/i18n";
export async function retryNotification(_previous:{error?:string;success?:string},form:FormData):Promise<{error?:string;success?:string}> {
 const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
 await requireRole("admin");
 try {
  const {data,error}=await createSupabaseAdminClient().rpc("retry_schedule_email",{job_id:String(form.get("job_id")||"")});
  if(error||!data)return {error:t("Správu nemožno zopakovať. Môže byť neaktuálna alebo sa jej stav zmenil.","The message cannot be retried. It may be outdated or its status may have changed.")};
  revalidatePath("/admin/lessons");return {success:t("Správa je znovu vo fronte. Odošle ju nakonfigurovaný plánovač.","The message is queued again. The configured scheduler will send it.")};
 }catch{return {error:t("Správu sa nepodarilo zaradiť. Skúste znova.","The message could not be queued. Try again.")};}
}
