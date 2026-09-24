import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Video,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

export default async function LessonsPage() {
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select(
      "id,scheduled_at,duration_minutes,status,lesson_type,meet_link,language"
    )
    .eq("student_id", user.id)
    .order("scheduled_at", { ascending: true });

  const allLessons = lessons ?? [];

  const upcomingLessons = allLessons.filter(
    (lesson) =>
      (lesson.status === "scheduled" ||
        lesson.status === "rescheduled") &&
      new Date(lesson.scheduled_at).getTime() >= Date.now()
  );

  const pastLessons = allLessons
    .filter(
      (lesson) =>
        lesson.status === "completed" ||
        new Date(lesson.scheduled_at).getTime() < Date.now()
    )
    .reverse();

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#183f38]"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <section className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            My learning
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            My lessons
          </h1>

          <p className="mt-2 text-gray-500">
            View your upcoming lessons, join your class and request
            schedule changes.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Schedule</p>
              <h2 className="mt-1 text-xl font-semibold">
                Upcoming lessons
              </h2>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
              {upcomingLessons.length} upcoming
            </span>
          </div>

          {upcomingLessons.length > 0 ? (
            <div className="mt-5 space-y-4">
              {upcomingLessons.map((lesson, index) => (
                <article
                  key={lesson.id}
                  className={`rounded-3xl p-6 shadow-sm ${
                    index === 0
                      ? "bg-[#183f38] text-white"
                      : "border border-black/5 bg-white"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold">
                          {lesson.language || "Language"} lesson
                        </h3>

                        {index === 0 && (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                            Next
                          </span>
                        )}

                        {lesson.status === "rescheduled" && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              index === 0
                                ? "bg-[#c6a65b]/20 text-[#e8ce91]"
                                : "bg-[#fff7e6] text-[#9a8049]"
                            }`}
                          >
                            Rescheduled
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-4 flex flex-wrap gap-4 text-sm ${
                          index === 0
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <CalendarDays size={17} />
                          {formatDate(lesson.scheduled_at)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3 size={17} />
                          {formatTime(lesson.scheduled_at)}
                        </span>

                        <span>
                          {lesson.duration_minutes || 60} min
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:min-w-[190px]">
                      {lesson.meet_link ? (
                        <a
                          href={lesson.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                            index === 0
                              ? "bg-white text-[#183f38]"
                              : "bg-[#183f38] text-white"
                          }`}
                        >
                          <Video size={17} />
                          Join lesson
                        </a>
                      ) : (
                        <button
                          disabled
                          className={`flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                            index === 0
                              ? "bg-white/10 text-white/50"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Video size={17} />
                          Meet link pending
                        </button>
                      )}

                      <Link
                        href={`/lessons/${lesson.id}/request-change`}
                        className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
                          index === 0
                            ? "border-white/20 text-white"
                            : "border-black/10 text-[#183f38]"
                        }`}
                      >
                        <RefreshCw size={16} />
                        Request a change
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <CalendarDays
                size={28}
                className="mx-auto text-[#9a8049]"
              />

              <h3 className="mt-4 font-semibold">
                No upcoming lessons
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your next confirmed lesson will appear here.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">History</p>
            <h2 className="mt-1 text-xl font-semibold">
              Previous lessons
            </h2>
          </div>

          {pastLessons.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              {pastLessons.slice(0, 10).map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col justify-between gap-3 border-b border-gray-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center"
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

                  <span className="w-fit rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold capitalize">
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Your lesson history will appear here.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
