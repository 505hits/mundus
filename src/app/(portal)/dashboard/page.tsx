import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
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

export default async function DashboardPage() {
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const [{ data: profile }, { data: packages }, { data: lessons }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single(),

      supabase
        .from("lesson_packages")
        .select(
          "id,total_lessons,remaining_lessons,used_lessons,status"
        )
        .eq("student_id", user.id)
        .eq("status", "active")
        .order("purchased_at", { ascending: false })
        .limit(1),

      supabase
        .from("lessons")
        .select(
          "id,scheduled_at,duration_minutes,status,lesson_type,meet_link,language"
        )
        .eq("student_id", user.id)
        .in("status", ["scheduled", "rescheduled"])
        .order("scheduled_at", { ascending: true })
        .limit(5),
    ]);

  const activePackage = packages?.[0] ?? null;
  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0] ?? null;

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] || "there";

  const totalLessons = activePackage?.total_lessons ?? 0;
  const usedLessons = activePackage?.used_lessons ?? 0;
  const remainingLessons = activePackage?.remaining_lessons ?? 0;

  const progress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((usedLessons / totalLessons) * 100)
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            mundus
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#183f38]">
                Student Portal
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f38] text-sm font-semibold text-white">
              {(
                profile?.full_name?.trim()?.[0] ||
                user.email?.[0] ||
                "S"
              ).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My learning
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Your Mundus learning overview.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-[#183f38] p-6 text-white shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Your next lesson
                </p>

                {nextLesson ? (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {nextLesson.language || "Language"} ·{" "}
                      {nextLesson.lesson_type || "Lesson"}
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {formatDate(nextLesson.scheduled_at)}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={17} />
                        {formatTime(nextLesson.scheduled_at)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-white/60">
                      {nextLesson.duration_minutes || 60}-minute Mundus
                      lesson
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      No lesson scheduled yet
                    </h2>

                    <p className="mt-4 text-sm text-white/60">
                      Your next confirmed lesson will appear here.
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <GraduationCap size={25} />
              </div>
            </div>

            {nextLesson && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {nextLesson.meet_link ? (
                  <a
                    href={nextLesson.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-semibold text-[#183f38]"
                  >
                    <Video size={18} />
                    Join lesson
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/70 px-5 py-3.5 font-semibold text-[#183f38]/60"
                  >
                    <Video size={18} />
                    Meet link coming soon
                  </button>
                )}

                <Link
                  href="/lessons"
                  className="rounded-2xl border border-white/20 px-5 py-3.5 text-center font-medium text-white"
                >
                  Request a change
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-gray-500">
              Current package
            </p>

            {activePackage ? (
              <>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight">
                    {remainingLessons}
                  </span>
                  <span className="pb-1 text-gray-400">
                    lessons left
                  </span>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#edf0ec]">
                  <div
                    className="h-full rounded-full bg-[#c6a65b]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {usedLessons} of {totalLessons} lessons completed
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-gray-500">
                No active lesson package is assigned yet.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Learning journey
                </h2>
              </div>

              <div className="rounded-2xl bg-[#eef3ef] p-3">
                <BookOpen size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Your level and progress will appear here as your teacher
              adds assessments.
            </p>

            <Link
              href="/progress"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#9a8049]"
            >
              View my progress
              <ChevronRight size={16} />
            </Link>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Homework</p>
                <h2 className="mt-1 text-xl font-semibold">
                  No homework due
                </h2>
              </div>

              <div className="rounded-2xl bg-[#f7f2e7] p-3 text-[#9a8049]">
                <FileText size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              New assignments from your teacher will appear here.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Schedule</p>
              <h2 className="mt-1 text-xl font-semibold">
                Upcoming lessons
              </h2>
            </div>

            <CalendarDays size={21} className="text-[#9a8049]" />
          </div>

          {upcomingLessons.length > 0 ? (
            <div className="mt-6 divide-y divide-gray-100">
              {upcomingLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {lesson.language || "Language"} lesson
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatDate(lesson.scheduled_at)} ·{" "}
                      {formatTime(lesson.scheduled_at)}
                    </p>
                  </div>

                  {index === 0 ? (
                    <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold">
                      Next
                    </span>
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-gray-300"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              No upcoming lessons scheduled.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
