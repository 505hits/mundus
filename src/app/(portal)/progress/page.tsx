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
import type { StudentLessonReport } from "@/lib/student-report";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonType, formatProgressLabel } from "@/lib/portalLabels";
import { currentLanguage, localeFor } from "@/lib/i18n";

export default async function ProgressPage() {
  const languagePreference = await currentLanguage();
  const sk = languagePreference === "sk";
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const [
    { data: lessons, error: lessonsError },
    { data: packages, error: packagesError },
    { data: reports, error: reportsError },
  ] = await Promise.all([
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
        .rpc("student_lesson_reports")
        .order("updated_at", { ascending: false }),
    ]);

  const allLessons = lessons ?? [];

  const completedLessons = allLessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const activePackages = packages ?? [];
  const teacherReports: StudentLessonReport[] = Array.isArray(reports) ? reports : [];
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
    (sk ? "Váš jazyk" : "Your language");

  const nextFocus = reportsError ? (sk ? "Ďalšie zameranie sa nepodarilo načítať." : "Next focus could not be loaded.") :
    latestReport?.next_focus ||
    (sk ? "Lektor doplní ďalšie zameranie po hodine." : "Your teacher will add the next focus after the lesson.");

  function formatDate(value: string) {
    return new Intl.DateTimeFormat(localeFor(languagePreference), {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Bratislava",
    }).format(new Date(value));
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium transition hover:text-[#2F3AA2]"
          >
            <ArrowLeft size={17} />
            {sk ? "Prehľad" : "Overview"}
          </Link>

          <p className="text-sm font-semibold">
            {sk ? "Vzdelávací portál Mundus" : "Mundus learning portal"}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Môj pokrok" : "My progress"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Pozrite sa, ako napredujete" : "See how you’re progressing"}
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            {sk ? "Sledujte svoje reálne študijné aktivity v Mundus a najnovšiu spätnú väzbu od lektora." : "Track your real learning activity in Mundus and your latest teacher feedback."}
          </p>
        </section>

        {/* Aktuálne učenie */}
        {(lessonsError || packagesError || reportsError) && (
          <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Niektoré údaje o vašom pokroku sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova." : "Some progress data could not be loaded. Refresh the page or try again shortly."}
          </div>
        )}

        <section className="mt-8 rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/55">
                {sk ? "Aktuálne učenie" : "Current learning"}
              </p>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-semibold">
                  {formatLanguage(language, languagePreference)}
                </span>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                {sk ? "Váš pokrok vychádza z hodín a záznamov lektora uložených vo vašom účte Mundus. Úroveň CEFR zobrazíme iba vtedy, keď ju máte zaznamenanú v hodnotení." : "Your progress is based on lessons and teacher reports saved in your Mundus account. We show a CEFR level only when it is recorded in an assessment."}
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
              className="text-[#2F3AA2]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {lessonsError ? "—" : completedLessons.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Dokončené hodiny" : "Completed lessons"}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays
              size={20}
              className="text-[#2F3AA2]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {packagesError ? "—" : remainingLessons}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Zostávajúce hodiny" : "Remaining lessons"}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <FileText
              size={20}
              className="text-[#2F3AA2]"
            />

            <p className="mt-4 text-3xl font-semibold">
              {reportsError ? "—" : teacherReports.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Záznamy lektora" : "Teacher reports"}
            </p>
          </article>
        </section>

        {/* Package progress */}
        {!packagesError && totalLessons > 0 && (
          <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  {sk ? "Aktuálny balíček" : "Current package"}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {sk ? "Váš pokrok v balíčku" : "Your package progress"}
                </h2>
              </div>

              <BookOpen
                size={21}
                className="text-[#2F3AA2]"
              />
            </div>

            <div
              role="progressbar"
              aria-label={sk ? "Pokrok v aktuálnom balíčku" : "Current package progress"}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={packageProgress}
              className="mt-6 h-3 overflow-hidden rounded-full bg-[#E0E7FF]"
            >
              <div
                className="h-full rounded-full bg-[#2F3AA2]"
                style={{
                  width: `${packageProgress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-gray-500">
              <span>
                {usedLessons} {sk ? "z" : "of"} {totalLessons} {sk ? "hodín absolvovaných" : "lessons completed"}
              </span>

              <span>{packageProgress}%</span>
            </div>
          </section>
        )}

        {/* Ďalšie zameranie */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#2F3AA2]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                {sk ? "Ďalšie zameranie" : "Next focus"}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {nextFocus}
              </h2>

              {!reportsError && !latestReport && (
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {sk ? "Lektor zatiaľ nepridal ďalšie zameranie. Zobrazí sa po uložení záznamu z hodiny." : "Your teacher has not added a next focus yet. It will appear after a lesson report is saved."}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Najnovšia spätná väzba od lektora */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {sk ? "Najnovšia spätná väzba od lektora" : "Latest teacher feedback"}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {reportsError ? (sk ? "Spätnú väzbu sa nepodarilo načítať" : "Feedback could not be loaded") : latestReport?.topic ||
                  (sk ? "Zatiaľ bez záznamu od lektora" : "No teacher report yet")}
              </h2>
            </div>

            <div className="rounded-2xl bg-[#EEF2FF] p-3">
              <MessageCircle size={22} />
            </div>
          </div>

          {latestReport ? (
            <>
              {latestReport.progress && (
                <span className="mt-5 inline-flex rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#3730A3]">
                  {formatProgressLabel(latestReport.progress, languagePreference)}
                </span>
              )}

              {latestReport.student_note ? (
                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-500">
                  {latestReport.student_note}
                </p>
              ) : (
                <p className="mt-5 text-sm text-gray-500">
                  {sk ? "Lektor zatiaľ nepridal poznámku určenú pre vás." : "Your teacher has not added a note for you yet."}
                </p>
              )}

              {latestReport.homework && (
                <div className="mt-6 rounded-2xl bg-[#FAFAF9] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                    {sk ? "Domáca úloha" : "Homework"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {latestReport.homework}
                  </p>
                </div>
              )}

              <p className="mt-5 text-xs text-gray-400">
                {sk ? "Aktualizované" : "Updated"} {formatDate(latestReport.updated_at)}
              </p>
            </>
          ) : (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-500">
              {reportsError ? (sk ? "Obnovte stránku alebo skúste načítať spätnú väzbu o chvíľu znova." : "Refresh the page or try loading feedback again shortly.") : (sk ? "Najnovšia spätná väzba sa zobrazí po uložení záznamu z hodiny." : "Your latest feedback will appear after a lesson report is saved.")}
            </p>
          )}
        </section>

        {/* Dokončené hodiny */}
        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">
              {sk ? "Posledná aktivita" : "Recent activity"}
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {sk ? "Dokončené hodiny" : "Completed lessons"}
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
                        {lesson.lesson_type
                          ? formatLessonType(lesson.lesson_type, languagePreference)
                          : formatLanguage(lesson.language, languagePreference)}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatDate(lesson.scheduled_at)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#3730A3]">
                      {sk ? "Dokončená" : "Completed"}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                {lessonsError ? (sk ? "Históriu hodín sa nepodarilo načítať" : "Lesson history could not be loaded") : (sk ? "Zatiaľ nemáte dokončené hodiny" : "You do not have completed lessons yet")}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {lessonsError ? (sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly.") : (sk ? "História hodín sa zobrazí po prvej dokončenej hodine." : "Lesson history will appear after your first completed lesson.")}
              </p>
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          {sk ? "Vzdelávací portál Mundus" : "Mundus learning portal"}
        </p>
      </div>
    </main>
  );
}
