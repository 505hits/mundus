import TeacherFeedbackForm from "./TeacherFeedbackForm";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function monthBounds() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const key = `${year}-${month}-01`;
  const start = new Date(`${key}T00:00:00+02:00`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { key, start: start.toISOString(), end: end.toISOString() };
}

export default async function FeedbackPage() {
  const { user } = await requireRole("student");
  const db = await createSupabaseServerClient();
  const month = monthBounds();

  const [
    { data: lessons, error: lessonsError },
    { data: ratings, error: ratingsError },
  ] = await Promise.all([
    db
      .from("lessons")
      .select(`
        teacher_id,
        scheduled_at,
        teacher:profiles!lessons_teacher_id_fkey (
          full_name,
          email
        )
      `)
      .eq("student_id", user.id)
      .eq("status", "completed")
      .gte("scheduled_at", month.start)
      .lt("scheduled_at", month.end)
      .order("scheduled_at", { ascending: false }),
    db
      .from("teacher_monthly_feedback")
      .select("teacher_id,rating,feedback")
      .eq("student_id", user.id)
      .eq("feedback_month", month.key),
  ]);

  if (lessonsError || ratingsError) throw new Error("Monthly teacher feedback is unavailable");

  const ratingMap = new Map((ratings ?? []).map((item) => [item.teacher_id, item]));
  const teachers = new Map<string, { id: string; name: string; lessons: number }>();

  for (const lesson of lessons ?? []) {
    const teacher = Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher;
    const existing = teachers.get(lesson.teacher_id);
    if (existing) {
      existing.lessons += 1;
      continue;
    }
    teachers.set(lesson.teacher_id, {
      id: lesson.teacher_id,
      name: teacher?.full_name?.trim() || teacher?.email || "Lektor Mundus",
      lessons: 1,
    });
  }

  const monthLabel = new Intl.DateTimeFormat("sk-SK", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(month.start));

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Hodnotenie lektora</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Ako sa vám tento mesiac učilo?</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Raz mesačne môžete ohodnotiť každého lektora, s ktorým ste mali dokončenú hodinu. Hodnotenie môžete počas mesiaca ešte upraviť.
          </p>
          <p className="mt-2 text-sm font-medium text-[#2F3AA2]">{monthLabel}</p>
        </section>

        {teachers.size === 0 ? (
          <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="font-medium">Tento mesiac zatiaľ nemáte dokončenú hodinu.</p>
            <p className="mt-1 text-sm text-gray-500">Hodnotenie sa sprístupní po dokončení hodiny s lektorom.</p>
          </section>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {Array.from(teachers.values()).map((teacher) => {
              const existing = ratingMap.get(teacher.id);
              return (
                <div key={teacher.id}>
                  <TeacherFeedbackForm
                    teacherId={teacher.id}
                    teacherName={teacher.name}
                    feedbackMonth={month.key}
                    initialRating={existing?.rating ?? null}
                    initialFeedback={existing?.feedback ?? ""}
                  />
                  <p className="mt-2 px-1 text-xs text-gray-400">
                    Dokončené hodiny s týmto lektorom tento mesiac: {teacher.lessons}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
