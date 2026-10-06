"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { accountOrigin } from "@/lib/account-config";
import { type AccountFormState, validEmail, validPassword } from "@/lib/account-policy";
import { purchaseReturnPath } from "@/lib/purchase-intent";
import { formUiLanguage, uiText } from "@/lib/i18n";

export async function signUpStudent(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
  if (process.env.MUNDUS_SELF_SIGNUP_ENABLED !== "true") return { error: t("Registrácia ešte nie je dostupná. Kontaktujte nás a pomôžeme vám s vytvorením účtu.","Registration is not available yet. Contact us and we’ll help you create an account.") };
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = purchaseReturnPath(form.get("next"));
  if (name.length < 2 || name.length > 100 || !validEmail(email)) return { error: t("Vyplňte svoje meno a platnú e-mailovú adresu.","Enter your name and a valid email address.") };
  if (!validPassword(password)) return { error: t("Heslo musí mať 10 až 128 znakov.","Password must be 10 to 128 characters long.") };
  if (password !== form.get("confirmPassword")) return { error: t("Heslá sa nezhodujú.","Passwords do not match.") };
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${accountOrigin()}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`, data: { full_name: name, signup_source: "self_service" } },
    });
    if (error) return { error: t("Registráciu sa nepodarilo dokončiť. Skúste to neskôr alebo sa prihláste, ak už účet máte.","Registration could not be completed. Try again later or sign in if you already have an account.") };
    // Email verification is mandatory even if Auth is accidentally configured to issue a session.
    if (data.session) await supabase.auth.signOut();
    return { success: t("Skontrolujte svoju e-mailovú schránku a potvrďte registráciu. Ak už účet máte, prihláste sa. Pozrite aj priečinok so spamom.","Check your email and confirm registration. If you already have an account, sign in. Also check your spam folder.") };
  } catch {
    return { error: t("Registrácia je momentálne nedostupná. Skúste to neskôr.","Registration is currently unavailable. Please try again later.") };
  }
}
