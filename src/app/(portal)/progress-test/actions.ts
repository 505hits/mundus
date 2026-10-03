"use server";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { scorePlacement } from "@/lib/placement";
import { PROGRESS_QUESTIONS, PROGRESS_VERSION } from "@/lib/progress-assessment";
export async function submitProgress(_previous: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const { user } = await requireRole("student");
  try {
    const answers = PROGRESS_QUESTIONS.map(q => form.has(q.id) ? Number(form.get(q.id)) : -1);
    const result = scorePlacement(answers, PROGRESS_QUESTIONS);
    const { error } = await createSupabaseAdminClient().from("placement_results").insert({ student_id: user.id, assessment_kind: "progress", language: "Angličtina", test_version: PROGRESS_VERSION, score: result.score, band_scores: result.bandScores, skill_scores: result.skillScores, total_questions: PROGRESS_QUESTIONS.length, recommendation: result.recommendation });
    if (error) return { error: "Výsledok sa nepodarilo uložiť. Skúste to znova alebo kontaktujte Mundus." };
    return { success: `Výsledok: ${result.score}/${PROGRESS_QUESTIONS.length}. Orientačná úroveň: ${result.recommendation}. Výsledok je uložený. Lektor overí rozprávanie a vhodnú úroveň na hodine.` };
  } catch { return { error: "Skontrolujte, či ste odpovedali na všetky otázky. Ak problém pretrváva, kontaktujte Mundus." }; }
}
