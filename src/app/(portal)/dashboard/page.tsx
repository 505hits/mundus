import { safeLessonLink } from "@/lib/lesson-link";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Video,
} from "lucide-react";
import type { StudentLessonReport } from "@/lib/student-report";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonCount, formatLessonType } from "@/lib/portalLabels";
import { paymentEnabled } from "@/lib/payments";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const { user } = await requireRole("student");
  const paymentsAvailable = paymentEnabled();
  const supabase = await createSupabaseServerClient();

  const [
    { data: profile, error: profileError },
    { data: packages, error: packagesError },
    { data: lessons, error: lessonsError },
    { data: reports, error: reportsError },
    { data: pendingRequests, error: requestsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),

    supabase
      .from("lesson_packages")
      .select(
        "id,total_lessons,remaining_lessons,used_lessons,status"
      )
      .eq("student_id", user.id)
      .eq("status", "active"),

    supabase
      .from("lessons")
      .select(
        "id,scheduled_at,duration_minutes,status,lesson_type,meet_link,language"
      )
      .eq("student_id", user.id)
      .in("status", ["scheduled", "rescheduled"])
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5),

    supabase
      .rpc("student_lesson_reports")
      .order("updated_at", { ascending: false })
      .limit(5),

    supabase
      .from("schedule_change_requests")
      .select("lesson_id,preferred_at")
      .eq("student_id", user.id)
      .eq("status", "pending"),
  ]);

  const hasLoadError = Boolean(
    profileError || packagesError || lessonsError || reportsError || requestsError
  );

  const activePackages = packages ?? [];
  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0] ?? null;
  const teacherReports: StudentLessonReport[] = Array.isArray(reports) ? reports : [];
  const pendingRequestMap = new Map(
    (pendingRequests ?? []).map((request) => [
      request.lesson_id,
      request.preferred_at,
    ])
  );

  const latestReport = teacherReports[0] ?? null;

  const latestHomework =
    teacherReports.find(
      (report) => report.homework?.trim()
    )?.homework?.trim() || null;

  const latestNextFocus =
    latestReport?.next_focus?.trim() || null;

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] || "študent";

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

  const progress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((usedLessons / totalLessons) * 100)
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            mundus
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#0a0a0f]">
                Portál študenta
              </p>

              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F3AA2] text-sm font-semibold text-white">
              {(
                profile?.full_name?.trim()?.[0] ||
                user.email?.[0] ||
                "S"
              ).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            Moje učenie
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Vitajte späť, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Váš prehľad učenia v Mundus.
          </p>
        </section>

        {hasLoadError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Niektoré údaje sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova.
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Najbližšia hodina */}
          <section className="rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Vaša najbližšia hodina
                </p>

                {nextLesson ? (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {formatLanguage(nextLesson.language)} ·{" "}
                      {formatLessonType(nextLesson.lesson_type)}
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {formatDate(nextLesson.scheduled_at)}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={17} />
                        {formatTime(nextLesson.scheduled_at)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-white/60">
                      {nextLesson.duration_minutes || 60} minút · Mundus
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {lessonsError ? "Najbližšiu hodinu sa nepodarilo načítať" : "Zatiaľ nemáte naplánovanú hodinu"}
                    </h2>

                    <p className="mt-4 text-sm text-white/60">
                      {lessonsError ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Vaša najbližšia potvrdená hodina sa zobrazí tu."}
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <GraduationCap size={25} />
              </div>
            </div>

            {nextLesson && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {safeLessonLink(nextLesson.meet_link) ? (
                  <a
                    href={safeLessonLink(nextLesson.meet_link) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-semibold text-[#0a0a0f]"
                  >
                    <Video size={18} />
                    Pripojiť sa na hodinu
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/70 px-5 py-3.5 font-semibold text-[#0a0a0f]/60"
                  >
                    <Video size={18} />
                    Odkaz na hodinu zatiaľ nie je pridaný
                  </button>
                )}

                {pendingRequestMap.has(nextLesson.id) ? (
                  <div className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-center font-medium text-white/80">
                    Zmena termínu čaká na schválenie
                  </div>
                ) : (
                  <Link
                    href={`/lessons/${nextLesson.id}/request-change`}
                    className="rounded-2xl border border-white/20 px-5 py-3.5 text-center font-medium text-white"
                  >
                    Požiadať o zmenu
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Package */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-gray-500">
              Aktuálny balíček
            </p>
            {paymentsAvailable && <Link href="/packages" className="mt-2 inline-block text-sm font-semibold text-[#2F3AA2] underline">Zobraziť balíčky a platby</Link>}

            {packagesError ? <p className="mt-4 text-sm text-red-700">Zostatok a stav balíčka sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova.</p> : activePackages.length > 0 ? (
              <>
                <div className="mt-4">
                  <p className="text-5xl font-semibold tracking-tight">
                    {remainingLessons}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Zostáva {formatLessonCount(remainingLessons)}
                  </p>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E0E7FF]">
                  <div
                    className="h-full rounded-full bg-[#2F3AA2]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Absolvované: {formatLessonCount(usedLessons)} z {formatLessonCount(totalLessons)}
                </p>

                {remainingLessons <= 2 && (
                  <div className="mt-5 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4">
                    <p className="font-semibold text-[#92400e]">
                      {remainingLessons === 0
                        ? "Balíček je vyčerpaný"
                        : remainingLessons === 1
                          ? "Zostáva vám posledná hodina"
                          : "Zostávajú vám posledné 2 hodiny"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#92400e]/75">
                      {paymentsAvailable
                        ? "Ak chcete pokračovať bez prerušenia, môžete si vybrať ďalší balíček online."
                        : "Ak chcete pokračovať bez prerušenia, ozvite sa Mundus Languages a pripravíme vám ďalší balíček."}
                    </p>
                    {paymentsAvailable && (
                      <Link href="/packages" className="mt-3 inline-flex rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">
                        Vybrať ďalší balíček
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Zatiaľ nemáte priradený aktívny balíček hodín.
                </p>
                {paymentsAvailable && (
                  <Link href="/packages" className="mt-4 inline-flex rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">
                    Pozrieť balíčky
                  </Link>
                )}
              </>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Progress */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Pokrok
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Vaše napredovanie
                </h2>
              </div>

              <div className="rounded-2xl bg-[#EEF2FF] p-3">
                <BookOpen size={22} />
              </div>
            </div>

            {latestNextFocus ? (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Ďalšie zameranie:{" "}
                <span className="font-medium text-[#0a0a0f]">
                  {latestNextFocus}
                </span>
              </p>
            ) : (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Vaša úroveň a pokrok sa budú zobrazovať podľa hodnotení a záznamov od lektora.
              </p>
            )}

            <Link
              href="/progress"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#2F3AA2]"
            >
              Zobraziť môj pokrok
              <ChevronRight size={16} />
            </Link>
          </section>

          {/* Homework */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  Domáca úloha
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {reportsError ? "Domácu úlohu sa nepodarilo načítať" : latestHomework
                    ? "Vaša posledná domáca úloha"
                    : "Zatiaľ nemáte domácu úlohu"}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#EEF2FF] p-3 text-[#2F3AA2]">
                <FileText size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              {reportsError ? "Obnovte stránku alebo to skúste o chvíľu znova." : latestHomework
                ? latestHomework
                : "Nové úlohy od lektora sa zobrazia po uložení záznamu z hodiny."}
            </p>

            {latestReport?.updated_at && (
              <p className="mt-4 text-xs text-gray-400">
                Aktualizované{" "}
                {new Intl.DateTimeFormat("sk-SK", {
                  day: "numeric",
                  month: "long",
                  timeZone: "Europe/Bratislava",
                }).format(new Date(latestReport.updated_at))}
              </p>
            )}

            <Link
              href="/learning"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2F3AA2]"
            >
              Zobraziť úlohy a poznámky
              <ChevronRight size={16} />
            </Link>
          </section>
        </div>

        {/* Schedule */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Rozvrh
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Najbližšie hodiny
              </h2>
            </div>

            <CalendarDays
              size={21}
              className="text-[#2F3AA2]"
            />
          </div>

          {upcomingLessons.length > 0 ? (
            <div className="mt-6 divide-y divide-gray-100">
              {upcomingLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {formatLanguage(lesson.language)} hodina
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatDate(lesson.scheduled_at)} ·{" "}
                      {formatTime(lesson.scheduled_at)}
                    </p>
                  </div>

                  {index === 0 ? (
                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold">
                      Najbližšia
                    </span>
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-gray-300"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              Nemáte naplánované ďalšie hodiny.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
