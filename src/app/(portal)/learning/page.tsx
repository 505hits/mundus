import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Target,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function UčeniePage() {
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();

  const { data: reports, error } = await supabase
    .from("lesson_reports")
    .select("id,topic,student_note,homework,next_focus,updated_at")
    .eq("student_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  const teacherReports = reports ?? [];
  const homeworkReports = teacherReports.filter(
    (report) => report.homework?.trim()
  );
  const latestDomáca úloha = homeworkReports[0] ?? null;
  const latestReport = teacherReports[0] ?? null;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <p className="text-sm font-semibold">Mundus Vzdelávací portál</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Učenie
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Domáce úlohy a poznámky
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Domáce úlohy a odporúčania od vášho lektora Mundus.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            We couldn&apos;t load your learning information. Please refresh
            the page or try again shortly.
          </div>
        )}

        <section className="mt-8 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-white/55">
                Aktuálna domáca úloha
              </p>

              {latestDomáca úloha ? (
                <>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {latestDomáca úloha.topic || "Vaša posledná úloha"}
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-white/70">
                    {latestDomáca úloha.homework}
                  </p>

                  <p className="mt-5 text-sm text-white/45">
                    Updated {formatDate(latestDomáca úloha.updated_at)}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-2xl font-semibold">
                    Zatiaľ nemáte zadanú domácu úlohu
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-white/60">
                    Domáca úloha from your teacher will appear here after a
                    lesson report is saved.
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
            <div className="rounded-2xl bg-[#faf6eb] p-3 text-[#9a8049]">
              <Target size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-400">Na čo sa zamerať ďalej</p>

              <h2 className="mt-1 text-xl font-semibold">
                {latestReport?.next_focus?.trim() ||
                  "Tu sa zobrazí odporúčanie, na čo sa zamerať ďalej."}
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
            <BookOpen size={20} className="text-[#9a8049]" />
            <h2 className="text-xl font-semibold">História domácich úloh</h2>
          </div>

          {homeworkReports.length > 0 ? (
            <div className="mt-4 space-y-3">
              {homeworkReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-[#eef3ef] p-3">
                      <FileText size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {report.topic || "Domáca úloha"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {report.homework}
                      </p>

                      <p className="mt-3 text-xs text-gray-400">
                        Updated {formatDate(report.updated_at)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">Zatiaľ žiadne domáce úlohy</p>

              <p className="mt-1 text-sm text-gray-400">
                Úlohy od vášho lektora sa zobrazia tu.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
