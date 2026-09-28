import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  MessageCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProgressPage() {
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const [{ data: lessons }, { data: packages }, { data: reports }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select(
          "id,scheduled_at,status,language,lesson_type"
        )
        .eq("student_id", user.id)
        .order("scheduled_at", { ascending: false }),

      supabase
        .from("lesson_packages")
        .select(
          "id,total_lessons,used_lessons,remaining_lessons,status"
        )
        .eq("student_id", user.id)
        .eq("status", "active")
        .order("purchased_at", { ascending: false }),

      supabase
        .from("lesson_reports")
        .select(
          "id,lesson_id,topic,progress,student_note,homework,next_focus,updated_at"
        )
        .eq("student_id", user.id)
        .order("updated_at", { ascending: false }),
    ]);

  const allLessons = lessons ?? [];

  const completedLessons = allLessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const activePackages = packages ?? [];
  const teacherReports = reports ?? [];
  const latestReport = teacherReports[0] ?? null;

  const totalLessons = activePackages.reduce(
    (sum, pkg) => sum + (pkg.total_lessons ?? 0),
    0
  );

  const usedLessons = activePackages.reduce(
    (sum, pkg) => sum + (pkg.used_lessons ?? 0),
    0
  );

  const remainingLessons = activePackages.reduce(
    (sum, pkg) => sum + (pkg.remaining_lessons ?? 0),
    0
  );

  const packageProgress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((usedLessons / totalLessons) * 100)
        )
      : 0;

  const language =
    allLessons.find((lesson) => lesson.language)?.language ||
    "Your language";

  const nextFocus =
    latestReport?.next_focus ||
    "Your teacher will add your next learning focus after a lesson.";

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Bratislava",
    }).format(new Date(value));
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium transition hover:text-[#9a8049]"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <p className="text-sm font-semibold">
            Mundus Learning Portal
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My progress
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            See how far you&apos;ve come
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Follow your real Mundus learning activity and see the latest
            feedback from your teacher.
          </p>
        </section>

        {/* Current learning */}
        <section className="mt-8 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/55">
                Current learning
              </p>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-semibold">
                  {language}
                </span>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                Your progress here is based on lessons and teacher reports
                recorded in your Mundus account. A CEFR level is shown only
                when Mundus has a recorded assessment for you.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <TrendingUp size={26} />
            </div>
          </div>
        </section>

        {/* Real stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2
              size={20}
              className="text-[#9a8049]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {completedLessons.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Lessons completed
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays
              size={20}
              className="text-[#9a8049]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {remainingLessons}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Lessons remaining
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <FileText
              size={20}
              className="text-[#9a8049]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {teacherReports.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Teacher reports
            </p>
          </article>
        </section>

        {/* Package progress */}
        {totalLessons > 0 && (
          <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  Current package
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Your lesson progress
                </h2>
              </div>

              <BookOpen
                size={21}
                className="text-[#9a8049]"
              />
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf0ec]">
              <div
                className="h-full rounded-full bg-[#183f38]"
                style={{
                  width: `${packageProgress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-gray-500">
              <span>
                {usedLessons} of {totalLessons} lessons completed
              </span>

              <span>{packageProgress}%</span>
            </div>
          </section>
        )}

        {/* Next focus */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#9a8049]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Next focus
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {nextFocus}
              </h2>

              {!latestReport && (
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Your teacher has not added a learning focus yet. It will
                  appear here after a report is saved.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Latest teacher feedback */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Latest teacher feedback
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {latestReport?.topic ||
                  "No teacher report yet"}
              </h2>
            </div>

            <div className="rounded-2xl bg-[#eef3ef] p-3">
              <MessageCircle size={22} />
            </div>
          </div>

          {latestReport ? (
            <>
              {latestReport.progress && (
                <span className="mt-5 inline-flex rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#527064]">
                  {latestReport.progress}
                </span>
              )}

              {latestReport.student_note ? (
                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
                  {latestReport.student_note}
                </p>
              ) : (
                <p className="mt-5 text-sm text-gray-500">
                  Your teacher has not added a student-visible note to this
                  report.
                </p>
              )}

              {latestReport.homework && (
                <div className="mt-6 rounded-2xl bg-[#f7f8f5] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8049]">
                    Homework
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {latestReport.homework}
                  </p>
                </div>
              )}

              <p className="mt-5 text-xs text-gray-400">
                Updated {formatDate(latestReport.updated_at)}
              </p>
            </>
          ) : (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-500">
              Your latest teacher feedback will appear here once your teacher
              saves a lesson report.
            </p>
          )}
        </section>

        {/* Completed lessons */}
        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">
              Recent activity
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Completed lessons
            </h2>
          </div>

          {completedLessons.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              {completedLessons.slice(0, 10).map(
                (lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${
                      index !==
                      Math.min(completedLessons.length, 10) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {lesson.lesson_type ||
                          lesson.language ||
                          "Lesson"}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatDate(lesson.scheduled_at)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#527064]">
                      Completed
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                No completed lessons yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Your lesson history will appear here after your first
                completed lesson.
              </p>
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Mundus Learning Portal
        </p>
      </div>
    </main>
  );
}
