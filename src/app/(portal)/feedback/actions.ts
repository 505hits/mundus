"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { currentBratislavaMonth } from "@/lib/month";

export type TeacherFeedbackState = { error?: string; success?: string };

export async function saveTeacherFeedback(
  _state: TeacherFeedbackState,
  form: FormData
): Promise<TeacherFeedbackState> {
  const { user } = await requireRole("student");
  const teacherId = String(form.get("teacher_id") ?? "");
  const feedbackMonth = String(form.get("feedback_month") ?? "");
  const rating = Number(form.get("rating"));
  const feedback = String(form.get("feedback") ?? "").trim();
  const allowedCategories = ["preparation","explanation","conversation","friendly","punctuality"];
  const categories = [...new Set(form.getAll("categories").filter((value): value is string => typeof value === "string" && allowedCategories.includes(value)))];

  if (
    !/^[0-9a-f-]{36}$/i.test(teacherId) ||
    feedbackMonth !== currentBratislavaMonth().key ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    feedback.length > 1500 ||
    categories.length > allowedCategories.length
  ) {
    return { error: "Skontrolujte hodnotenie a skúste to znova." };
  }

  const db = await createSupabaseServerClient();
  const month = currentBratislavaMonth();

  const { data: completedLesson, error: lessonError } = await db
    .from("lessons")
    .select("id")
    .eq("student_id", user.id)
    .eq("teacher_id", teacherId)
    .eq("status", "completed")
    .gte("scheduled_at", month.start)
    .lt("scheduled_at", month.end)
    .limit(1)
    .maybeSingle();

  if (lessonError || !completedLesson) {
    return { error: "Hodnotiť môžete iba lektora, s ktorým ste mali tento mesiac dokončenú hodinu." };
  }

  const { data: existing, error: existingError } = await db
    .from("teacher_monthly_feedback")
    .select("id")
    .eq("student_id", user.id)
    .eq("teacher_id", teacherId)
    .eq("feedback_month", feedbackMonth)
    .maybeSingle();

  if (existingError) return { error: "Hodnotenie sa nepodarilo načítať. Skúste znova." };

  const values = {
    rating,
    feedback,
    categories,
    updated_at: new Date().toISOString(),
  };

  const result = existing
    ? await db.from("teacher_monthly_feedback").update(values).eq("id", existing.id).select("id").maybeSingle()
    : await db.from("teacher_monthly_feedback").insert({
        student_id: user.id,
        teacher_id: teacherId,
        feedback_month: feedbackMonth,
        ...values,
      }).select("id").maybeSingle();

  if (result.error || !result.data) {
    return { error: "Hodnotenie sa nepodarilo uložiť. Skúste znova." };
  }

  revalidatePath("/feedback");
  revalidatePath("/admin/teacher-ranking");
  return { success: existing ? "Hodnotenie bolo aktualizované." : "Ďakujeme, hodnotenie bolo uložené." };
}
