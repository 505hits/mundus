import { teacherDirectory } from "@/lib/teacher-directory";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonType } from "@/lib/portalLabels";
import LessonReportForm from "./LessonReportForm";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
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

function getStudentName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined,
  sk: boolean
) {
  return profile?.full_name?.trim() || profile?.email || (sk ? "Študent" : "Student");
}

export default async function TeacherReportsPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();
  const studentDirectory = await teacherDirectory(supabase);

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
        full_name
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

  const loadError = Boolean(lessonsError || reportsError);

  const reportMap = new Map(
    (reports ?? []).map((report) => [report.lesson_id, report])
  );

  const recentLessons = lessons ?? [];

  const completedReports = recentLessons.filter((lesson) =>
    reportMap.has(lesson.id)
  ).length;

  const missingReports = recentLessons.length - completedReports;

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Záznamy" : "Reports"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Záznamy z hodín" : "Lesson reports"}
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            {sk ? "Po každej dokončenej hodine pridajte krátky záznam, aby mal študent aktuálny prehľad o svojom napredovaní." : "After each completed lesson, add a short report so the student has an up-to-date view of their progress."}
          </p>
        </section>

        {loadError && (
          <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Niektoré údaje o záznamoch sa nepodarilo načítať. Obnovte stránku pred úpravou záznamov." : "Some report data could not be loaded. Refresh the page before editing reports."}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <ClipboardList size={20} className="text-[#2F3AA2]" />

            <p className="mt-4 text-3xl font-semibold">
              {recentLessons.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Posledné hodiny" : "Recent lessons"}
            </p>
          </div>

          <div className="rounded-3xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-5">
            <AlertCircle size={20} className="text-[#2F3AA2]" />

            <p className="mt-4 text-3xl font-semibold text-[#92400e]">
              {missingReports}
            </p>

            <p className="mt-1 text-sm text-[#92400e]/70">
              {sk ? "Chýbajúce záznamy" : "Missing reports"}
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#2F3AA2]" />

            <p className="mt-4 text-3xl font-semibold">
              {completedReports}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Hotové záznamy" : "Completed reports"}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm text-gray-400">
            {sk ? "Posledná aktivita" : "Recent activity"}
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {sk ? "Dokončené hodiny" : "Completed lessons"}
          </h2>

          {recentLessons.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                {sk ? "Zatiaľ nemáte dokončené hodiny" : "You do not have completed lessons yet"}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Záznamy bude možné pridávať po dokončení hodín." : "Reports can be added after lessons are completed."}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {recentLessons.map((lesson) => {
                const student = studentDirectory.get(lesson.student_id);

                const report = reportMap.get(lesson.id);

                return (
                  <article
                    key={lesson.id}
                    className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                      report
                        ? "border-black/5 bg-white"
                        : "border-[#2F3AA2]/20 bg-[#faf6eb]"
                    }`}
                  >
                    <div className="flex flex-col gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {getStudentName(student, sk)}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              report
                                ? "bg-[#EEF2FF] text-[#3730A3]"
                                : "bg-white text-[#2F3AA2]"
                            }`}
                          >
                            {report
                              ? (sk ? "Záznam vyplnený" : "Report completed")
                              : (sk ? "Treba doplniť záznam" : "Report needed")}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                          {formatLanguage(lesson.language, language)} ·{" "}
                          {formatLessonType(lesson.lesson_type, language)}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                          <Clock3 size={15} />
                          {formatDate(lesson.scheduled_at, language)} ·{" "}
                          {formatTime(lesson.scheduled_at, language)}
                        </div>
                      </div>

                      {reportsError ? (
                        <p role="alert" className="text-sm text-red-700">
                          {sk ? "Záznam sa nepodarilo načítať. Pred úpravou obnovte stránku." : "The report could not be loaded. Refresh the page before editing."}
                        </p>
                      ) : <LessonReportForm
                        lessonId={lesson.id}
                        studentId={lesson.student_id}
                        existingReport={report ?? null}
                      />}
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
