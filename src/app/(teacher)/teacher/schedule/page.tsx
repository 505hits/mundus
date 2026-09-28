import {
  CalendarDays,
  Clock3,
  RefreshCw,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ScheduleRequestActions from "./ScheduleRequestActions";

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

function studentName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return (
    profile?.full_name?.trim() ||
    profile?.email ||
    "Student"
  );
}

export default async function TeacherSchedulePage() {
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();

  const now = new Date().toISOString();

  const { data: lessons } = await supabase
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
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(20);

  const { data: requests } = await supabase
    .from("schedule_change_requests")
    .select(`
      id,
      lesson_id,
      student_id,
      requested_by,
      preferred_at,
      alternative_at,
      message,
      status,
      lesson:lessons!schedule_change_requests_lesson_id_fkey (
        id,
        teacher_id,
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

  const teacherRequests =
    requests?.filter((request) => {
      const lesson = Array.isArray(request.lesson)
        ? request.lesson[0]
        : request.lesson;

      return (
        lesson?.teacher_id === user.id &&
        request.requested_by !== user.id
      );
    }) ?? [];

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Schedule
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your lessons
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your upcoming lessons and student schedule requests.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <RefreshCw size={19} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">
              Change requests
            </h2>

            {teacherRequests.length > 0 && (
              <span className="rounded-full bg-[#f3ead4] px-2.5 py-1 text-xs font-semibold text-[#8a713d]">
                {teacherRequests.length}
              </span>
            )}
          </div>

          {teacherRequests.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">No pending requests</p>
              <p className="mt-1 text-sm text-gray-400">
                Student schedule-change requests will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {teacherRequests.map((request) => {
                const lesson = Array.isArray(request.lesson)
                  ? request.lesson[0]
                  : request.lesson;

                if (!lesson) return null;

                const student = Array.isArray(lesson.student)
                  ? lesson.student[0]
                  : lesson.student;

                return (
                  <article
                    key={request.id}
                    className="rounded-3xl border border-[#c6a65b]/20 bg-[#faf6eb] p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#7e693a]">
                            {studentName(student)}
                          </p>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#9a8049]">
                            New request
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#7e693a]/70">
                          {lesson.language || "Language"} lesson
                        </p>

                        <div className="mt-4 space-y-2 text-sm text-[#7e693a]">
                          <p>
                            <strong>Current:</strong>{" "}
                            {formatDate(lesson.scheduled_at)} ·{" "}
                            {formatTime(lesson.scheduled_at)}
                          </p>

                          <p>
                            <strong>Requested:</strong>{" "}
                            {formatDate(request.preferred_at)} ·{" "}
                            {formatTime(request.preferred_at)}
                          </p>
                        </div>

                        {request.message && (
                          <p className="mt-3 text-sm italic text-[#7e693a]/65">
                            “{request.message}”
                          </p>
                        )}
                      </div>

                      <ScheduleRequestActions
                        requestId={request.id}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400">
            The original lesson stays confirmed until a change is accepted.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Upcoming</p>
              <h2 className="mt-1 text-xl font-semibold">
                Scheduled lessons
              </h2>
            </div>

            <CalendarDays size={21} className="text-[#9a8049]" />
          </div>

          {!lessons?.length ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                No upcoming lessons
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Your confirmed lessons will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {lessons.map((lesson, index) => {
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
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
                            index === 0
                              ? "bg-white/10"
                              : "bg-[#eef3ef]"
                          }`}
                        >
                          <Clock3 size={18} />
                          <span className="mt-1 text-sm font-semibold">
                            {formatTime(lesson.scheduled_at)}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {studentName(student)}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                index === 0
                                  ? "bg-white/10"
                                  : "bg-[#eef3ef] text-[#527064]"
                              }`}
                            >
                              {index === 0 ? "Next" : "Scheduled"}
                            </span>
                          </div>

                          <p
                            className={`mt-2 text-sm ${
                              index === 0
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {lesson.language || "Language"} ·{" "}
                            {lesson.duration_minutes || 60} min
                          </p>

                          <p
                            className={`mt-1 text-sm ${
                              index === 0
                                ? "text-white/60"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDate(lesson.scheduled_at)}
                          </p>
                        </div>
                      </div>

                      {lesson.meet_link ? (
                        <a
                          href={lesson.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
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
                          className={`rounded-xl px-4 py-2.5 text-sm ${
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
      </div>
    </main>
  );
}
