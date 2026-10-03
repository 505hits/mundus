import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Check schema and service access before asking students to complete a long test.
export async function assessmentStorageReady(studentId: string) {
  try {
    const { error } = await createSupabaseAdminClient().from("placement_results")
      .select("id,assessment_kind,skill_scores,total_questions")
      .eq("student_id",studentId).limit(1);
    return !error;
  } catch { return false; }
}
