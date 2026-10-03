"use server";
import { assessmentBank } from "@/lib/assessment-catalog";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { scorePlacement } from "@/lib/placement";
export async function submitPlacement(_previous: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const { user } = await requireRole("student");
  try {
    const bank = assessmentBank(form.get("assessment_language"), "placement");
    const answers = bank.questions.map(q => form.has(q.id) ? Number(form.get(q.id)) : -1);
    const result = scorePlacement(answers, bank.questions);
    const { error } = await createSupabaseAdminClient().from("placement_results").insert({ student_id: user.id, language: bank.language, test_version: bank.version, score: result.score, band_scores: result.bandScores, skill_scores: result.skillScores, total_questions: bank.questions.length, recommendation: result.recommendation });
    if (error) return { error: "Výsledok sa nepodarilo uložiť. Skúste to znova alebo kontaktujte Mundus." };
    return { success: `Výsledok: ${result.score}/${bank.questions.length}. Odporúčaný začiatok: ${result.recommendation}. Výsledok je uložený. Lektor overí rozprávanie a vhodnú úroveň na hodine.` };
  } catch { return { error: "Skontrolujte, či ste odpovedali na všetky otázky. Ak problém pretrváva, kontaktujte Mundus." }; }
}
