import { safeLessonLink } from "@/lib/lesson-link";
import LearningFiles from "@/components/LearningFiles";
import PlacementResults from "@/components/PlacementResults";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  MessageCircle,
  TrendingUp,
  Video,
} from "lucide-react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonType } from "@/lib/portalLabels";
import CreateLessonForm from "./CreateLessonForm";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatShortDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    day: "numeric",
    month: "short",
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

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return profile?.full_name?.trim() || profile?.email || "Student";
}

export default async function TeacherStudentPage({
  params,
}: Props) {
  const languagePreference = await currentLanguage();
  const sk = languagePreference === "sk";
  const { user } = await requireRole("teacher");
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  // The dynamic route contains the student ID. Verify that this teacher
  // actually has at least one lesson with the student before showing data.
  const { data: assignedLesson, error: assignmentError } = await supabase
    .from("lessons")
    .select("student_id")
    .eq("student_id", id)
    .eq("teacher_id", user.id)
    .limit(1)
    .maybeSingle();

  if (assignmentError) throw new Error("Teacher student assignment is unavailable");

  if (!assignedLesson?.student_id) {
    notFound();
  }

  return renderStudentPage(supabase, user.id, assignedLesson.student_id, languagePreference);
}

async function renderStudentPage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  teacherId: string,
  studentId: string,
  languagePreference: Language
) {
  const sk = languagePreference === "sk";
  const [
    profileResult,
    lessonsResult,
    packagesResult,
    reportsResult,
  ] = await Promise.all([
    supabase
      .rpc("teacher_student_directory")
      .eq("id", studentId)
      .maybeSingle(),

    supabase
      .from("lessons")
      .select(`
        id,
        scheduled_at,
        duration_minutes,
        status,
        language,
        lesson_type,
        meet_link
      `)
      .eq("teacher_id", teacherId)
      .eq("student_id", studentId)
      .order("scheduled_at", { ascending: false }),

    supabase
      .from("lesson_packages")
      .select(
        "id,total_lessons,used_lessons,remaining_lessons,status"
      )
      .eq("student_id", studentId)
      .eq("status", "active"),

    supabase
      .from("lesson_reports")
      .select("id,topic,student_note,updated_at")
      .eq("teacher_id", teacherId)
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false })
      .limit(1),
  ]);

  if (profileResult.error || lessonsResult.error || packagesResult.error || reportsResult.error) {
    throw new Error("Teacher student data is unavailable");
  }

  const profile = profileResult.data;
  const lessons = lessonsResult.data ?? [];
  const packages = packagesResult.data ?? [];
  const latestReport = reportsResult.data?.[0] ?? null;

  if (!profile) {
    notFound();
  }

  const studentName = getName(profile);

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const upcomingLessons = lessons
    .filter(
      (lesson) =>
        ["scheduled", "rescheduled"].includes(lesson.status) &&
        new Date(lesson.scheduled_at).getTime() >= new Date().getTime()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() -
        new Date(b.scheduled_at).getTime()
    );

  const nextLesson = upcomingLessons[0] ?? null;

  const lessonsRemaining = packages.reduce(
    (sum, pkg) => sum + (pkg.remaining_lessons ?? 0),
    0
  );

  const language =
    nextLesson?.language ||
    lessons[0]?.language ||
    "";

  const lessonType =
    nextLesson?.lesson_type ||
    lessons[0]?.lesson_type ||
    "regular";

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <LearningFiles studentId={studentId} teacher />
      <PlacementResults studentId={studentId} />
      <PlacementResults studentId={studentId} kind="progress" />
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/teacher/students"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            {sk ? "Moji študenti" : "My students"}
          </Link>

          <p className="text-sm font-semibold">
            {sk ? "Prehľad študenta" : "Student overview"}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
              {sk ? "Môj študent" : "My student"}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {studentName}
            </h1>

            <p className="mt-2 text-gray-500">
              {formatLanguage(language, languagePreference)} · {formatLessonType(lessonType, languagePreference)}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#eaf4ed] px-3 py-1.5 text-xs font-semibold text-[#3730A3]">
            {sk ? "Aktívny študent" : "Active student"}
          </span>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={19} className="text-[#2F3AA2]" />

            <p className="mt-4 text-sm text-gray-400">
              {sk ? "Dokončené hodiny" : "Completed lessons"}
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {completedLessons.length}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={19} className="text-[#2F3AA2]" />

            <p className="mt-4 text-sm text-gray-400">
              {sk ? "Zostávajúce hodiny" : "Remaining lessons"}
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {lessonsRemaining}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <TrendingUp size={19} className="text-[#2F3AA2]" />

            <p className="mt-4 text-sm text-gray-400">
              {sk ? "Aktivita študenta" : "Student activity"}
            </p>

            <p className="mt-1 text-sm font-semibold">
              {completedLessons.length > 0
                ? (sk ? "Prebiehajúca výučba" : "Learning in progress")
                : (sk ? "Začiatok výučby" : "Getting started")}
            </p>
          </article>
        </div>

        {nextLesson && (
          <section className="mt-6 rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/55">
                  {sk ? "Najbližšia hodina" : "Next lesson"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {formatLanguage(nextLesson.language || language, languagePreference)} ·{" "}
                  {formatLessonType(nextLesson.lesson_type, languagePreference)}
                </h2>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/65">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {formatDate(nextLesson.scheduled_at, languagePreference)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {formatTime(nextLesson.scheduled_at, languagePreference)}
                  </span>
                </div>
              </div>

              {safeLessonLink(nextLesson.meet_link) ? (
                <a
                  href={safeLessonLink(nextLesson.meet_link) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#0a0a0f]"
                >
                  <Video size={18} />
                  {sk ? "Pripojiť sa na hodinu" : "Join lesson"}
                </a>
              ) : (
                <span className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white/60">
                  {sk ? "Odkaz na Meet zatiaľ nie je pridaný" : "Meet link has not been added yet"}
                </span>
              )}
            </div>
          </section>
        )}

        <CreateLessonForm
          studentId={studentId}
          language={language}
          lessonType={lessonType}
          packages={packages}
        />

        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">
              {sk ? "História" : "History"}
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {sk ? "Posledné hodiny" : "Recent lessons"}
            </h2>
          </div>

          {completedLessons.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                {sk ? "Zatiaľ žiadne dokončené hodiny" : "No completed lessons yet"}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Dokončené hodiny sa zobrazia tu." : "Completed lessons will appear here."}
              </p>
            </div>
          ) : (
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
                        {lesson.lesson_type
                          ? formatLessonType(lesson.lesson_type, languagePreference)
                          : formatLanguage(lesson.language, languagePreference)}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatShortDate(lesson.scheduled_at, languagePreference)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#3730A3]">
                      {sk ? "Dokončená" : "Completed"}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <MessageCircle
              size={20}
              className="text-[#2F3AA2]"
            />

            <h2 className="text-lg font-semibold">
              {sk ? "Poznámky pre študenta" : "Notes for student"}
            </h2>
          </div>

          <div className="mt-5 rounded-2xl bg-[#FAFAF9] p-5">
            {latestReport?.student_note?.trim() ? (
              <>
                {latestReport.topic?.trim() && (
                  <p className="text-sm font-semibold text-[#0a0a0f]">
                    {latestReport.topic}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {latestReport.student_note}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  {sk ? "Aktualizované" : "Updated"} {formatShortDate(latestReport.updated_at, languagePreference)}
                </p>
              </>
            ) : (
              <p className="text-sm leading-6 text-gray-500">
                {sk ? "Zatiaľ nie je uložená žiadna poznámka pre študenta." : "No note for the student has been saved yet."}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
