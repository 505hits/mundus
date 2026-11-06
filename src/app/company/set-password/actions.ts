"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAcceptCompanyInvitation, validPassword, type AccountFormState } from "@/lib/account-policy";
import { formUiLanguage, uiText } from "@/lib/i18n";

export async function acceptCompanyInvitation(_previous:AccountFormState,form:FormData):Promise<AccountFormState>{
 const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
 if(process.env.MUNDUS_INVITATIONS_ENABLED!=="true") return {error:t("Aktivácia pozvánok ešte nie je dostupná.","Invitation activation is not available yet.")};
 const password=String(form.get("password")||"");
 if(!validPassword(password)) return {error:t("Heslo musí mať 10 až 128 znakov.","Password must be 10 to 128 characters long.")};
 if(password!==form.get("confirmPassword")) return {error:t("Heslá sa nezhodujú.","Passwords do not match.")};
 try{
  const supabase=await createSupabaseServerClient(); const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user?.email_confirmed_at||!canAcceptCompanyInvitation(user.app_metadata)) return {error:t("Pozvánka nie je platná alebo už bola použitá.","The invitation is invalid or has already been used.")};
  const {data:profile}=await supabase.from("profiles").select("role,status").eq("id",user.id).single();
  if(profile?.role!=="company"||profile.status!=="pending") return {error:t("Tento účet nie je pripravený na firemnú aktiváciu.","This account is not ready for company activation.")};
  const {error:passwordError}=await supabase.auth.updateUser({password}); if(passwordError) return {error:t("Heslo sa nepodarilo uložiť.","Password could not be saved.")};
  const admin=createSupabaseAdminClient(); const {error:activateError}=await admin.rpc("mundus_accept_company_invitation",{invited_user_id:user.id});
  if(activateError) return {error:t("Účet sa nepodarilo aktivovať. Kontaktujte Mundus.","The account could not be activated. Contact Mundus.")};
 }catch{return {error:t("Aktiváciu sa nepodarilo dokončiť.","Activation could not be completed.")}}
 redirect("/company/dashboard");
}
