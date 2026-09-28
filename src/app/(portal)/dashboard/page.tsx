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
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonType } from "@/lib/portalLabels";

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
  const supabase = await createSupabaseServerClient();

  const [
    { data: profile },
    { data: packages },
    { data: lessons },
    { data: reports },
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
      .eq("status", "active")
      .order("purchased_at", { ascending: false })
      .limit(1),

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
      .from("lesson_reports")
      .select(
        "id,lesson_id,topic,progress,student_note,homework,next_focus,updated_at"
      )
      .eq("student_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const activePackage = packages?.[0] ?? null;
  const upcomingLessons = lessons ?? [];
  const nextLesson = upcomingLessons[0] ?? null;
  const teacherReports = reports ?? [];

  const latestReport = teacherReports[0] ?? null;

  const latestHomework =
    teacherReports.find(
      (report) => report.homework?.trim()
    )?.homework?.trim() || null;

  const latestNextFocus =
    latestReport?.next_focus?.trim() || null;

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] || "";

  const totalLessons = activePackage?.total_lessons ?? 0;
  const usedLessons = activePackage?.used_lessons ?? 0;
  const remainingLessons =
    activePackage?.remaining_lessons ?? 0;

  const progress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((usedLessons / totalLessons) * 100)
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
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
              <p className="text-sm font-semibold text-[#183f38]">
                Portál študenta
              </p>

              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f38] text-sm font-semibold text-white">
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
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Moje učenie
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Vitajte späť, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Váš prehľad učenia v Mundus.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Next lesson */}
          <section className="rounded-3xl bg-[#183f38] p-6 text-white shadow-sm lg:col-span-2 sm:p-8">
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
                      {nextLesson.duration_minutes || 60}-minute Mundus
                      lesson
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-2xl font-semibold">
                      Zatiaľ nemáte naplánovanú hodinu
                    </h2>

                    <p className="mt-4 text-sm text-white/60">
                      Vaša najbližšia potvrdená hodina sa zobrazí tu.
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
                {nextLesson.meet_link ? (
                  <a
                    href={nextLesson.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-semibold text-[#183f38]"
                  >
                    <Video size={18} />
                    Pripojiť sa na hodinu
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/70 px-5 py-3.5 font-semibold text-[#183f38]/60"
                  >
                    <Video size={18} />
                    Odkaz na hodinu zatiaľ nie je pridaný
                  </button>
                )}

                <Link
                  href="/lessons"
                  className="rounded-2xl border border-white/20 px-5 py-3.5 text-center font-medium text-white"
                >
                  Požiadať o zmenu
                </Link>
              </div>
            )}
          </section>

          {/* Package */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-gray-500">
              Aktuálny balíček
            </p>

            {activePackage ? (
              <>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight">
                    {remainingLessons}
                  </span>

                  <span className="pb-1 text-gray-400">
                    hodín zostáva
                  </span>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#edf0ec]">
                  <div
                    className="h-full rounded-full bg-[#c6a65b]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {usedLessons} of {totalLessons} hodín absolvovaných
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Zatiaľ nemáte priradený aktívny balíček hodín.
              </p>
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

              <div className="rounded-2xl bg-[#eef3ef] p-3">
                <BookOpen size={22} />
              </div>
            </div>

            {latestNextFocus ? (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Ďalšie zameranie:{" "}
                <span className="font-medium text-[#183f38]">
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
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#9a8049]"
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
                  {latestHomework
                    ? "Vaša posledná domáca úloha"
                    : "Zatiaľ nemáte domácu úlohu"}
                </h2>
              </div>

              <div className="rounded-2xl bg-[#f7f2e7] p-3 text-[#9a8049]">
                <FileText size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              {latestHomework
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
              href="/progress"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9a8049]"
            >
              Zobraziť pokrok
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
              className="text-[#9a8049]"
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
                    <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold">
                      Next
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
