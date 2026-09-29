"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { accountOrigin } from "@/lib/account-config";
import { type AccountFormState, validEmail, validPassword } from "@/lib/account-policy";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export async function signUpStudent(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  if (process.env.MUNDUS_SELF_SIGNUP_ENABLED !== "true") return { error: "Registrácia ešte nie je dostupná. Kontaktujte nás a pomôžeme vám s vytvorením účtu." };
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = purchaseReturnPath(form.get("next"));
  if (name.length < 2 || name.length > 100 || !validEmail(email)) return { error: "Vyplňte svoje meno a platnú e-mailovú adresu." };
  if (!validPassword(password)) return { error: "Heslo musí mať 10 až 128 znakov." };
  if (password !== form.get("confirmPassword")) return { error: "Heslá sa nezhodujú." };
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${accountOrigin()}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`, data: { full_name: name, signup_source: "self_service" } },
    });
    if (error) return { error: "Registráciu sa nepodarilo dokončiť. Skúste to neskôr alebo sa prihláste, ak už účet máte." };
    // Email verification is mandatory even if Auth is accidentally configured to issue a session.
    if (data.session) await supabase.auth.signOut();
    return { success: "Skontrolujte svoju e-mailovú schránku a potvrďte registráciu. Ak už účet máte, prihláste sa. Pozrite aj priečinok so spamom." };
  } catch {
    return { error: "Registrácia je momentálne nedostupná. Skúste to neskôr." };
  }
}
