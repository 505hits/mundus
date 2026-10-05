import { teacherDirectory } from "@/lib/teacher-directory";
import { safeLessonLink } from "@/lib/lesson-link";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  RefreshCw,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage } from "@/lib/portalLabels";
import ScheduleRequestActions from "./ScheduleRequestActions";
import LessonStatusActions from "./LessonStatusActions";
import EditLessonForm from "./EditLessonForm";
import ProposeScheduleChangeForm from "./ProposeScheduleChangeForm";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    day: "numeric",
    month: "long",
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
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();
  const studentDirectory = await teacherDirectory(supabase);

  const now = new Date().toISOString();

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      package_id,
      scheduled_at,
      duration_minutes,
      status,
      language,
      lesson_type,
      meet_link,
      student:profiles!lessons_student_id_fkey (
        full_name
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled"])
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(20);

  const sevenDaysAgo = new Date(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: overdueLessons, error: overdueError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      package_id,
      scheduled_at,
      duration_minutes,
      status,
      language,
      lesson_type,
      meet_link,
      student:profiles!lessons_student_id_fkey (
        full_name
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled"])
    .gte("scheduled_at", sevenDaysAgo)
    .lt("scheduled_at", now)
    .order("scheduled_at", { ascending: false })
    .limit(10);

  const { data: requests, error: requestsError } = await supabase
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
        student_id,
        scheduled_at,
        language,
        student:profiles!lessons_student_id_fkey (
          full_name
        )
      )
    `)
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  if (lessonsError || overdueError || requestsError) {
    throw new Error("Teacher schedule data is unavailable");
  }

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

  const outgoingRequests =
    requests?.filter((request) => {
      const lesson = Array.isArray(request.lesson)
        ? request.lesson[0]
        : request.lesson;

      return (
        lesson?.teacher_id === user.id &&
        request.requested_by === user.id
      );
    }) ?? [];

  const pendingLessonIds = new Set(
    (requests ?? [])
      .filter((request) => {
        const lesson = Array.isArray(request.lesson)
          ? request.lesson[0]
          : request.lesson;
        return lesson?.teacher_id === user.id;
      })
      .map((request) => request.lesson_id)
  );

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Rozvrh" : "Schedule"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Vaše hodiny" : "Your lessons"}
          </h1>

          <p className="mt-2 text-gray-500">
            {sk ? "Majte prehľad o najbližších hodinách a žiadostiach študentov o zmenu termínu." : "Keep track of upcoming lessons and student schedule-change requests."}
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <RefreshCw size={19} className="text-[#2F3AA2]" />
            <h2 className="text-xl font-semibold">
              {sk ? "Žiadosti o zmenu termínu" : "Schedule change requests"}
            </h2>

            {teacherRequests.length > 0 && (
              <span className="rounded-full bg-[#f3ead4] px-2.5 py-1 text-xs font-semibold text-[#8a713d]">
                {teacherRequests.length}
              </span>
            )}
          </div>

          {teacherRequests.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">{sk ? "Žiadne čakajúce žiadosti" : "No pending requests"}</p>
              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Žiadosti študentov o zmenu termínu sa zobrazia tu." : "Student requests to change lesson times will appear here."}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {teacherRequests.map((request) => {
                const lesson = Array.isArray(request.lesson)
                  ? request.lesson[0]
                  : request.lesson;

                if (!lesson) return null;

                const student = studentDirectory.get(lesson.student_id);

                return (
                  <article
                    key={request.id}
                    className="rounded-3xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#92400e]">
                            {studentName(student)}
                          </p>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#2F3AA2]">
                            {sk ? "Nová žiadosť" : "New request"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#92400e]/70">
                          {formatLanguage(lesson.language, language)} · {sk ? "hodina" : "lesson"}
                        </p>

                        <div className="mt-4 space-y-2 text-sm text-[#92400e]">
                          <p>
                            <strong>{sk ? "Aktuálne:" : "Current:"}</strong>{" "}
                            {formatDate(lesson.scheduled_at, language)} ·{" "}
                            {formatTime(lesson.scheduled_at, language)}
                          </p>

                          <p>
                            <strong>{sk ? "Navrhovaný termín:" : "Proposed time:"}</strong>{" "}
                            {formatDate(request.preferred_at, language)} ·{" "}
                            {formatTime(request.preferred_at, language)}
                          </p>
                        </div>

                        {request.message && (
                          <p className="mt-3 text-sm italic text-[#92400e]/65">
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
            {sk ? "Pôvodný termín zostáva potvrdený, kým nebude zmena schválená." : "The original lesson time remains confirmed until a change is approved."}
          </p>
        </section>

        {outgoingRequests.length > 0 && (
          <section className="mt-8">
            <p className="text-sm text-gray-400">{sk ? "Vaše návrhy" : "Your proposals"}</p>
            <h2 className="mt-1 text-xl font-semibold">
              {sk ? "Čakajú na potvrdenie študenta" : "Waiting for student confirmation"}
            </h2>

            <div className="mt-4 space-y-3">
              {outgoingRequests.map((request) => {
                const lesson = Array.isArray(request.lesson)
                  ? request.lesson[0]
                  : request.lesson;

                if (!lesson) return null;

                const student = studentDirectory.get(lesson.student_id);

                return (
                  <article
                    key={request.id}
                    className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {studentName(student)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatLanguage(lesson.language, language)} · {sk ? "navrhovaný termín" : "proposed time"}{" "}
                          {formatDate(request.preferred_at, language)} ·{" "}
                          {formatTime(request.preferred_at, language)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-[#faf6eb] px-3 py-1.5 text-xs font-semibold text-[#2F3AA2]">
                        {sk ? "Čaká na študenta" : "Waiting for student"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <div>
              <p className="text-sm text-gray-400">{sk ? "Po hodine" : "After lesson"}</p>
              <h2 className="mt-1 text-xl font-semibold">
                {sk ? "Hodiny na uzavretie" : "Lessons to close"}
              </h2>
            </div>
          </div>

          {overdueError ? (
            <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {sk ? "Nepodarilo sa načítať hodiny, ktoré treba uzavrieť. Obnovte stránku a skúste to znova." : "Lessons that need closing could not be loaded. Refresh the page and try again."}
            </div>
          ) : !overdueLessons?.length ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">{sk ? "Všetky posledné hodiny sú uzavreté" : "All recent lessons are closed"}</p>
              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Po skončení hodiny tu môžete potvrdiť jej výsledný stav." : "After a lesson ends, you can confirm its final status here."}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {overdueLessons.map((lesson) => {
                const student = studentDirectory.get(lesson.student_id);

                return (
                  <article
                    key={lesson.id}
                    className="rounded-3xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold text-[#92400e]">
                          {studentName(student)}
                        </p>
                        <p className="mt-2 text-sm text-[#92400e]/70">
                          {formatLanguage(lesson.language, language)} ·{" "}
                          {formatDate(lesson.scheduled_at, language)} ·{" "}
                          {formatTime(lesson.scheduled_at, language)}
                        </p>
                      </div>

                      <LessonStatusActions
                        lessonId={lesson.id}
                        studentId={lesson.student_id}
                        packageId={lesson.package_id}
                        scheduledAt={lesson.scheduled_at}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{sk ? "Najbližšie" : "Upcoming"}</p>
              <h2 className="mt-1 text-xl font-semibold">
                {sk ? "Naplánované hodiny" : "Scheduled lessons"}
              </h2>
            </div>

            <CalendarDays size={21} className="text-[#2F3AA2]" />
          </div>

          {!lessons?.length ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                {sk ? "Žiadne najbližšie hodiny" : "No upcoming lessons"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Vaše potvrdené hodiny sa zobrazia tu." : "Your confirmed lessons will appear here."}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {lessons.map((lesson, index) => {
                const student = studentDirectory.get(lesson.student_id);

                return (
                  <article
                    key={lesson.id}
                    className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                      index === 0
                        ? "border-[#2F3AA2]/10 bg-[#2F3AA2] text-white"
                        : "border-black/5 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ${
                            index === 0
                              ? "bg-white/10"
                              : "bg-[#EEF2FF]"
                          }`}
                        >
                          <Clock3 size={18} />
                          <span className="mt-1 text-sm font-semibold">
                            {formatTime(lesson.scheduled_at, language)}
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
                                  : "bg-[#EEF2FF] text-[#3730A3]"
                              }`}
                            >
                              {index === 0 ? (sk ? "Najbližšia" : "Next") : (sk ? "Naplánovaná" : "Scheduled")}
                            </span>
                          </div>

                          <p
                            className={`mt-2 text-sm ${
                              index === 0
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {formatLanguage(lesson.language, language)} ·{" "}
                            {lesson.duration_minutes || 60} min
                          </p>

                          <p
                            className={`mt-1 text-sm ${
                              index === 0
                                ? "text-white/60"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDate(lesson.scheduled_at, language)}
                          </p>
                        </div>
                      </div>

                      {safeLessonLink(lesson.meet_link) ? (
                        <a
                          href={safeLessonLink(lesson.meet_link) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                            index === 0
                              ? "bg-white text-[#0a0a0f]"
                              : "bg-[#EEF2FF] text-[#0a0a0f]"
                          }`}
                        >
                          <Video size={17} />
                          {sk ? "Pripojiť sa na hodinu" : "Join lesson"}
                        </a>
                      ) : (
                        <span
                          className={`rounded-xl px-4 py-2.5 text-sm ${
                            index === 0
                              ? "bg-white/10 text-white/60"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {sk ? "Odkaz na Meet zatiaľ nie je pridaný" : "Meet link has not been added yet"}
                        </span>
                      )}
                    </div>

                    <EditLessonForm
                      lessonId={lesson.id}
                      scheduledAt={lesson.scheduled_at}
                      meetLink={lesson.meet_link}
                    />

                    <ProposeScheduleChangeForm
                      lessonId={lesson.id}
                      studentId={lesson.student_id}
                      hasPendingRequest={pendingLessonIds.has(lesson.id)}
                    />
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
