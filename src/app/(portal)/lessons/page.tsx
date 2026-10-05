import { safeLessonLink } from "@/lib/lesson-link";
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
import { formatLanguage, formatLessonStatus } from "@/lib/portalLabels";
import StudentScheduleRequestActions from "./StudentScheduleRequestActions";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function LessonsPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const [
    { data: lessons, error: lessonsError },
    { data: pendingRequests, error: requestsError },
  ] = await Promise.all([
    supabase
      .from("lessons")
      .select(
        "id,scheduled_at,duration_minutes,status,attendance_status,lesson_type,meet_link,language"
      )
      .eq("student_id", user.id)
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("schedule_change_requests")
      .select("id,lesson_id,preferred_at,requested_by")
      .eq("student_id", user.id)
      .eq("status", "pending"),
  ]);

  const allLessons = lessons ?? [];
  const pendingRequestMap = new Map(
    (pendingRequests ?? []).map((request) => [
      request.lesson_id,
      request,
    ])
  );
  const pendingLessonIds = new Set(pendingRequestMap.keys());

  const upcomingLessons = allLessons.filter(
    (lesson) =>
      (lesson.status === "scheduled" ||
        lesson.status === "rescheduled") &&
      new Date(lesson.scheduled_at).getTime() >= new Date().getTime()
  );

  const pastLessons = allLessons
    .filter(
      (lesson) =>
        lesson.status === "completed" ||
        lesson.status === "student_no_show" ||
        lesson.status === "teacher_cancelled" ||
        lesson.status === "student_cancelled" ||
        lesson.status === "late_cancellation" ||
        new Date(lesson.scheduled_at).getTime() < new Date().getTime()
    )
    .reverse();

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0a0a0f]"
        >
          <ArrowLeft size={17} />
          {sk ? "Späť na prehľad" : "Back to overview"}
        </Link>

        <section className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Moje učenie" : "My learning"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Moje hodiny" : "My lessons"}
          </h1>

          <p className="mt-2 text-gray-500">
            {sk ? "Pozrite si najbližšie hodiny, pripojte sa na hodinu alebo požiadajte o zmenu termínu." : "See your upcoming lessons, join a lesson or request a schedule change."}
          </p>
        </section>

        {(lessonsError || requestsError) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Nepodarilo sa načítať vaše hodiny. Obnovte stránku alebo to skúste o chvíľu znova." : "We could not load your lessons. Refresh the page or try again shortly."}
          </div>
        )}

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">{sk ? "Rozvrh" : "Schedule"}</p>
              <h2 className="mt-1 text-xl font-semibold">
                {sk ? "Najbližšie hodiny" : "Upcoming lessons"}
              </h2>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
              {lessonsError ? (sk ? "Rozvrh nedostupný" : "Schedule unavailable") : sk ? (upcomingLessons.length === 1 ? "1 naplánovaná" : upcomingLessons.length >= 2 && upcomingLessons.length <= 4 ? `${upcomingLessons.length} naplánované` : `${upcomingLessons.length} naplánovaných`) : `${upcomingLessons.length} scheduled`}
            </span>
          </div>

          {upcomingLessons.length > 0 ? (
            <div className="mt-5 space-y-4">
              {upcomingLessons.map((lesson, index) => (
                <article
                  key={lesson.id}
                  className={`rounded-3xl p-6 shadow-sm ${
                    index === 0
                      ? "bg-[#2F3AA2] text-white"
                      : "border border-black/5 bg-white"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold">
                          {formatLanguage(lesson.language, language)} · {sk ? "hodina" : "lesson"}
                        </h3>

                        {index === 0 && (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                            {sk ? "Najbližšia" : "Next"}
                          </span>
                        )}

                        {lesson.status === "rescheduled" && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              index === 0
                                ? "bg-[#2F3AA2]/20 text-[#e8ce91]"
                                : "bg-[#fff7e6] text-[#2F3AA2]"
                            }`}
                          >
                            {sk ? "Presunutá" : "Rescheduled"}
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
                          {formatDate(lesson.scheduled_at, language)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3 size={17} />
                          {formatTime(lesson.scheduled_at, language)}
                        </span>

                        <span>
                          {lesson.duration_minutes || 60} min
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:min-w-[190px]">
                      {safeLessonLink(lesson.meet_link) ? (
                        <a
                          href={safeLessonLink(lesson.meet_link) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                            index === 0
                              ? "bg-white text-[#0a0a0f]"
                              : "bg-[#2F3AA2] text-white"
                          }`}
                        >
                          <Video size={17} />
                          {sk ? "Pripojiť sa na hodinu" : "Join lesson"}
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
                          {sk ? "Odkaz na hodinu zatiaľ nie je pridaný" : "Lesson link has not been added yet"}
                        </button>
                      )}

                      {pendingLessonIds.has(lesson.id) ? (() => {
                        const request = pendingRequestMap.get(lesson.id)!;
                        const requestedByStudent = request.requested_by === user.id;

                        return (
                          <div
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                              index === 0
                                ? "border-white/20 bg-white/5 text-white/80"
                                : "border-[#2F3AA2]/20 bg-[#faf6eb] text-[#2F3AA2]"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw size={16} />
                              {requestedByStudent
                                ? (sk ? "Vaša žiadosť čaká na vybavenie" : "Your request is pending")
                                : (sk ? "Lektor navrhol nový termín" : "Teacher proposed a new time")}
                            </div>

                            <p className={`mt-1 text-center text-xs ${
                              index === 0 ? "text-white/55" : "text-[#2F3AA2]/75"
                            }`}>
                              {sk ? "Navrhovaný termín:" : "Proposed time:"} {formatDate(request.preferred_at, language)} ·{" "}
                              {formatTime(request.preferred_at, language)}
                            </p>

                            {!requestedByStudent && (
                              <StudentScheduleRequestActions requestId={request.id} />
                            )}
                          </div>
                        );
                      })() : requestsError ? <p className="text-center text-sm">{sk ? "Stav žiadosti sa nepodarilo načítať. Obnovte stránku pred žiadosťou o zmenu." : "Request status could not be loaded. Refresh the page before requesting a change."}</p> : (
                        <Link
                          href={`/lessons/${lesson.id}/request-change`}
                          className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
                            index === 0
                              ? "border-white/20 text-white"
                              : "border-black/10 text-[#0a0a0f]"
                          }`}
                        >
                          <RefreshCw size={16} />
                          {sk ? "Požiadať o zmenu" : "Request a change"}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <CalendarDays
                size={28}
                className="mx-auto text-[#2F3AA2]"
              />

              <h3 className="mt-4 font-semibold">
                {lessonsError ? (sk ? "Rozvrh sa nepodarilo načítať" : "Schedule could not be loaded") : (sk ? "Zatiaľ nemáte naplánované hodiny" : "You do not have scheduled lessons yet")}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {lessonsError ? (sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly.") : (sk ? "Vaša najbližšia potvrdená hodina sa zobrazí tu." : "Your next confirmed lesson will appear here.")}
              </p>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">{sk ? "História" : "History"}</p>
            <h2 className="mt-1 text-xl font-semibold">
              {sk ? "Predchádzajúce hodiny" : "Previous lessons"}
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
                      {formatLanguage(lesson.language, language)} hodina
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatDate(lesson.scheduled_at, language)} ·{" "}
                      {formatTime(lesson.scheduled_at, language)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-fit rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold capitalize">
                      {formatLessonStatus(lesson.status, language)}
                    </span>
                    {lesson.attendance_status && (
                      <span className="w-fit rounded-full bg-[#FAFAF9] px-3 py-1.5 text-xs font-medium text-gray-600">
                        {lesson.attendance_status === "attended" ? (sk ? "Účasť potvrdená" : "Attendance confirmed") :
                         lesson.attendance_status === "student_no_show" ? (sk ? "Neúčasť" : "No-show") :
                         lesson.attendance_status === "late_cancellation" ? (sk ? "Neskoré zrušenie" : "Late cancellation") :
                         lesson.attendance_status === "student_cancelled" ? (sk ? "Zrušené študentom" : "Cancelled by student") :
                         lesson.attendance_status === "teacher_cancelled" ? (sk ? "Zrušené lektorom" : "Cancelled by teacher") : lesson.attendance_status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-500 shadow-sm">
              {lessonsError ? (sk ? "Históriu hodín sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova." : "Lesson history could not be loaded. Refresh the page or try again shortly.") : (sk ? "História vašich hodín sa zobrazí tu." : "Your lesson history will appear here.")}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
