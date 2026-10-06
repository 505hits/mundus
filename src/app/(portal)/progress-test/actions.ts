"use server";
import { assessmentAnswers } from "@/lib/assessment-answers";
import { assessmentBank } from "@/lib/assessment-catalog";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { scorePlacement } from "@/lib/placement";
import { formUiLanguage } from "@/lib/i18n";
export async function submitProgress(_previous: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const language=formUiLanguage(form); const sk=language==="sk";
  const { user } = await requireRole("student");
  try {
    const bank = assessmentBank(form.get("assessment_language"), "progress");
    const answers = assessmentAnswers(form, bank.questions);
    const result = scorePlacement(answers, bank.questions);
    const { error } = await createSupabaseAdminClient().from("placement_results").insert({ student_id: user.id, assessment_kind: "progress", language: bank.language, test_version: bank.version, score: result.score, band_scores: result.bandScores, skill_scores: result.skillScores, total_questions: bank.questions.length, recommendation: result.recommendation });
    if (error) return { error: sk ? "Výsledok sa nepodarilo uložiť. Skúste to znova alebo kontaktujte Mundus." : "The result could not be saved. Try again or contact Mundus." };
    return { success: sk
      ? `Výsledok: ${result.score}/${bank.questions.length}. Orientačná úroveň: ${result.recommendation}. Výsledok je uložený. Lektor overí rozprávanie a vhodnú úroveň na hodine.`
      : `Result: ${result.score}/${bank.questions.length}. Indicative level: ${result.recommendation}. Your result is saved. Your teacher will confirm speaking and the appropriate level during a lesson.` };
  } catch { return { error: sk ? "Skontrolujte, či ste odpovedali na všetky otázky. Ak problém pretrváva, kontaktujte Mundus." : "Check that you answered every question. If the problem continues, contact Mundus." }; }
}
