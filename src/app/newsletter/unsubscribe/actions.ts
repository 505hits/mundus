"use server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UnsubscribeState={success?:string;error?:string};
export async function unsubscribeNewsletter(_previous:UnsubscribeState,form:FormData):Promise<UnsubscribeState>{
 const token=String(form.get("token")||"");const language=form.get("ui_language")==="en"?"en":"sk";
 if(!token) return {error:language==="sk"?"Odkaz na odhlásenie nie je platný.":"The unsubscribe link is invalid."};
 const admin=createSupabaseAdminClient();
 const {data,error}=await admin.from("newsletter_subscribers").select("id,status").eq("unsubscribe_token",token).maybeSingle();
 if(error||!data) return {error:language==="sk"?"Odber sa nepodarilo nájsť.":"The subscription could not be found."};
 if(data.status==="unsubscribed") return {success:language==="sk"?"Odber už bol zrušený.":"You are already unsubscribed."};
 const {error:updateError}=await admin.from("newsletter_subscribers").update({status:"unsubscribed",unsubscribed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",data.id);
 if(updateError) return {error:language==="sk"?"Odber sa nepodarilo zrušiť. Skúste to neskôr.":"Unsubscribe failed. Try again later."};
 return {success:language==="sk"?"Odber noviniek bol zrušený.":"You have been unsubscribed."};
}
