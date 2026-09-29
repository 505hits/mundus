"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAcceptTeacherInvitation, validPassword, type AccountFormState } from "@/lib/account-policy";

export async function acceptTeacherInvitation(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  if (process.env.MUNDUS_INVITATIONS_ENABLED !== "true") return { error: "Aktivácia pozvánok ešte nie je dostupná." };
  const password = String(form.get("password") || "");
  if (!validPassword(password)) return { error: "Heslo musí mať 10 až 128 znakov." };
  if (password !== form.get("confirmPassword")) return { error: "Heslá sa nezhodujú." };
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email_confirmed_at || !canAcceptTeacherInvitation(user.app_metadata)) return { error: "Pozvánka nie je platná alebo už bola použitá. Otvorte odkaz z e-mailu alebo kontaktujte Mundus." };
    const { data: profile } = await supabase.from("profiles").select("role,status").eq("id", user.id).single();
    if (profile?.role !== "teacher" || profile.status !== "pending") return { error: "Tento účet nie je pripravený na aktiváciu lektora. Kontaktujte Mundus." };
    const admin = createSupabaseAdminClient();
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) return { error: "Heslo sa nepodarilo uložiť. Použite iné silné heslo a skúste to znova." };
    const { error: activateError } = await admin.rpc("mundus_accept_teacher_invitation", { invited_user_id: user.id });
    if (activateError) return { error: "Heslo je uložené, ale účet sa nepodarilo aktivovať. Kontaktujte Mundus." };
  } catch { return { error: "Aktiváciu sa nepodarilo dokončiť. Skúste to neskôr." }; }
  redirect("/teacher/dashboard");
}
