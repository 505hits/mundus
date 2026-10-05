"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TeacherFeedbackState = { error?: string; success?: string };

function currentMonthStart() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return year && month ? `${year}-${month}-01` : "";
}

export async function saveTeacherFeedback(
  _state: TeacherFeedbackState,
  form: FormData
): Promise<TeacherFeedbackState> {
  const { user } = await requireRole("student");
  const teacherId = String(form.get("teacher_id") ?? "");
  const feedbackMonth = String(form.get("feedback_month") ?? "");
  const rating = Number(form.get("rating"));
  const feedback = String(form.get("feedback") ?? "").trim();

  if (
    !/^[0-9a-f-]{36}$/i.test(teacherId) ||
    feedbackMonth !== currentMonthStart() ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    feedback.length > 1500
  ) {
    return { error: "Skontrolujte hodnotenie a skúste to znova." };
  }

  const db = await createSupabaseServerClient();
  const monthStart = new Date(`${feedbackMonth}T00:00:00+02:00`);
  const monthEnd = new Date(monthStart);
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);

  const { data: completedLesson, error: lessonError } = await db
    .from("lessons")
    .select("id")
    .eq("student_id", user.id)
    .eq("teacher_id", teacherId)
    .eq("status", "completed")
    .gte("scheduled_at", monthStart.toISOString())
    .lt("scheduled_at", monthEnd.toISOString())
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
