import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return profile?.full_name?.trim() || profile?.email || "Student";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "T";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function TeacherDashboardPage() {
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();

  const { data: teacherProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const now = new Date();

  const bratislavaDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Bratislava",
  }).format(now);

  const startOfToday = new Date(
    `${bratislavaDate}T00:00:00+02:00`
  ).toISOString();

  const endOfToday = new Date(
    `${bratislavaDate}T23:59:59+02:00`
  ).toISOString();

  const { data: todayLessons } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      duration_minutes,
      status,
      language,
      lesson_type,
      meet_link,
      student:profiles!lessons_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled"])
    .gte("scheduled_at", startOfToday)
    .lte("scheduled_at", endOfToday)
    .order("scheduled_at", { ascending: true });

  const { data: upcomingLessons } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      language,
      student:profiles!lessons_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled"])
    .gte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true });

  const { data: pendingRequests } = await supabase
    .from("schedule_change_requests")
    .select(`
      id,
      requested_by,
      preferred_at,
      lesson:lessons!schedule_change_requests_lesson_id_fkey (
        id,
        teacher_id,
        student_id,
        scheduled_at,
        language,
        student:profiles!lessons_student_id_fkey (
          full_name,
          email
        )
      )
    `)
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  const myPendingRequests =
    pendingRequests?.filter((request) => {
      const lesson = Array.isArray(request.lesson)
        ? request.lesson[0]
        : request.lesson;

      return (
        lesson?.teacher_id === user.id &&
        request.requested_by !== user.id
      );
    }) ?? [];

  const uniqueStudents = new Map<
    string,
    {
      id: string;
      name: string;
      language: string;
      nextLesson: string;
    }
  >();

  for (const lesson of upcomingLessons ?? []) {
    if (uniqueStudents.has(lesson.student_id)) continue;

    const student = Array.isArray(lesson.student)
      ? lesson.student[0]
      : lesson.student;

    uniqueStudents.set(lesson.student_id, {
      id: lesson.student_id,
      name: getName(student),
      language: lesson.language || "Language",
      nextLesson: lesson.scheduled_at,
    });
  }

  const students = Array.from(uniqueStudents.values());

  const teacherName =
    teacherProfile?.full_name?.trim() ||
    teacherProfile?.email ||
    user.email ||
    "Teacher";

  const firstName = teacherName.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            mundus
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{teacherName}</p>
              <p className="text-xs text-gray-400">Teacher Portal</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f38] text-sm font-semibold text-white">
              {getInitials(teacherName)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Teacher dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Hi, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here&apos;s what&apos;s happening with your students today.
          </p>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Today</p>
              <CalendarDays size={19} className="text-[#9a8049]" />
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {todayLessons?.length ?? 0}
            </p>

            <p className="mt-1 text-sm text-gray-500">lessons</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">My students</p>
              <Users size={19} className="text-[#9a8049]" />
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {students.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              upcoming students
            </p>
          </article>

          <article className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7e693a]/70">
                Change requests
              </p>
              <Clock3 size={19} className="text-[#9a8049]" />
            </div>

            <p className="mt-3 text-3xl font-semibold text-[#7e693a]">
              {myPendingRequests.length}
            </p>

            <p className="mt-1 text-sm text-[#7e693a]/70">
              waiting for you
            </p>
          </article>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Schedule</p>
              <h2 className="mt-1 text-xl font-semibold">
                Today&apos;s lessons
              </h2>
            </div>

            <Link
              href="/teacher/schedule"
              className="rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
            >
              View schedule
            </Link>
          </div>

          {!todayLessons?.length ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">No lessons today</p>
              <p className="mt-1 text-sm text-gray-400">
                Your scheduled lessons for today will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {todayLessons.map((lesson, index) => {
                const student = Array.isArray(lesson.student)
                  ? lesson.student[0]
                  : lesson.student;

                return (
                  <article
                    key={lesson.id}
                    className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                      index === 0
                        ? "border-[#183f38]/10 bg-[#183f38] text-white"
                        : "border-black/5 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold ${
                            index === 0
                              ? "bg-white/10"
                              : "bg-[#eef3ef] text-[#183f38]"
                          }`}
                        >
                          {formatTime(lesson.scheduled_at)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {getName(student)}
                            </h3>

                            {index === 0 && (
                              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                                Next
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-1 text-sm ${
                              index === 0
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {lesson.language || "Language"} ·{" "}
                            {lesson.duration_minutes || 60} min
                          </p>
                        </div>
                      </div>

                      {lesson.meet_link ? (
                        <a
                          href={lesson.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                            index === 0
                              ? "bg-white text-[#183f38]"
                              : "bg-[#eef3ef] text-[#183f38]"
                          }`}
                        >
                          <Video size={17} />
                          Join lesson
                        </a>
                      ) : (
                        <span
                          className={`rounded-xl px-4 py-3 text-sm ${
                            index === 0
                              ? "bg-white/10 text-white/60"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          Meet link not added
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {myPendingRequests.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-[#9a8049]" />
              <h2 className="text-xl font-semibold">
                Needs your attention
              </h2>
            </div>

            <div className="mt-4 rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8049]">
                Schedule changes
              </p>

              <h3 className="mt-3 font-semibold text-[#7e693a]">
                {myPendingRequests.length === 1
                  ? "1 student is waiting for your response"
                  : `${myPendingRequests.length} students are waiting for your response`}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7e693a]/75">
                Review the requested lesson times before confirming any
                changes.
              </p>

              <Link
                href="/teacher/schedule"
                className="mt-5 inline-flex rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Review requests
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Students</p>
              <h2 className="mt-1 text-xl font-semibold">
                My students
              </h2>
            </div>

            <GraduationCap size={21} className="text-[#9a8049]" />
          </div>

          {students.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">No upcoming students</p>
              <p className="mt-1 text-sm text-gray-400">
                Students with upcoming lessons will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              {students.slice(0, 6).map((student, index) => (
                <Link
                  key={student.id}
                  href="/teacher/students"
                  className={`flex items-center justify-between gap-4 p-5 transition hover:bg-[#fafbf9] sm:p-6 ${
                    index !== Math.min(students.length, 6) - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold">{student.name}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      {student.language} · Next:{" "}
                      {formatShortDate(student.nextLesson)} ·{" "}
                      {formatTime(student.nextLesson)}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-gray-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
