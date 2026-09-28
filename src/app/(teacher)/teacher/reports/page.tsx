import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LessonReportForm from "./LessonReportForm";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function getStudentName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return profile?.full_name?.trim() || profile?.email || "Student";
}

export default async function TeacherReportsPage() {
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      language,
      lesson_type,
      status,
      student:profiles!lessons_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq("teacher_id", user.id)
    .eq("status", "completed")
    .order("scheduled_at", { ascending: false })
    .limit(20);

  const lessonIds = (lessons ?? []).map((lesson) => lesson.id);

  const { data: reports, error: reportsError } = lessonIds.length
    ? await supabase
        .from("lesson_reports")
        .select(`
          id,
          lesson_id,
          topic,
          progress,
          student_note,
          homework,
          next_focus,
          private_teacher_note,
          created_at,
          updated_at
        `)
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  const reportMap = new Map(
    (reports ?? []).map((report) => [report.lesson_id, report])
  );

  const recentLessons = lessons ?? [];

  const completedReports = recentLessons.filter((lesson) =>
    reportMap.has(lesson.id)
  ).length;

  const missingReports = recentLessons.length - completedReports;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Reports
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Lesson reports
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Add a short update after each completed lesson so the student&apos;s
            learning journey stays up to date.
          </p>
        </section>

        {(lessonsError || reportsError) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            We couldn&apos;t load all lesson report data. Please refresh the
            page or try again shortly.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <ClipboardList size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {recentLessons.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Recent lessons
            </p>
          </div>

          <div className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-5">
            <AlertCircle size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold text-[#7e693a]">
              {missingReports}
            </p>

            <p className="mt-1 text-sm text-[#7e693a]/70">
              Reports needed
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {completedReports}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Completed reports
            </p>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm text-gray-400">
            Recent activity
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Completed lessons
          </h2>

          {recentLessons.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                No completed lessons yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Reports will become available after completed lessons.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {recentLessons.map((lesson) => {
                const student = Array.isArray(lesson.student)
                  ? lesson.student[0]
                  : lesson.student;

                const report = reportMap.get(lesson.id);

                return (
                  <article
                    key={lesson.id}
                    className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                      report
                        ? "border-black/5 bg-white"
                        : "border-[#c6a65b]/20 bg-[#faf6eb]"
                    }`}
                  >
                    <div className="flex flex-col gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {getStudentName(student)}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              report
                                ? "bg-[#eef3ef] text-[#527064]"
                                : "bg-white text-[#9a8049]"
                            }`}
                          >
                            {report
                              ? "Report completed"
                              : "Report needed"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          {lesson.language || "Language"} ·{" "}
                          {lesson.lesson_type || "Lesson"}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                          <Clock3 size={15} />
                          {formatDate(lesson.scheduled_at)} ·{" "}
                          {formatTime(lesson.scheduled_at)}
                        </div>
                      </div>

                      <LessonReportForm
                        lessonId={lesson.id}
                        studentId={lesson.student_id}
                        existingReport={report ?? null}
                      />
                    </div>
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
