"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
export async function retryNotification(_previous:{error?:string;success?:string},form:FormData):Promise<{error?:string;success?:string}> {
 await requireRole("admin");
 try {
  const {data,error}=await createSupabaseAdminClient().rpc("retry_schedule_email",{job_id:String(form.get("job_id")||"")});
  if(error||!data)return {error:"Správu nemožno zopakovať. Môže byť neaktuálna alebo sa jej stav zmenil."};
  revalidatePath("/admin/lessons");return {success:"Správa je znovu vo fronte. Odošle ju nakonfigurovaný plánovač."};
 }catch{return {error:"Správu sa nepodarilo zaradiť. Skúste znova."};}
}
