import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Check schema and service access before asking students to complete a long test.
export async function assessmentStorageReady(studentId: string, code = "en") {
  try {
    const admin=createSupabaseAdminClient();
    const { error } = await admin.from("placement_results")
      .select("id,assessment_kind,skill_scores,total_questions")
      .eq("student_id",studentId).limit(1);
    if(error)return false;
    if(code === "de") { const {data,error:languageError}=await admin.rpc("mundus_german_assessments_ready"); return !languageError && data === true; }
    if(code === "es") { const {data,error:languageError}=await admin.rpc("mundus_spanish_assessments_ready"); return !languageError && data === true; }
    if(code === "it") { const {data,error:languageError}=await admin.rpc("mundus_italian_assessments_ready"); return !languageError && data === true; }
    if(code === "fr") { const {data,error:languageError}=await admin.rpc("mundus_french_assessments_ready"); return !languageError && data === true; }
    if(code === "pt") { const {data,error:languageError}=await admin.rpc("mundus_portuguese_assessments_ready"); return !languageError && data === true; }
    return code === "en";
  } catch { return false; }
}
