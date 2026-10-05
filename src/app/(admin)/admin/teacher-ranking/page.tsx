import { Star, Trophy, Users, CalendarDays } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BRATISLAVA_TIME_ZONE, currentBratislavaMonth, parseBratislavaMonth } from "@/lib/month";

export default async function TeacherRankingPage({
  searchParams,
}: {
  searchParams?: Promise<{ month?: string | string[] }>;
}) {
  await requireRole("admin");
  const db = await createSupabaseServerClient();
  const params = await searchParams;
  const requestedMonth = Array.isArray(params?.month) ? params?.month[0] : params?.month;
  const currentMonth = currentBratislavaMonth();
  const parsedMonth = parseBratislavaMonth(requestedMonth);
  const month = parsedMonth && parsedMonth.key <= currentMonth.key ? parsedMonth : currentMonth;

  const [
    { data: teachers, error: teachersError },
    { data: lessons, error: lessonsError },
    { data: feedback, error: feedbackError },
  ] = await Promise.all([
    db.from("profiles").select("id,full_name,email,status").eq("role", "teacher"),
    db.from("lessons")
      .select("teacher_id,student_id")
      .eq("status", "completed")
      .gte("scheduled_at", month.start)
      .lt("scheduled_at", month.end),
    db.from("teacher_monthly_feedback")
      .select(`
        id,teacher_id,student_id,rating,feedback,updated_at,
        student:profiles!teacher_monthly_feedback_student_id_fkey(full_name,email)
      `)
      .eq("feedback_month", month.key)
      .order("updated_at", { ascending: false }),
  ]);

  if (teachersError || lessonsError || feedbackError) throw new Error("Teacher ranking is unavailable");

  const rows = (teachers ?? []).map((teacher) => {
    const teacherLessons = (lessons ?? []).filter((lesson) => lesson.teacher_id === teacher.id);
    const teacherFeedback = (feedback ?? []).filter((item) => item.teacher_id === teacher.id);
    const average = teacherFeedback.length
      ? teacherFeedback.reduce((sum, item) => sum + Number(item.rating), 0) / teacherFeedback.length
      : null;

    return {
      ...teacher,
      completedLessons: teacherLessons.length,
      uniqueStudents: new Set(teacherLessons.map((lesson) => lesson.student_id)).size,
      average,
      responses: teacherFeedback.length,
    };
  }).sort((a, b) => {
    if (a.average === null && b.average !== null) return 1;
    if (a.average !== null && b.average === null) return -1;
    if (a.average !== null && b.average !== null && b.average !== a.average) return b.average - a.average;
    if (b.responses !== a.responses) return b.responses - a.responses;
    return b.completedLessons - a.completedLessons;
  });

  const monthLabel = new Intl.DateTimeFormat("sk-SK", {
    month: "long",
    year: "numeric",
    timeZone: BRATISLAVA_TIME_ZONE,
  }).format(new Date(month.start));

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Výkon lektorov</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Mesačný rebríček lektorov</h1>
          <p className="mt-2 text-gray-500">Hodnotenia študentov spolu s počtom dokončených hodín a aktívnych študentov.</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <p className="text-sm font-medium text-[#2F3AA2]">{monthLabel}</p>
            </div>
            <form method="get" className="flex items-end gap-2">
              <label className="block">
                <span className="block text-xs font-medium text-gray-500">Zobraziť mesiac</span>
                <input
                  type="month"
                  name="month"
                  defaultValue={month.key.slice(0, 7)}
                  max={currentMonth.key.slice(0, 7)}
                  className="mt-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </label>
              <button type="submit" className="rounded-xl bg-[#2F3AA2] px-4 py-2 text-sm font-semibold text-white">
                Zobraziť
              </button>
            </form>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="hidden grid-cols-[0.35fr_1.6fr_0.7fr_0.7fr_0.7fr] gap-4 border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400 lg:grid">
            <span>#</span><span>Lektor</span><span>Hodnotenie</span><span>Hodiny</span><span>Študenti</span>
          </div>
          <div className="divide-y divide-gray-100">
            {rows.map((teacher, index) => (
              <div key={teacher.id} className="grid gap-3 px-5 py-5 lg:grid-cols-[0.35fr_1.6fr_0.7fr_0.7fr_0.7fr] lg:items-center lg:px-6">
                <div className="flex items-center gap-2 font-semibold text-[#2F3AA2]">
                  {index === 0 && <Trophy size={16} />}
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold">{teacher.full_name?.trim() || teacher.email || "Lektor"}</p>
                  <p className="mt-1 text-xs text-gray-400">{teacher.status === "active" ? "Aktívny" : "Neaktívny"}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-semibold">
                    <Star size={16} className="text-[#2F3AA2]" fill="currentColor" />
                    {teacher.average === null ? "—" : teacher.average.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{teacher.responses} hodnotení</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-semibold"><CalendarDays size={16} />{teacher.completedLessons}</p>
                  <p className="mt-1 text-xs text-gray-400">dokončených</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-semibold"><Users size={16} />{teacher.uniqueStudents}</p>
                  <p className="mt-1 text-xs text-gray-400">študentov</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm text-gray-400">Spätná väzba</p>
          <h2 className="mt-1 text-xl font-semibold">Komentáre študentov</h2>

          {(feedback ?? []).filter((item) => item.feedback?.trim()).length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Tento mesiac zatiaľ neprišla žiadna textová spätná väzba.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {(feedback ?? []).filter((item) => item.feedback?.trim()).map((item) => {
                const teacher = (teachers ?? []).find((entry) => entry.id === item.teacher_id);
                const student = Array.isArray(item.student) ? item.student[0] : item.student;
                return (
                  <article key={item.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{teacher?.full_name?.trim() || teacher?.email || "Lektor"}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          od {student?.full_name?.trim() || student?.email || "študenta"}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-semibold text-[#2F3AA2]">
                        <Star size={14} fill="currentColor" /> {item.rating}
                      </span>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">{item.feedback}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
