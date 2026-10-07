import TeacherFeedbackForm from "./TeacherFeedbackForm";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BRATISLAVA_TIME_ZONE, currentBratislavaMonth } from "@/lib/month";
import { currentLanguage, localeFor } from "@/lib/i18n";

export default async function FeedbackPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const db = await createSupabaseServerClient();
  const month = currentBratislavaMonth();

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
      .select("teacher_id,rating,feedback,categories")
      .eq("student_id", user.id)
      .eq("feedback_month", month.key),
  ]);

  const loadError = Boolean(lessonsError || ratingsError);

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
      name: teacher?.full_name?.trim() || teacher?.email || (sk ? "Lektor Mundus" : "Mundus teacher"),
      lessons: 1,
    });
  }

  const monthLabel = new Intl.DateTimeFormat(localeFor(language), {
    month: "long",
    year: "numeric",
    timeZone: BRATISLAVA_TIME_ZONE,
  }).format(new Date(month.start));

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Hodnotenie lektora" : "Teacher feedback"}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Ako sa vám tento mesiac učilo?" : "How was learning this month?"}</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            {sk ? "Raz mesačne môžete ohodnotiť každého lektora, s ktorým ste mali dokončenú hodinu. Hodnotenie môžete počas mesiaca ešte upraviť." : "Once per month, you can rate every teacher you completed a lesson with. You can update the rating during the month."}
          </p>
          <p className="mt-2 text-sm font-medium text-[#2F3AA2]">{monthLabel}</p>
        </section>

        {loadError && (
          <div role="alert" aria-live="polite" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Hodnotenie lektorov sa momentálne nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova." : "Teacher feedback could not be loaded right now. Refresh the page or try again shortly."}
          </div>
        )}

        {!loadError && teachers.size === 0 ? (
          <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="font-medium">{sk ? "Tento mesiac zatiaľ nemáte dokončenú hodinu." : "You do not have a completed lesson this month yet."}</p>
            <p className="mt-1 text-sm text-gray-500">{sk ? "Hodnotenie sa sprístupní po dokončení hodiny s lektorom." : "Feedback becomes available after you complete a lesson with a teacher."}</p>
          </section>
        ) : !loadError ? (
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
                    initialCategories={existing?.categories ?? []}
                  />
                  <p className="mt-2 px-1 text-xs text-gray-400">
                    {sk ? "Dokončené hodiny s týmto lektorom tento mesiac:" : "Completed lessons with this teacher this month:"} {teacher.lessons}
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
