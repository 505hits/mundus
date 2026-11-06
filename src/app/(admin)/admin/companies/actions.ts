"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";
import { validEmail, type AccountFormState } from "@/lib/account-policy";
import { formUiLanguage, uiText } from "@/lib/i18n";

export async function createCompanyAndInvite(_previous:AccountFormState,form:FormData):Promise<AccountFormState>{
 const language=formUiLanguage(form);const t=(sk:string,en:string)=>uiText(language,sk,en);await requireRole("admin");
 if(process.env.MUNDUS_INVITATIONS_ENABLED!=="true") return {error:t("Pozvánky ešte nie sú aktivované.","Invitations are not enabled yet.")};
 const companyName=String(form.get("company_name")||"").trim();const managerName=String(form.get("manager_name")||"").trim();const email=String(form.get("email")||"").trim().toLowerCase();
 if(companyName.length<2||companyName.length>160||managerName.length<2||managerName.length>120||!validEmail(email))return{error:t("Skontrolujte názov firmy, meno kontaktnej osoby a e-mail.","Check the company name, contact name and email.")};
 try{
  const admin=createSupabaseAdminClient();
  const {data:existing}=await admin.from("profiles").select("id,role").ilike("email",email.replace(/[\\%_]/g,"\\$&")).limit(1);
  if(existing?.length)return{error:t("Tento e-mail už má účet. Nepremeňte existujúci účet automaticky; použite iný firemný kontakt.","This email already has an account. Do not convert an existing account automatically; use another company contact.")};
  const {data:company,error:companyError}=await admin.from("companies").insert({name:companyName,billing_email:email}).select("id").single();
  if(companyError||!company)return{error:t("Firmu sa nepodarilo vytvoriť.","The company could not be created.")};
  const {data:invited,error:inviteError}=await admin.auth.admin.inviteUserByEmail(email,{redirectTo:`${accountOrigin()}/company/set-password`,data:{full_name:managerName}});
  if(inviteError||!invited.user){await admin.from("companies").delete().eq("id",company.id);return{error:t("Pozvánku sa nepodarilo odoslať.","The invitation could not be sent.")};}
  const {error:profileError}=await admin.from("profiles").update({role:"company",status:"pending",full_name:managerName}).eq("id",invited.user.id);
  if(profileError)return{error:t("Pozvánka bola odoslaná, ale firemný prístup sa nepodarilo pripraviť.","The invitation was sent, but company access could not be prepared.")};
  const {error:memberError}=await admin.from("company_members").insert({company_id:company.id,profile_id:invited.user.id,member_role:"manager"});
  if(memberError)return{error:t("Firemný účet sa nepodarilo prepojiť so spoločnosťou.","The company account could not be linked to the company.")};
  const {error:metaError}=await admin.auth.admin.updateUserById(invited.user.id,{app_metadata:{mundus_invited_role:"company",mundus_invitation_expires_at:new Date(Date.now()+7*24*60*60*1000).toISOString(),mundus_invitation_accepted_at:null}});
  if(metaError)return{error:t("Pozvánka bola odoslaná, ale jej aktivácia sa nepodarila pripraviť.","The invitation was sent, but activation could not be prepared.")};
  revalidatePath("/admin/companies");return{success:t("Firma bola vytvorená a pozvánka odoslaná.","Company created and invitation sent.")};
 }catch{return{error:t("Firemný účet sa momentálne nepodarilo pripraviť.","The company account could not be prepared right now.")}}
}

export async function linkEmployee(_previous:AccountFormState,form:FormData):Promise<AccountFormState>{
 const language=formUiLanguage(form);const t=(sk:string,en:string)=>uiText(language,sk,en);await requireRole("admin");
 const companyId=String(form.get("company_id")||"");const email=String(form.get("employee_email")||"").trim().toLowerCase();
 if(!companyId||!validEmail(email))return{error:t("Vyberte firmu a zadajte platný e-mail študenta.","Choose a company and enter a valid student email.")};
 const admin=createSupabaseAdminClient();
 const {data:student,error}=await admin.from("profiles").select("id").ilike("email",email.replace(/[\\%_]/g,"\\$&")).eq("role","student").eq("status","active").maybeSingle();
 if(error||!student)return{error:t("Aktívny študentský účet s týmto e-mailom sa nenašiel.","No active student account was found for this email.")};
 const {error:linkError}=await admin.from("company_employees").upsert({company_id:companyId,student_id:student.id,active:true},{onConflict:"company_id,student_id"});
 if(linkError)return{error:t("Zamestnanca sa nepodarilo priradiť.","The employee could not be assigned.")};
 revalidatePath("/admin/companies");return{success:t("Zamestnanec bol priradený k firme.","Employee assigned to the company.")};
}

export async function unlinkEmployee(form:FormData){
 await requireRole("admin");const companyId=String(form.get("company_id")||"");const studentId=String(form.get("student_id")||"");
 if(!companyId||!studentId)return;
 await createSupabaseAdminClient().from("company_employees").update({active:false}).eq("company_id",companyId).eq("student_id",studentId);
 revalidatePath("/admin/companies");
}

export async function markCompanyQuoteContacted(form:FormData){
 await requireRole("admin");const id=String(form.get("request_id")||"");if(!id)return;
 await createSupabaseAdminClient().from("company_quote_requests").update({status:"contacted",updated_at:new Date().toISOString()}).eq("id",id).eq("status","new");
 revalidatePath("/admin/companies");
}
