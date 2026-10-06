"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";
import { type AccountFormState, validEmail } from "@/lib/account-policy";
import { formUiLanguage, uiText } from "@/lib/i18n";

export async function inviteTeacher(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const language=formUiLanguage(form); const t=(sk:string,en:string)=>uiText(language,sk,en);
  await requireRole("admin");
  if (process.env.MUNDUS_INVITATIONS_ENABLED !== "true") return { error: t("Pozvánky ešte nie sú aktivované.","Invitations are not enabled yet.") };
  const email = String(form.get("email") || "").trim().toLowerCase();
  const name = String(form.get("name") || "").trim();
  if (!validEmail(email) || name.length < 2 || name.length > 100) return { error: t("Zadajte meno lektora a platnú e-mailovú adresu.","Enter the teacher’s name and a valid email address.") };
  try {
    const redirectTo = `${accountOrigin()}/set-password`;
    const admin = createSupabaseAdminClient();
    // An existing student must never be silently converted into a teacher.
    const { data: existing, error: lookupError } = await admin.from("profiles").select("id").ilike("email", email.replace(/[\\%_]/g, "\\$&")).limit(1);
    if (lookupError) return { error: t("Nepodarilo sa overiť existujúce účty. Skúste to znova.","Existing accounts could not be checked. Try again.") };
    if (existing?.length) return { error: t("Tento e-mail už má účet. Existujúci účet sa pozvánkou nemení; skontrolujte ho v správe používateľov.","This email already has an account. An invitation does not change an existing account; review it in user management.") };
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo, data: { full_name: name } });
    if (error || !data.user) return { error: t("Pozvánku sa nepodarilo odoslať. Skontrolujte e-mail alebo existujúci účet a skúste to neskôr.","Invitation could not be sent. Check the email or existing account and try again later.") };
    const { data: profile, error: profileError } = await admin.from("profiles").update({ role: "teacher", status: "pending", full_name: name }).eq("id", data.user.id).select("id").single();
    if (profileError || !profile) return { error: t("E-mail bol odoslaný, ale lektorský prístup sa nepodarilo pripraviť. Účet zostáva bez aktívneho lektorského prístupu; kontaktujte správcu technického nastavenia.","Email was sent, but teacher access could not be prepared. The account remains without active teacher access; contact the technical administrator.") };
    // app_metadata can only be written by the trusted Auth admin API, never by signup metadata.
    const { error: metadataError } = await admin.auth.admin.updateUserById(data.user.id, { app_metadata: {
      mundus_invited_role: "teacher",
      mundus_invitation_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      mundus_invitation_accepted_at: null,
    } });
    if (metadataError) return { error: t("E-mail bol odoslaný, ale aktivácia pozvánky zlyhala. Lektorský účet zostáva neaktívny; kontaktujte správcu technického nastavenia.","Email was sent, but invitation activation failed. The teacher account remains inactive; contact the technical administrator.") };
    revalidatePath("/admin/teachers");
    return { success: language==="en" ? `Invitation for ${email} was sent. The teacher will set a password from the email and activate the account.` : `Pozvánka pre ${email} bola odoslaná. Lektor si cez e-mail nastaví heslo a aktivuje účet.` };
  } catch { return { error: t("Pozvánky sú momentálne nedostupné. Skúste to neskôr.","Invitations are currently unavailable. Try again later.") }; }
}
