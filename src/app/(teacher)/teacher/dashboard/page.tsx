import { teacherDirectory } from "@/lib/teacher-directory";
import { safeLessonLink } from "@/lib/lesson-link";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  Users,
  Video,
  Star,
  TrendingUp,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bratislavaMonth, currentBratislavaMonth } from "@/lib/month";
import { formatLanguage } from "@/lib/portalLabels";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined,
  sk: boolean
) {
  return profile?.full_name?.trim() || profile?.email || (sk ? "Študent" : "Student");
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "T";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function TeacherDashboardPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();
  const adminDb = createSupabaseAdminClient();
  const studentDirectory = await teacherDirectory(supabase);

  const [{ data: teacherProfile }, { data: publicProfile }, { data: matchingPreferences }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase.from("teacher_public_profiles").select("headline,bio,languages,photo_path,website_visible").eq("teacher_id", user.id).maybeSingle(),
    supabase.from("teacher_preferences").select("languages,levels,days,time_from,time_to,max_new_students,accepting_students").eq("teacher_id", user.id).maybeSingle(),
  ]);

  const now = new Date();

  const currentMonth = currentBratislavaMonth();
  const previousMonth = currentMonth.month === 1
    ? bratislavaMonth(currentMonth.year - 1, 12)
    : bratislavaMonth(currentMonth.year, currentMonth.month - 1);

  const [
    { data: performanceLessons, error: performanceLessonsError },
    { data: performanceFeedback, error: performanceFeedbackError },
  ] = await Promise.all([
    adminDb.from("lessons")
      .select("student_id,scheduled_at,status")
      .eq("teacher_id", user.id)
      .eq("status", "completed")
      .gte("scheduled_at", previousMonth.start)
      .lt("scheduled_at", currentMonth.end),
    adminDb.from("teacher_monthly_feedback")
      .select("feedback_month,rating")
      .eq("teacher_id", user.id)
      .in("feedback_month", [previousMonth.key, currentMonth.key]),
  ]);

  const performanceLoadError = Boolean(performanceLessonsError || performanceFeedbackError);
  const currentLessons = (performanceLessons ?? []).filter((lesson) =>
    new Date(lesson.scheduled_at) >= new Date(currentMonth.start) &&
    new Date(lesson.scheduled_at) < new Date(currentMonth.end)
  );
  const previousLessons = (performanceLessons ?? []).filter((lesson) =>
    new Date(lesson.scheduled_at) >= new Date(previousMonth.start) &&
    new Date(lesson.scheduled_at) < new Date(previousMonth.end)
  );
  const currentRatings = (performanceFeedback ?? []).filter((item) => item.feedback_month === currentMonth.key);
  const previousRatings = (performanceFeedback ?? []).filter((item) => item.feedback_month === previousMonth.key);
  const average = (items: Array<{ rating: number }>) =>
    items.length ? items.reduce((sum, item) => sum + Number(item.rating), 0) / items.length : null;
  const currentAverage = average(currentRatings);
  const previousAverage = average(previousRatings);



  const bratislavaDateFormatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Bratislava",
  });
  const todayKey = bratislavaDateFormatter.format(now);

  // Query a safe UTC window and filter by Europe/Bratislava below.
  // This avoids a fixed +02:00 offset, which would break after DST changes.
  const todayWindowStart = new Date(
    now.getTime() - 36 * 60 * 60 * 1000
  ).toISOString();
  const todayWindowEnd = new Date(
    now.getTime() + 36 * 60 * 60 * 1000
  ).toISOString();

  const { data: todayLessonCandidates, error: todayLessonCandidatesError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
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
    .gte("scheduled_at", todayWindowStart)
    .lte("scheduled_at", todayWindowEnd)
    .order("scheduled_at", { ascending: true });

  const todayLessons = (todayLessonCandidates ?? []).filter(
    (lesson) =>
      bratislavaDateFormatter.format(new Date(lesson.scheduled_at)) === todayKey
  );

  const { data: upcomingLessons, error: upcomingLessonsError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      language,
      student:profiles!lessons_student_id_fkey (
        full_name
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled"])
    .gte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true });

  const { data: assignedLessonStudents, error: assignedLessonStudentsError } = await supabase
    .from("lessons")
    .select("student_id")
    .eq("teacher_id", user.id);

  const { data: pendingRequests, error: pendingRequestsError } = await supabase
    .from("schedule_change_requests")
    .select(`
      id,
      requested_by,
      preferred_at,
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

  const dashboardDataError = Boolean(
    todayLessonCandidatesError ||
    upcomingLessonsError ||
    assignedLessonStudentsError ||
    pendingRequestsError
  );

  const myPendingRequests =
    pendingRequests?.filter((request) => {
      const lesson = Array.isArray(request.lesson)
        ? request.lesson[0]
        : request.lesson;

      return (
        lesson?.teacher_id === user.id &&
        request.requested_by !== user.id
      );
    }) ?? [];

  const uniqueStudents = new Map<
    string,
    {
      id: string;
      name: string;
      language: string;
      nextLesson: string;
    }
  >();

  for (const lesson of upcomingLessons ?? []) {
    if (uniqueStudents.has(lesson.student_id)) continue;

    const student = studentDirectory.get(lesson.student_id);

    uniqueStudents.set(lesson.student_id, {
      id: lesson.student_id,
      name: getName(student, sk),
      language: formatLanguage(lesson.language, language),
      nextLesson: lesson.scheduled_at,
    });
  }

  const students = Array.from(uniqueStudents.values());
  const assignedStudentCount = new Set(
    (assignedLessonStudents ?? []).map((lesson) => lesson.student_id)
  ).size;
  const nextTodayLessonId =
    todayLessons.find(
      (lesson) => new Date(lesson.scheduled_at).getTime() >= now.getTime()
    )?.id ?? null;

  const teacherName =
    teacherProfile?.full_name?.trim() ||
    teacherProfile?.email ||
    user.email ||
    (sk ? "Lektor" : "Teacher");

  const firstName = teacherName.split(" ")[0];
  const publicProfileComplete = Boolean(
    publicProfile?.photo_path &&
    publicProfile?.headline?.trim() &&
    publicProfile?.bio?.trim().length >= 20 &&
    publicProfile?.languages?.length
  );
  const matchingPreferencesComplete = Boolean(
    matchingPreferences?.languages?.length &&
    matchingPreferences?.levels?.length &&
    matchingPreferences?.days?.length &&
    matchingPreferences?.time_from &&
    matchingPreferences?.time_to &&
    Number(matchingPreferences?.max_new_students ?? 0) > 0
  );

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <BrandLogo compact />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{teacherName}</p>
              <p className="text-xs text-gray-400">{sk ? "Portál lektora" : "Teacher portal"}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F3AA2] text-sm font-semibold text-white">
              {getInitials(teacherName)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Prehľad lektora" : "Teacher overview"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Vitajte" : "Welcome"}, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            {sk ? "Tu nájdete prehľad dnešných hodín, študentov a žiadostí o zmenu termínu." : "Here you can see today’s lessons, students and schedule-change requests."}
          </p>
        </section>

        {(dashboardDataError || performanceLoadError) && (
          <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Niektoré údaje na prehľade sa nepodarilo načítať. Rozvrh alebo mesačný súhrn môže byť dočasne neúplný; obnovte stránku pred vykonaním zmien." : "Some dashboard data could not be loaded. The schedule or monthly summary may be temporarily incomplete; refresh the page before making changes."}
          </div>
        )}

        {!publicProfileComplete && (
          <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#2F3AA2]/20 bg-[#EEF2FF] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#2F3AA2]">{sk ? "Dokončite svoj profil lektora" : "Complete your teacher profile"}</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">{sk ? "Pridajte profilovú fotku, jazyky, krátky titulok a predstavenie. Po dokončení sa profil môže zobraziť aj na hlavnom webe Mundus." : "Add a profile photo, languages, a short headline and introduction. Once complete, your profile can also appear on the main Mundus website."}</p>
            </div>
            <Link href="/teacher/profile" className="shrink-0 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Dokončiť profil" : "Complete profile"}</Link>
          </section>
        )}

        {!matchingPreferencesComplete && (
          <section className="mt-4 flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-amber-900">{sk ? "Nastavte dostupnosť pre priraďovanie študentov" : "Set availability for student matching"}</p>
              <p className="mt-1 text-sm leading-6 text-amber-900/75">{sk ? "Doplňte jazyky, úrovne, dni, časové okno a kapacitu. Bez týchto údajov vás smart matching nevie správne odporučiť novým študentom." : "Add your languages, levels, days, time window and capacity. Without these details, smart matching cannot recommend you accurately to new students."}</p>
            </div>
            <Link href="/teacher/availability" className="shrink-0 rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk ? "Nastaviť dostupnosť" : "Set availability"}</Link>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">{sk ? "Môj mesačný súhrn" : "My monthly summary"}</p>
              <h2 className="mt-1 text-xl font-semibold">{sk ? "Výkon tento mesiac" : "Performance this month"}</h2>
            </div>
            <TrendingUp size={20} className="text-[#2F3AA2]" />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-[#FAFAF9] p-4"><p className="text-xs text-gray-400">{sk ? "Dokončené hodiny" : "Completed lessons"}</p><p className="mt-1 text-2xl font-semibold">{performanceLoadError ? "—" : currentLessons.length}</p><p className="mt-1 text-xs text-gray-400">{sk ? "minulý mesiac" : "last month"} {performanceLoadError ? "—" : previousLessons.length}</p></div>
            <div className="rounded-2xl bg-[#FAFAF9] p-4"><p className="text-xs text-gray-400">{sk ? "Unikátni študenti" : "Unique students"}</p><p className="mt-1 text-2xl font-semibold">{new Set(currentLessons.map((lesson) => lesson.student_id)).size}</p></div>
            <div className="rounded-2xl bg-[#FAFAF9] p-4"><p className="text-xs text-gray-400">{sk ? "Priemerné hodnotenie" : "Average rating"}</p><p className="mt-1 flex items-center gap-1 text-2xl font-semibold"><Star size={18} fill="currentColor" />{currentAverage === null ? "—" : currentAverage.toFixed(2)}</p><p className="mt-1 text-xs text-gray-400">{sk ? "minulý mesiac" : "last month"} {previousAverage === null ? "—" : previousAverage.toFixed(2)}</p></div>
            <div className="rounded-2xl bg-[#FAFAF9] p-4"><p className="text-xs text-gray-400">{sk ? "Počet hodnotení" : "Rating count"}</p><p className="mt-1 text-2xl font-semibold">{performanceLoadError ? "—" : currentRatings.length}</p><p className="mt-1 text-xs text-gray-400">{sk ? "Spätná väzba je zobrazená iba súhrnne." : "Feedback is shown only in aggregate."}</p></div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{sk ? "Dnes" : "Today"}</p>
              <CalendarDays size={19} className="text-[#2F3AA2]" />
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {dashboardDataError ? "—" : (todayLessons?.length ?? 0)}
            </p>

            <p className="mt-1 text-sm text-gray-500">{sk ? "hodín" : "lessons"}</p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{sk ? "Moji študenti" : "My students"}</p>
              <Users size={19} className="text-[#2F3AA2]" />
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {dashboardDataError ? "—" : assignedStudentCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "priradených študentov" : "assigned students"}
            </p>
          </article>

          <article className="rounded-3xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#92400e]/70">
                {sk ? "Žiadosti o zmenu termínu" : "Schedule change requests"}
              </p>
              <Clock3 size={19} className="text-[#2F3AA2]" />
            </div>

            <p className="mt-3 text-3xl font-semibold text-[#92400e]">
              {dashboardDataError ? "—" : myPendingRequests.length}
            </p>

            <p className="mt-1 text-sm text-[#92400e]/70">
              {sk ? "čakajú na vybavenie" : "awaiting action"}
            </p>
          </article>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{sk ? "Rozvrh" : "Schedule"}</p>
              <h2 className="mt-1 text-xl font-semibold">
                {sk ? "Dnešné hodiny" : "Today’s lessons"}
              </h2>
            </div>

            <Link
              href="/teacher/schedule"
              className="rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {sk ? "Zobraziť rozvrh" : "View schedule"}
            </Link>
          </div>

          {!todayLessons?.length ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">{sk ? "Dnes nemáte naplánované hodiny" : "You have no lessons scheduled today"}</p>
              <p className="mt-1 text-sm text-gray-400">
                {sk ? "Naplánované dnešné hodiny sa zobrazia tu." : "Today’s scheduled lessons will appear here."}
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {todayLessons.map((lesson) => {
                const student = studentDirectory.get(lesson.student_id);
                const lessonLink = safeLessonLink(lesson.meet_link);

                return (
                  <article
                    key={lesson.id}
                    className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                      lesson.id === nextTodayLessonId
                        ? "border-[#2F3AA2]/10 bg-[#2F3AA2] text-white"
                        : "border-black/5 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold ${
                            lesson.id === nextTodayLessonId
                              ? "bg-white/10"
                              : "bg-[#EEF2FF] text-[#0a0a0f]"
                          }`}
                        >
                          {formatTime(lesson.scheduled_at, language)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {getName(student, sk)}
                            </h3>

                            {lesson.id === nextTodayLessonId && (
                              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                                {sk ? "Najbližšia" : "Next"}
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-1 text-sm ${
                              lesson.id === nextTodayLessonId
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {formatLanguage(lesson.language, language)} ·{" "}
                            {lesson.duration_minutes || 60} min
                          </p>
                        </div>
                      </div>

                      {lessonLink ? (
                        <a
                          href={lessonLink}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                            lesson.id === nextTodayLessonId
                              ? "bg-white text-[#0a0a0f]"
                              : "bg-[#EEF2FF] text-[#0a0a0f]"
                          }`}
                        >
                          <Video size={17} />
                          {sk ? "Pripojiť sa na hodinu" : "Join lesson"}
                        </a>
                      ) : (
                        <span
                          className={`rounded-xl px-4 py-3 text-sm ${
                            lesson.id === nextTodayLessonId
                              ? "bg-white/10 text-white/60"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {sk ? "Odkaz na Meet zatiaľ nie je pridaný" : "Meet link has not been added yet"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {myPendingRequests.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-[#2F3AA2]" />
              <h2 className="text-xl font-semibold">
                {sk ? "Vyžaduje vašu pozornosť" : "Needs your attention"}
              </h2>
            </div>

            <div className="mt-4 rounded-3xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                {sk ? "Zmeny termínov" : "Schedule changes"}
              </p>

              <h3 className="mt-3 font-semibold text-[#92400e]">
                {myPendingRequests.length === 1
                  ? "1 študent čaká na vašu odpoveď"
                  : `${myPendingRequests.length} študentov čaká na vašu odpoveď`}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#92400e]/75">
                Skontrolujte navrhované termíny pred potvrdením zmeny.
              </p>

              <Link
                href="/teacher/schedule"
                className="mt-5 inline-flex rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Skontrolovať žiadosti
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Študenti</p>
              <h2 className="mt-1 text-xl font-semibold">
                Moji študenti
              </h2>
            </div>

            <GraduationCap size={21} className="text-[#2F3AA2]" />
          </div>

          {students.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">Žiadni študenti s naplánovanou hodinou</p>
              <p className="mt-1 text-sm text-gray-400">
                Študenti s naplánovanou ďalšou hodinou sa zobrazia tu.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              {students.slice(0, 6).map((student, index) => (
                <Link
                  key={student.id}
                  href={`/teacher/student/${student.id}`}
                  className={`flex items-center justify-between gap-4 p-5 transition hover:bg-[#FAFAF9] sm:p-6 ${
                    index !== Math.min(students.length, 6) - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold">{student.name}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      {student.language} · {sk ? "Najbližšia:" : "Next:"}{" "}
                      {formatShortDate(student.nextLesson, language)} ·{" "}
                      {formatTime(student.nextLesson, language)}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-gray-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
