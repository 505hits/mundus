"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";
import { type AccountFormState, validEmail } from "@/lib/account-policy";

export async function inviteTeacher(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  await requireRole("admin");
  if (process.env.MUNDUS_INVITATIONS_ENABLED !== "true") return { error: "Pozvánky ešte nie sú aktivované." };
  const email = String(form.get("email") || "").trim().toLowerCase();
  const name = String(form.get("name") || "").trim();
  if (!validEmail(email) || name.length < 2 || name.length > 100) return { error: "Zadajte meno lektora a platnú e-mailovú adresu." };
  try {
    const redirectTo = `${accountOrigin()}/set-password`;
    const admin = createSupabaseAdminClient();
    // An existing student must never be silently converted into a teacher.
    const { data: existing, error: lookupError } = await admin.from("profiles").select("id").ilike("email", email.replace(/[\\%_]/g, "\\$&")).limit(1);
    if (lookupError) return { error: "Nepodarilo sa overiť existujúce účty. Skúste to znova." };
    if (existing?.length) return { error: "Tento e-mail už má účet. Existujúci účet sa pozvánkou nemení; skontrolujte ho v správe používateľov." };
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo, data: { full_name: name } });
    if (error || !data.user) return { error: "Pozvánku sa nepodarilo odoslať. Skontrolujte e-mail alebo existujúci účet a skúste to neskôr." };
    const { data: profile, error: profileError } = await admin.from("profiles").update({ role: "teacher", status: "pending", full_name: name }).eq("id", data.user.id).select("id").single();
    if (profileError || !profile) return { error: "E-mail bol odoslaný, ale lektorský prístup sa nepodarilo pripraviť. Účet zostáva bez aktívneho lektorského prístupu; kontaktujte správcu technického nastavenia." };
    // app_metadata can only be written by the trusted Auth admin API, never by signup metadata.
    const { error: metadataError } = await admin.auth.admin.updateUserById(data.user.id, { app_metadata: {
      mundus_invited_role: "teacher",
      mundus_invitation_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      mundus_invitation_accepted_at: null,
    } });
    if (metadataError) return { error: "E-mail bol odoslaný, ale aktivácia pozvánky zlyhala. Lektorský účet zostáva neaktívny; kontaktujte správcu technického nastavenia." };
    revalidatePath("/admin/teachers");
    return { success: `Pozvánka pre ${email} bola odoslaná. Lektor si cez e-mail nastaví heslo a aktivuje účet.` };
  } catch { return { error: "Pozvánky sú momentálne nedostupné. Skúste to neskôr." }; }
}
