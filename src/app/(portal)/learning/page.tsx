import LearningFiles from "@/components/LearningFiles";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Target,
} from "lucide-react";
import type { StudentLessonReport } from "@/lib/student-report";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function LearningPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const { data: reports, error } = await supabase
    .rpc("student_lesson_reports")
    .order("updated_at", { ascending: false })
    .limit(20);

  const teacherReports: StudentLessonReport[] = Array.isArray(reports) ? reports : [];
  const homeworkReports = teacherReports.filter(
    (report) => report.homework?.trim()
  );
  const latestHomework = homeworkReports[0] ?? null;
  const latestReport = teacherReports[0] ?? null;

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-6xl px-5"><LearningFiles studentId={user.id} /></div>
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            {sk ? "Prehľad" : "Overview"}
          </Link>

          <p className="text-sm font-semibold">{sk ? "Vzdelávací portál Mundus" : "Mundus learning portal"}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Učenie" : "Learning"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Domáce úlohy a poznámky" : "Homework and notes"}
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            {sk ? "Domáce úlohy a odporúčania od vášho lektora Mundus." : "Homework and recommendations from your Mundus teacher."}
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Nepodarilo sa načítať údaje o učení. Obnovte stránku alebo to skúste o chvíľu znova." : "Learning data could not be loaded. Refresh the page or try again shortly."}
          </div>
        )}

        <section className="mt-8 rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-white/55">
                {sk ? "Aktuálna domáca úloha" : "Current homework"}
              </p>

              {latestHomework ? (
                <>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {latestHomework.topic || (sk ? "Vaša posledná úloha" : "Your latest assignment")}
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-white/70">
                    {latestHomework.homework}
                  </p>

                  <p className="mt-5 text-sm text-white/45">
                    {sk ? "Aktualizované" : "Updated"} {formatDate(latestHomework.updated_at, language)}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {error ? (sk ? "Domácu úlohu sa nepodarilo načítať" : "Homework could not be loaded") : (sk ? "Zatiaľ nemáte zadanú domácu úlohu" : "No homework assigned yet")}
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-white/60">
                    {error ? (sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly.") : (sk ? "Domáca úloha od lektora sa zobrazí po uložení záznamu z hodiny." : "Homework from your teacher will appear after a lesson report is saved.")}
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <FileText size={26} />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#2F3AA2]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">{sk ? "Ďalšie zameranie" : "Next focus"}</p>

              <h2 className="mt-1 text-xl font-semibold">
                {error ? (sk ? "Odporúčanie sa nepodarilo načítať." : "Recommendation could not be loaded.") : latestReport?.next_focus?.trim() ||
                  (sk ? "Tu sa zobrazí odporúčanie, na čo sa zamerať ďalej." : "Your teacher’s recommendation for what to focus on next will appear here.")}
              </h2>

              {latestReport?.student_note?.trim() && (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
                  {latestReport.student_note}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-[#2F3AA2]" />
            <h2 className="text-xl font-semibold">{sk ? "História domácich úloh" : "Homework history"}</h2>
          </div>

          {homeworkReports.length > 0 ? (
            <div className="mt-4 space-y-3">
              {homeworkReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-[#EEF2FF] p-3">
                      <FileText size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {report.topic || (sk ? "Domáca úloha" : "Homework")}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {report.homework}
                      </p>

                      <p className="mt-3 text-xs text-gray-400">
                        {sk ? "Aktualizované" : "Updated"} {formatDate(report.updated_at, language)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">{error ? (sk ? "Históriu domácich úloh sa nepodarilo načítať" : "Homework history could not be loaded") : (sk ? "Zatiaľ žiadne domáce úlohy" : "No homework yet")}</p>

              <p className="mt-1 text-sm text-gray-400">
                {error ? (sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly.") : (sk ? "Zadania od lektora sa zobrazia tu." : "Teacher assignments will appear here.")}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
