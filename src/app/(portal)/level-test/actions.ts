"use server";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PLACEMENT_QUESTIONS, PLACEMENT_VERSION, scorePlacement } from "@/lib/placement";
export async function submitPlacement(_previous: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const { user } = await requireRole("student");
  try {
    const answers = PLACEMENT_QUESTIONS.map(q => form.has(q.id) ? Number(form.get(q.id)) : -1);
    const result = scorePlacement(answers);
    const { error } = await createSupabaseAdminClient().from("placement_results").insert({ student_id: user.id, language: "Angličtina", test_version: PLACEMENT_VERSION, score: result.score, band_scores: result.bandScores, skill_scores: result.skillScores, total_questions: PLACEMENT_QUESTIONS.length, recommendation: result.recommendation });
    if (error) return { error: "Výsledok sa nepodarilo uložiť. Skúste to znova alebo kontaktujte Mundus." };
    return { success: `Výsledok: ${result.score}/${PLACEMENT_QUESTIONS.length}. Odporúčaný začiatok: ${result.recommendation}. Výsledok je uložený. Lektor overí rozprávanie a vhodnú úroveň na hodine.` };
  } catch { return { error: "Skontrolujte, či ste odpovedali na všetky otázky. Ak problém pretrváva, kontaktujte Mundus." }; }
}
