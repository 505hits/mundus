"use server";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STUDENT_LANGUAGES, STUDENT_LEVELS, type AccountFormState } from "@/lib/account-policy";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export async function saveOnboarding(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const { user } = await requireRole("student");
  const language = String(form.get("language") || "");
  const level = String(form.get("level") || "");
  const goal = String(form.get("goal") || "").trim();
  if (!(STUDENT_LANGUAGES as readonly string[]).includes(language) || !(STUDENT_LEVELS as readonly string[]).includes(level) || goal.length < 3 || goal.length > 1000) {
    return { error: "Vyberte jazyk, približnú úroveň a stručne opíšte svoj cieľ." };
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("student_onboarding").upsert({ student_id: user.id, language, level, goal, completed_at: new Date().toISOString() });
    if (error) return { error: "Údaje sa nepodarilo uložiť. Skúste to znova." };
  } catch { return { error: "Údaje sa nepodarilo uložiť. Skúste to znova." }; }
  redirect(purchaseReturnPath(form.get("next")) ?? "/dashboard");
}
