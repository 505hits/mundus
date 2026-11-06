"use server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validEmail } from "@/lib/account-policy";

export async function submitCompanyQuote(form:FormData){
 const companyName=String(form.get("company_name")||"").trim().replace(/\s+/g," ");
 const contactName=String(form.get("contact_name")||"").trim().replace(/\s+/g," ");
 const email=String(form.get("email")||"").trim().toLowerCase();
 const phone=String(form.get("phone")||"").trim();
 const rawCount=String(form.get("employee_count")||"").trim(); const employeeCount=rawCount?Number(rawCount):null;
 const languages=String(form.get("languages")||"").trim();
 const message=String(form.get("message")||"").trim();
 const honeypot=String(form.get("website")||"").trim();
 if(honeypot) redirect("/companies?sent=1");
 if(companyName.length<2||companyName.length>160||contactName.length<2||contactName.length>120||!validEmail(email)||phone.length>80||languages.length>500||message.length>3000||(employeeCount!==null&&(!Number.isInteger(employeeCount)||employeeCount<1||employeeCount>100000))) redirect("/companies?problem=invalid");
 const admin=createSupabaseAdminClient(); const cutoff=new Date(Date.now()-6*60*60*1000).toISOString();
 const {count,error:countError}=await admin.from("company_quote_requests").select("id",{count:"exact",head:true}).eq("email",email).gte("created_at",cutoff);
 if(countError) redirect("/companies?problem=unavailable"); if((count??0)>=3) redirect("/companies?problem=rate");
 const {error}=await admin.from("company_quote_requests").insert({company_name:companyName,contact_name:contactName,email,phone:phone||null,employee_count:employeeCount,languages:languages||null,message});
 if(error) redirect("/companies?problem=unavailable"); redirect("/companies?sent=1");
}
