import { safeLessonLink } from "@/lib/lesson-link";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
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
import { currentBratislavaMonth } from "@/lib/month";
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

export default async function DashboardPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const paymentsAvailable = paymentEnabled();
  const supabase = await createSupabaseServerClient();

  const [
    { data: profile, error: profileError },
    { data: packages, error: packagesError },
    { data: lessons, error: lessonsError },
    { data: reports, error: reportsError },
    { data: pendingRequests, error: requestsError },
    { data: completedThisMonth, error: completedThisMonthError },
    { data: monthlyFeedback, error: monthlyFeedbackError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),

    supabase
      .from("lesson_packages")
      .select(
        "id,total_lessons,remaining_lessons,used_lessons,status,purchased_at"
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

    (() => {
      const month = currentBratislavaMonth();
      return supabase
        .from("lessons")
        .select("teacher_id")
        .eq("student_id", user.id)
        .eq("status", "completed")
        .gte("scheduled_at", month.start)
        .lt("scheduled_at", month.end);
    })(),

    (() => {
      const month = currentBratislavaMonth();
      return supabase
        .from("teacher_monthly_feedback")
        .select("teacher_id")
        .eq("student_id", user.id)
        .eq("feedback_month", month.key);
    })(),
  ]);

  const hasLoadError = Boolean(
    profileError || packagesError || lessonsError || reportsError || requestsError || completedThisMonthError || monthlyFeedbackError
  );

  const activePackages = packages ?? [];
  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0] ?? null;
  const teacherReports: StudentLessonReport[] = Array.isArray(reports) ? reports : [];
  const ratedTeachers = new Set((monthlyFeedback ?? []).map((item) => item.teacher_id));
  const teachersToRate = new Set(
    (completedThisMonth ?? [])
      .map((item) => item.teacher_id)
      .filter((teacherId) => !ratedTeachers.has(teacherId))
  );

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
    profile?.full_name?.trim().split(/\s+/)[0] || (sk ? "študent" : "student");

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

  const renewalDue = activePackages.some(pkg => {
    const low =
      (pkg.total_lessons === 5 && (pkg.used_lessons ?? 0) >= 4 && (pkg.remaining_lessons ?? 0) <= 1) ||
      (pkg.total_lessons !== 5 && (pkg.used_lessons ?? 0) > 0 && (pkg.remaining_lessons ?? 0) <= 2);
    if (!low) return false;
    const purchasedAt = new Date(pkg.purchased_at ?? 0).getTime();
    const alreadyContinued = activePackages.some(other =>
      other.id !== pkg.id &&
      (other.remaining_lessons ?? 0) > 0 &&
      new Date(other.purchased_at ?? 0).getTime() > purchasedAt
    );
    return !alreadyContinued;
  });

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
          <BrandLogo compact />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#0a0a0f]">
                {sk ? "Portál študenta" : "Student portal"}
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
        {teachersToRate.size > 0 && <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-amber-900">{sk ? "Ako sa vám tento mesiac učilo?" : "How was learning this month?"}</p>
            <p className="mt-1 text-sm text-amber-900/75">{sk ? "Máte dokončenú hodinu s lektorom, ktorého ste tento mesiac ešte neohodnotili. Vaša spätná väzba nám pomáha udržať kvalitu výučby." : "You completed a lesson with a teacher you have not rated this month. Your feedback helps us maintain teaching quality."}</p>
          </div>
          <Link href="/feedback" className="shrink-0 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Ohodnotiť lektora" : "Rate teacher"}</Link>
        </section>}

        {renewalDue && <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#2F3AA2]/20 bg-[#EEF2FF] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-semibold text-[#2F3AA2]">{sk ? "Je čas myslieť na ďalší balíček" : "Time to plan your next package"}</p><p className="mt-1 text-sm text-gray-600">{sk ? "Máte už len posledné hodiny. Ak chcete pokračovať bez prestávky, môžete si ďalší balíček pripraviť už teraz." : "You only have a few lessons left. If you want to continue without a break, you can prepare your next package now."}</p></div>
          {paymentsAvailable?<Link href="/packages" className="shrink-0 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Kúpiť ďalší balíček" : "Buy another package"}</Link>:<Link href="/contact" className="shrink-0 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Kontaktovať Mundus" : "Contact Mundus"}</Link>}
        </section>}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Moje učenie" : "My learning"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Vitajte späť" : "Welcome back"}, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            {sk ? "Váš prehľad učenia v Mundus." : "Your learning overview in Mundus."}
          </p>
        </section>

        {hasLoadError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Niektoré údaje sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova." : "Some data could not be loaded. Refresh the page or try again shortly."}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Najbližšia hodina */}
          <section className="rounded-3xl bg-[#2F3AA2] p-6 text-white shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/60">
                  {sk ? "Vaša najbližšia hodina" : "Your next lesson"}
                </p>

                {nextLesson ? (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {formatLanguage(nextLesson.language, language)} ·{" "}
                      {formatLessonType(nextLesson.lesson_type, language)}
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {formatDate(nextLesson.scheduled_at, language)}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={17} />
                        {formatTime(nextLesson.scheduled_at, language)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-white/60">
                      {nextLesson.duration_minutes || 60} {sk ? "minút" : "minutes"} · Mundus
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {lessonsError ? (sk ? "Najbližšiu hodinu sa nepodarilo načítať" : "Your next lesson could not be loaded") : (sk ? "Zatiaľ nemáte naplánovanú hodinu" : "You do not have a scheduled lesson yet")}
                    </h2>

                    <p className="mt-4 text-sm text-white/60">
                      {lessonsError ? (sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly.") : (sk ? "Vaša najbližšia potvrdená hodina sa zobrazí tu." : "Your next confirmed lesson will appear here.")}
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
                    {sk ? "Pripojiť sa na hodinu" : "Join lesson"}
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/70 px-5 py-3.5 font-semibold text-[#0a0a0f]/60"
                  >
                    <Video size={18} />
                    {sk ? "Odkaz na hodinu zatiaľ nie je pridaný" : "Lesson link has not been added yet"}
                  </button>
                )}

                {pendingRequestMap.has(nextLesson.id) ? (
                  <div className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-center font-medium text-white/80">
                    {sk ? "Zmena termínu čaká na schválenie" : "Schedule change awaiting approval"}
                  </div>
                ) : (
                  <Link
                    href={`/lessons/${nextLesson.id}/request-change`}
                    className="rounded-2xl border border-white/20 px-5 py-3.5 text-center font-medium text-white"
                  >
                    {sk ? "Požiadať o zmenu" : "Request a change"}
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Package */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-gray-500">
              {sk ? "Aktuálny balíček" : "Current package"}
            </p>
            {paymentsAvailable && <Link href="/packages" className="mt-2 inline-block text-sm font-semibold text-[#2F3AA2] underline">{sk ? "Zobraziť balíčky a platby" : "View packages and payments"}</Link>}

            {packagesError ? <p className="mt-4 text-sm text-red-700">Zostatok a stav balíčka sa nepodarilo načítať. sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly."</p> : activePackages.length > 0 ? (
              <>
                <div className="mt-4">
                  <p className="text-5xl font-semibold tracking-tight">
                    {remainingLessons}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {sk ? "Zostáva" : "Remaining:"} {formatLessonCount(remainingLessons, language)}
                  </p>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E0E7FF]">
                  <div
                    className="h-full rounded-full bg-[#2F3AA2]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {sk ? "Absolvované:" : "Completed:"} {formatLessonCount(usedLessons, language)} z {formatLessonCount(totalLessons, language)}
                </p>

                {remainingLessons <= 2 && (
                  <div className="mt-5 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4">
                    <p className="font-semibold text-[#92400e]">
                      {remainingLessons === 0
                        ? (sk ? "Balíček je vyčerpaný" : "Package is used up")
                        : remainingLessons === 1
                          ? (sk ? "Zostáva vám posledná hodina" : "You have one lesson left")
                          : (sk ? "Zostávajú vám posledné 2 hodiny" : "You have two lessons left")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#92400e]/75">
                      {paymentsAvailable
                        ? (sk ? "Ak chcete pokračovať bez prerušenia, môžete si vybrať ďalší balíček online." : "To continue without a break, choose another package online.")
                        : (sk ? "Ak chcete pokračovať bez prerušenia, ozvite sa Mundus Languages a pripravíme vám ďalší balíček." : "To continue without a break, contact Mundus Languages and we’ll prepare another package.")}
                    </p>
                    {paymentsAvailable && (
                      <Link href="/packages" className="mt-3 inline-flex rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">
                        {sk ? "Vybrať ďalší balíček" : "Choose another package"}
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  {sk ? "Zatiaľ nemáte priradený aktívny balíček hodín." : "You do not have an active lesson package yet."}
                </p>
                {paymentsAvailable && (
                  <Link href="/packages" className="mt-4 inline-flex rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">
                    {sk ? "Pozrieť balíčky" : "View packages"}
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
                  {sk ? "Pokrok" : "Progress"}
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {sk ? "Vaše napredovanie" : "Your progress"}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#EEF2FF] p-3">
                <BookOpen size={22} />
              </div>
            </div>

            {latestNextFocus ? (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                {sk ? "Ďalšie zameranie:" : "Next focus:"}{" "}
                <span className="font-medium text-[#0a0a0f]">
                  {latestNextFocus}
                </span>
              </p>
            ) : (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                {sk ? "Vaša úroveň a pokrok sa budú zobrazovať podľa hodnotení a záznamov od lektora." : "Your level and progress will appear based on teacher feedback and lesson reports."}
              </p>
            )}

            <Link
              href="/progress"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#2F3AA2]"
            >
              {sk ? "Zobraziť môj pokrok" : "View my progress"}
              <ChevronRight size={16} />
            </Link>
          </section>

          {/* Homework */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  {sk ? "Domáca úloha" : "Homework"}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {reportsError
                    ? (sk ? "Domácu úlohu sa nepodarilo načítať" : "Homework could not be loaded")
                    : latestHomework
                      ? (sk ? "Vaša posledná domáca úloha" : "Your latest homework")
                      : (sk ? "Zatiaľ nemáte domácu úlohu" : "No homework yet")}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#EEF2FF] p-3 text-[#2F3AA2]">
                <FileText size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              {reportsError ? "sk ? "Obnovte stránku alebo to skúste o chvíľu znova." : "Refresh the page or try again shortly."" : latestHomework
                ? latestHomework
                : "sk ? "Nové úlohy od lektora sa zobrazia po uložení záznamu z hodiny." : "New teacher assignments will appear after a lesson report is saved.""}
            </p>

            {latestReport?.updated_at && (
              <p className="mt-4 text-xs text-gray-400">
                {sk ? "Aktualizované" : "Updated"}{" "}
                {new Intl.DateTimeFormat(localeFor(language), {
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
              {sk ? "Zobraziť úlohy a poznámky" : "View assignments and notes"}
              <ChevronRight size={16} />
            </Link>
          </section>
        </div>

        {/* Schedule */}
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                {sk ? "Rozvrh" : "Schedule"}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {sk ? "Najbližšie hodiny" : "Upcoming lessons"}
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
                      {formatLanguage(lesson.language, language)} · {sk ? "hodina" : "lesson"}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatDate(lesson.scheduled_at, language)} ·{" "}
                      {formatTime(lesson.scheduled_at, language)}
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
