"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAcceptTeacherInvitation, validPassword, type AccountFormState } from "@/lib/account-policy";
import { formUiLanguage, uiText } from "@/lib/i18n";

export async function acceptTeacherInvitation(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
  if (process.env.MUNDUS_INVITATIONS_ENABLED !== "true") return { error: t("Aktivácia pozvánok ešte nie je dostupná.","Invitation activation is not available yet.") };
  const password = String(form.get("password") || "");
  if (!validPassword(password)) return { error: t("Heslo musí mať 10 až 128 znakov.","Password must be 10 to 128 characters long.") };
  if (password !== form.get("confirmPassword")) return { error: t("Heslá sa nezhodujú.","Passwords do not match.") };
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email_confirmed_at || !canAcceptTeacherInvitation(user.app_metadata)) return { error: t("Pozvánka nie je platná alebo už bola použitá. Otvorte odkaz z e-mailu alebo kontaktujte Mundus.","The invitation is invalid or has already been used. Open the link from your email or contact Mundus.") };
    const { data: profile } = await supabase.from("profiles").select("role,status").eq("id", user.id).single();
    if (profile?.role !== "teacher" || profile.status !== "pending") return { error: t("Tento účet nie je pripravený na aktiváciu lektora. Kontaktujte Mundus.","This account is not ready for teacher activation. Contact Mundus.") };
    const admin = createSupabaseAdminClient();
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) return { error: t("Heslo sa nepodarilo uložiť. Použite iné silné heslo a skúste to znova.","Password could not be saved. Use a different strong password and try again.") };
    const { error: activateError } = await admin.rpc("mundus_accept_teacher_invitation", { invited_user_id: user.id });
    if (activateError) return { error: t("Heslo je uložené, ale účet sa nepodarilo aktivovať. Kontaktujte Mundus.","Password was saved, but the account could not be activated. Contact Mundus.") };
  } catch { return { error: t("Aktiváciu sa nepodarilo dokončiť. Skúste to neskôr.","Activation could not be completed. Try again later.") }; }
  redirect("/teacher/dashboard");
}
