import { missingLessonReports } from "@/lib/missing-reports";
import { followupQueue } from "@/lib/followup-queue";
import FollowupForm, { type Followup } from "./FollowupForm";
import Link from "next/link";
import { renewalAttention } from "@/lib/renewal-attention";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Package,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatLanguage, formatLessonStatus } from "@/lib/portalLabels";
import { currentLanguage, localeFor } from "@/lib/i18n";
import { markContactRequestContacted } from "./contact-request-actions";
import type { Language } from "@/context/LanguageContext";

function formatTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function getName(profile: { full_name?: string | null; email?: string | null } | null | undefined, fallback: string) {
  return profile?.full_name?.trim() || profile?.email || fallback;
}

function packageAlertLabel(count: number, language: Language) {
  if (language === "en") return `${count} package${count === 1 ? "" : "s"} with 1–2 lessons remaining`;
  if (count === 1) return "1 balíček s 1–2 zostávajúcimi hodinami";
  if (count >= 2 && count <= 4) return `${count} balíčky s 1–2 zostávajúcimi hodinami`;
  return `${count} balíčkov s 1–2 zostávajúcimi hodinami`;
}

function requestAlertLabel(count: number, language: Language) {
  if (language === "en") return `${count} pending schedule-change request${count === 1 ? "" : "s"}`;
  if (count === 1) return "1 čakajúca žiadosť o zmenu termínu";
  if (count >= 2 && count <= 4) return `${count} čakajúce žiadosti o zmenu termínu`;
  return `${count} čakajúcich žiadostí o zmenu termínu`;
}

function noUpcomingLabel(count: number, language: Language) {
  if (language === "en") return `${count} active student${count === 1 ? "" : "s"} without a next scheduled lesson`;
  if (count === 1) return "1 aktívny študent bez naplánovanej ďalšej hodiny";
  if (count >= 2 && count <= 4) return `${count} aktívni študenti bez naplánovanej ďalšej hodiny`;
  return `${count} aktívnych študentov bez naplánovanej ďalšej hodiny`;
}

export default async function AdminDashboardPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { profile } = await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  const [
    { data: students, error: studentsError },
    { data: teachers, error: teachersError },
    { data: lessons, error: lessonsError },
    { data: packages, error: packagesError },
    { data: requests, error: requestsError },
    { data: paidOrders, error: paidOrdersError },
    { data: onboardingRows, error: onboardingError },
    { data: teacherPreferences, error: teacherPreferencesError },
    { data: teacherPublicProfiles, error: teacherPublicProfilesError },
    { data: contactRequests, error: contactRequestsError },
  ] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email").eq("role", "student").eq("status", "active"),
    supabase.from("profiles").select("id,full_name,email").eq("role", "teacher").eq("status", "active"),
    supabase
      .from("lessons")
      .select(`
        id,student_id,teacher_id,scheduled_at,status,language,
        student:profiles!lessons_student_id_fkey(full_name,email),
        teacher:profiles!lessons_teacher_id_fkey(full_name,email)
      `)
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("lesson_packages")
      .select("student_id,remaining_lessons,status")
      .in("status", ["active", "completed"]),
    supabase
      .from("schedule_change_requests")
      .select("id,status")
      .eq("status", "pending"),
    supabase
      .from("payment_orders")
      .select("student_id,paid_at,status")
      .eq("status", "paid")
      .order("paid_at", { ascending: false }),
    supabase
      .from("student_onboarding")
      .select("student_id"),
    supabase
      .from("teacher_preferences")
      .select("teacher_id,languages,levels,days,time_from,time_to,max_new_students"),
    supabase
      .from("teacher_public_profiles")
      .select("teacher_id,headline,bio,languages,photo_path"),
    adminClient
      .from("contact_requests")
      .select("id,full_name,email,language,package_lessons,request_type,group_size,message,status,created_at")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const hasLoadError = Boolean(
    studentsError ||
      teachersError ||
      lessonsError ||
      packagesError ||
      requestsError ||
      paidOrdersError ||
      onboardingError ||
      teacherPreferencesError ||
      teacherPublicProfilesError ||
      contactRequestsError
  );

  const { data: followups, error: followupError } = await supabase.from("renewal_followups").select("student_id,status,last_contact,next_followup,note,updated_at");
  const followupRows: Followup[] = followups ?? [];
  const {data:recentCompleted,error:completedError}=await supabase.from("lessons").select("id,scheduled_at,status,language,student:profiles!lessons_student_id_fkey(full_name,email),teacher:profiles!lessons_teacher_id_fkey(full_name,email)").eq("status","completed").order("scheduled_at",{ascending:false}).limit(50);
  const completedIds=(recentCompleted??[]).map(lesson=>lesson.id);
  const {data:reportIds,error:reportError}=completedIds.length ? await supabase.from("lesson_reports").select("lesson_id").in("lesson_id",completedIds) : {data:[],error:null};
  const now = new Date();
  const missingReports=completedError||reportError ? null : missingLessonReports(recentCompleted??[],reportIds??[],now.getTime());
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayKey = dateKey.format(now);
  const contactQueue = studentsError || followupError ? null : followupQueue(students ?? [], followupRows, todayKey);

  const todayLessons = (lessons ?? []).filter(
    (lesson) =>
      ["scheduled", "rescheduled"].includes(lesson.status) &&
      dateKey.format(new Date(lesson.scheduled_at)) === todayKey
  );

  const upcomingStudentIds = new Set(
    (lessons ?? [])
      .filter(
        (lesson) =>
          ["scheduled", "rescheduled"].includes(lesson.status) &&
          new Date(lesson.scheduled_at).getTime() >= now.getTime()
      )
      .map((lesson) => lesson.student_id)
  );

  const workloadCutoff = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  const teacherWorkload = (teachers ?? []).map((teacher) => ({
    ...teacher,
    upcoming: (lessons ?? []).filter(
      (lesson) =>
        lesson.teacher_id === teacher.id &&
        ["scheduled", "rescheduled"].includes(lesson.status) &&
        new Date(lesson.scheduled_at).getTime() >= now.getTime() &&
        new Date(lesson.scheduled_at).getTime() < workloadCutoff
    ).length,
  })).sort((a, b) => b.upcoming - a.upcoming || getName(a, "").localeCompare(getName(b, ""), "sk"));

  const allLessonStudentIds = new Set((lessons ?? []).map((lesson) => lesson.student_id));
  const paidStudentIds = new Set((paidOrders ?? []).map((order) => order.student_id));
  const newPaidUnassigned = (students ?? []).filter(
    (student) => paidStudentIds.has(student.id) && !allLessonStudentIds.has(student.id)
  );

  const onboardingStudentIds = new Set((onboardingRows ?? []).map((row) => row.student_id));
  const studentsMissingOnboarding = (students ?? []).filter((student) => !onboardingStudentIds.has(student.id));
  const paidWaitingForOnboarding = newPaidUnassigned.filter(student => !onboardingStudentIds.has(student.id));
  const readyForMatching = newPaidUnassigned.filter(student => onboardingStudentIds.has(student.id));

  const preferencesByTeacher = new Map((teacherPreferences ?? []).map((row) => [row.teacher_id, row]));
  const publicProfileByTeacher = new Map((teacherPublicProfiles ?? []).map((row) => [row.teacher_id, row]));
  const teachersMissingMatching = (teachers ?? []).filter((teacher) => {
    const pref = preferencesByTeacher.get(teacher.id);
    return !(
      pref?.languages?.length &&
      pref?.levels?.length &&
      pref?.days?.length &&
      pref?.time_from &&
      pref?.time_to &&
      Number(pref?.max_new_students ?? 0) > 0
    );
  });
  const teachersMissingPublicProfile = (teachers ?? []).filter((teacher) => {
    const publicProfile = publicProfileByTeacher.get(teacher.id);
    return !(
      publicProfile?.photo_path &&
      publicProfile?.headline?.trim() &&
      publicProfile?.bio?.trim().length >= 20 &&
      publicProfile?.languages?.length
    );
  });

  const lowPackages = (packages ?? []).filter(
    (pkg) => pkg.status === "active" && (pkg.remaining_lessons ?? 0) > 0 && (pkg.remaining_lessons ?? 0) <= 2
  );
  const noUpcoming = (students ?? []).filter(
    (student) => !upcomingStudentIds.has(student.id)
  ).length;
  const pendingRequests = requests?.length ?? 0;
  const renewalRows = studentsError || packagesError ? null : renewalAttention(students ?? [], packages ?? []);

  const firstName =
    profile?.full_name?.trim()?.split(/\s+/)[0] || (sk ? "Administrátor" : "Administrator");

  return (
    <main className="dashboard-page min-h-screen bg-transparent text-[#171A2B]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="dashboard-welcome relative overflow-hidden rounded-[1.6rem] p-6 sm:rounded-[2rem] sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#DDE4FF]">
            {sk ? "Administrácia Mundus" : "Mundus administration"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Vitajte" : "Welcome"}, {firstName}
          </h1>
          <p className="mt-2 text-gray-500">
            {sk ? "Aktuálny prehľad študentov, lektorov, balíčkov a dnešných hodín." : "Current overview of students, teachers, packages and today’s lessons."}
          </p>
        </section>

        <div className="mt-5 flex flex-wrap gap-3"><Link href="/admin/matching" className="inline-block rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{sk ? "Priradiť študenta k lektorovi" : "Match student with teacher"}</Link><Link href="/admin/calendar" className="inline-block rounded-xl border border-[#2F3AA2]/20 bg-white px-5 py-3 font-semibold text-[#2F3AA2]">{sk ? "Otvoriť kalendár" : "Open calendar"}</Link></div>

        {(contactRequests?.length ?? 0) > 0 && <section className="mt-6 rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">{sk ? "Nová žiadosť z webu" : "New website request"}</p>
              <h2 className="mt-1 text-xl font-semibold text-indigo-950">{sk ? "Ozvite sa novému záujemcovi" : "Contact the new lead"}</h2>
              <p className="mt-2 text-sm text-indigo-900/75">{sk ? "Tieto žiadosti prišli cez verejnú stránku Mundus a ešte nie sú označené ako vybavené." : "These requests came through the public Mundus website and are not marked as handled yet."}</p>
            </div>
            <Link href="/contact" className="rounded-xl border border-[#2F3AA2]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#2F3AA2]">{sk ? "Pozrieť verejný formulár" : "View public form"}</Link>
          </div>
          <ul className="mt-4 divide-y divide-indigo-200">
            {(contactRequests ?? []).map(request => <li key={request.id} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-indigo-950">{request.full_name}</p>
                  <p className="text-sm text-indigo-900/70">{request.email} · {request.language} · {request.request_type === "group" ? (sk ? `skupina ${request.group_size ?? "?"} osôb` : `group of ${request.group_size ?? "?"}`) : (sk ? "individuálne" : "individual")}{request.package_lessons ? ` · ${request.package_lessons} ${sk ? (request.package_lessons === 1 ? "hodina" : "hodín") : (request.package_lessons === 1 ? "lesson" : "lessons")}` : ""}</p>
                  {request.message && <p className="mt-1 max-w-3xl text-sm text-indigo-900/75">{request.message}</p>}
                </div>
                <form action={markContactRequestContacted}>
                  <input type="hidden" name="request_id" value={request.id} />
                  <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2F3AA2] hover:bg-indigo-100">{sk ? "Označiť ako kontaktované" : "Mark contacted"}</button>
                </form>
              </div>
            </li>)}
          </ul>
        </section>}

        {readyForMatching.length > 0 && <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">{sk ? "Pripravené na matching" : "Ready for matching"}</p><h2 className="mt-1 text-xl font-semibold text-emerald-950">{sk ? "Skontrolujte odporúčané zhody" : "Review recommended matches"}</h2><p className="mt-2 text-sm text-emerald-900/75">{sk ? "Títo študenti majú zaplatený balíček, dokončený onboarding a systém už má údaje na odporúčanie lektora." : "These students have a paid package, completed onboarding, and enough data for teacher recommendations."}</p></div>
            <Link href="/admin/matching" className="rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">{sk ? "Zobraziť odporúčania" : "View recommendations"}</Link>
          </div>
          <ul className="mt-4 divide-y divide-emerald-200">{readyForMatching.map(student=><li key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-semibold text-emerald-950">{getName(student, sk ? "Študent" : "Student")}</p><p className="text-sm text-emerald-900/70">{student.email}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900">{sk ? "Pripravené" : "Ready"}</span></li>)}</ul>
        </section>}

        {paidWaitingForOnboarding.length > 0 && <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">{sk ? "Platba prijatá" : "Payment received"}</p><h2 className="mt-1 text-xl font-semibold text-amber-950">{sk ? "Čakáme na onboarding" : "Waiting for onboarding"}</h2><p className="mt-2 text-sm text-amber-900/75">{sk ? "Študent už zaplatil, ale ešte nedoplnil jazyk, úroveň, frekvenciu a preferované termíny." : "The student has paid but has not yet completed language, level, frequency and availability preferences."}</p></div>
          </div>
          <ul className="mt-4 divide-y divide-amber-200">{paidWaitingForOnboarding.map(student=><li key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-semibold text-amber-950">{getName(student,"Študent")}</p><p className="text-sm text-amber-900/70">{student.email}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">{sk ? "Čaká na údaje" : "Waiting for details"}</span></li>)}</ul>
        </section>}

        {hasLoadError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk ? "Niektoré údaje sa nepodarilo načítať. Obnovte stránku a skúste to znova." : "Some data could not be loaded. Refresh the page and try again."}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{studentsError ? "—" : students?.length ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">{sk ? "Aktívni študenti" : "Active students"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{teachersError ? "—" : teachers?.length ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">{sk ? "Aktívni lektori" : "Active teachers"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{lessonsError ? "—" : todayLessons.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk ? "Dnešné hodiny" : "Today’s lessons"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{requestsError ? "—" : pendingRequests}</p>
            <p className="mt-1 text-sm text-gray-500">{sk ? "Čakajúce žiadosti o zmenu termínu" : "Pending schedule-change requests"}</p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{sk ? "Priorita" : "Priority"}</p>
                <h2 className="mt-1 text-xl font-semibold">{sk ? "Vyžaduje pozornosť" : "Needs attention"}</h2>
              </div>
              <AlertCircle size={21} className="text-[#2F3AA2]" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{paidOrdersError || lessonsError ? (sk ? "Nové nákupy sa nepodarilo overiť" : "New purchases could not be verified") : sk ? readyForMatching.length + " pripravených na priradenie · " + paidWaitingForOnboarding.length + " čaká na nastavenie štúdia" : readyForMatching.length + " ready for teacher assignment · " + paidWaitingForOnboarding.length + " waiting for learning setup"}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Po nákupe skontrolujte odporúčané priradenie a vytvorte prvú hodinu." : "After purchase, review the recommended teacher assignment and create the first lesson."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{packagesError ? (sk ? "Stav balíčkov sa nepodarilo načítať" : "Package status could not be loaded") : packageAlertLabel(lowPackages.length, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Odporúčame kontaktovať študenta ohľadom pokračovania." : "We recommend contacting the student about continuing."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{requestsError ? (sk ? "Žiadosti sa nepodarilo načítať" : "Requests could not be loaded") : requestAlertLabel(pendingRequests, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Čaká sa na kontrolu alebo odpoveď lektora." : "Waiting for teacher review or response."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{studentsError || lessonsError ? (sk ? "Ďalšie termíny sa nepodarilo overiť" : "Upcoming lessons could not be verified") : noUpcomingLabel(noUpcoming, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Môže byť potrebné dohodnúť ďalší termín." : "A new lesson time may need to be arranged."}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{onboardingError
  ? (sk ? "Nastavenie študentov sa nepodarilo overiť" : "Student setup could not be verified")
  : sk
    ? (studentsMissingOnboarding.length === 1 ? "1 aktívny študent nemá dokončené nastavenie štúdia" : `${studentsMissingOnboarding.length} aktívnych študentov nemá dokončené nastavenie štúdia`)
    : (studentsMissingOnboarding.length === 1 ? "1 active student has not completed learning setup" : `${studentsMissingOnboarding.length} active students have not completed learning setup`)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Bez dokončeného nastavenia môžu chýbať údaje potrebné na priradenie lektora a správne nastavenie výučby." : "Without completed setup, information needed for teacher assignment and lesson setup may be missing."}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{teacherPreferencesError
  ? (sk ? "Nastavenia dostupnosti lektorov sa nepodarilo overiť" : "Teacher availability settings could not be verified")
  : sk
    ? (teachersMissingMatching.length === 1 ? "1 aktívny lektor nemá kompletné nastavenia dostupnosti" : `${teachersMissingMatching.length} aktívnych lektorov nemá kompletné nastavenia dostupnosti`)
    : (teachersMissingMatching.length === 1 ? "1 active teacher has incomplete availability settings" : `${teachersMissingMatching.length} active teachers have incomplete availability settings`)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Lektor potrebuje jazyky, úrovne, dni, časové okno a kapacitu." : "Teachers need languages, levels, days, a time window and capacity."}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{teacherPublicProfilesError
  ? (sk ? "Verejné profily lektorov sa nepodarilo overiť" : "Public teacher profiles could not be verified")
  : sk
    ? (teachersMissingPublicProfile.length === 1 ? "1 aktívny lektor nemá kompletný verejný profil" : `${teachersMissingPublicProfile.length} aktívnych lektorov nemá kompletný verejný profil`)
    : (teachersMissingPublicProfile.length === 1 ? "1 active teacher has an incomplete public profile" : `${teachersMissingPublicProfile.length} active teachers have incomplete public profiles`)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Pred zverejnením je potrebná fotka, jazyky, titulok a predstavenie." : "A photo, languages, headline and introduction are required before publishing."}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-[#2F3AA2] p-6 text-white shadow-sm">
            <Package size={21} className="text-[#C7D2FE]" />
            <p className="mt-5 text-sm text-white/50">{sk ? "Balíčky" : "Packages"}</p>
            <h2 className="mt-1 text-xl font-semibold">{sk ? "Prehľad pokračovania" : "Continuation overview"}</h2>
            <p className="mt-7 text-4xl font-semibold">{packagesError ? "—" : lowPackages.length}</p>
            <p className="mt-2 text-sm text-white/65">{sk ? "Aktívne balíčky s poslednými 1–2 hodinami" : "Active packages with the final 1–2 lessons"}</p>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Vyťaženie lektorov" : "Teacher workload"}</h2>
              <p className="mt-2 text-sm text-gray-600">{sk ? "Naplánované a presunuté hodiny počas najbližších 7 dní. Je to orientačný prehľad pre priraďovanie nových študentov." : "Scheduled and rescheduled lessons over the next 7 days. This is a planning overview for assigning new students."}</p>
            </div>
            <Link href="/admin/matching" className="font-semibold text-[#2F3AA2] underline">{sk ? "Otvoriť priradenie" : "Open matching"}</Link>
          </div>
          {teachersError || lessonsError ? (
            <p role="alert" className="mt-4 text-red-700">{sk ? "Vyťaženie lektorov sa nepodarilo načítať." : "Teacher workload could not be loaded."}</p>
          ) : teacherWorkload.length === 0 ? (
            <p className="mt-4 text-gray-600">{sk ? "Zatiaľ nemáte aktívnych lektorov." : "You do not have any active teachers yet."}</p>
          ) : (
            <ul className="mt-4 divide-y divide-indigo-100">
              {teacherWorkload.map((teacher) => (
                <li key={teacher.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-semibold">{getName(teacher, sk ? "Lektor" : "Teacher")}</p>
                    <p className="text-sm text-gray-500">{sk ? "Najbližších 7 dní" : "Next 7 days"}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-[#2F3AA2]">
                    {sk ? (teacher.upcoming === 1 ? "1 hodina" : teacher.upcoming >= 2 && teacher.upcoming <= 4 ? `${teacher.upcoming} hodiny` : `${teacher.upcoming} hodín`) : `${teacher.upcoming} lesson${teacher.upcoming === 1 ? "" : "s"}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Dokončené hodiny bez záznamu lektora" : "Completed lessons without teacher reports"}</h2>
          <p className="mt-2 text-sm text-gray-600">{sk ? "Kontrola posledných 50 dokončených hodín. Záznam pomáha študentovi vidieť spätnú väzbu a ďalšie zameranie; jeho uloženie nemení zostatok balíčka." : "Review of the latest 50 completed lessons. Reports help students see feedback and their next focus; saving a report does not change the package balance."}</p>
          {missingReports === null ? <p role="alert" className="mt-4 text-red-700">{sk ? "Záznamy hodín sa nepodarilo overiť. Obnovte stránku." : "Lesson reports could not be verified. Refresh the page."}</p> : !missingReports.length ? <p className="mt-4 text-gray-600">{sk ? "Skontrolované dokončené hodiny majú uložený záznam alebo zatiaľ nemáte dokončené hodiny." : "The reviewed completed lessons have reports, or there are no completed lessons yet."}</p> : <ul className="mt-4 divide-y divide-indigo-100">{missingReports.map(lesson=>{const student=Array.isArray(lesson.student)?lesson.student[0]:lesson.student;const teacher=Array.isArray(lesson.teacher)?lesson.teacher[0]:lesson.teacher;return <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{getName(student, sk ? "Študent" : "Student")} · {formatLanguage(lesson.language, language)}</p><p className="mt-1 text-sm text-gray-600">{new Intl.DateTimeFormat(localeFor(language),{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Bratislava"}).format(new Date(lesson.scheduled_at))} · {sk ? "Lektor" : "Teacher"}: {getName(teacher, sk ? "Nepriradený" : "Unassigned")}</p></div><span className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{sk ? "Doplniť záznam" : "Add report"}</span></li>;})}</ul>}
          <Link href="/admin/lessons" className="mt-5 inline-block font-semibold text-[#2F3AA2] underline">{sk ? "Otvoriť prehľad hodín" : "Open lesson overview"}</Link>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Plán kontaktovania študentov" : "Student follow-up plan"}</h2>
          <p className="mt-2 text-sm text-gray-600">{sk ? "Otvorené záznamy podľa ďalšieho kontaktovania, aj po zakúpení nového balíčka. Dátumy sa posudzujú podľa Bratislavy. Uzavreté záznamy a neaktívne účty sa nezobrazujú." : "Open follow-up records, including after a new package purchase. Dates use Bratislava time. Closed records and inactive accounts are hidden."}</p>
          {contactQueue === null ? <p role="alert" className="mt-4 text-red-700">{sk ? "Plán kontaktovania sa nepodarilo načítať. Overte pripravenie databázy alebo obnovte stránku." : "The follow-up plan could not be loaded. Check the database setup or refresh the page."}</p> : !contactQueue.length ? <p className="mt-4 text-gray-600">{sk ? "Zatiaľ žiadne otvorené záznamy. Pridajte záznam pri študentovi v zozname pokračovania nižšie." : "There are no open follow-up records yet. Add one for a student in the continuation list below."}</p> : <ul className="mt-4 divide-y divide-indigo-100">{contactQueue.map(({student,record,due})=><li key={student.id} className="py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{getName(student, sk ? "Študent" : "Student")}</p><p className="break-all text-sm text-gray-600">{student.email||(sk ? "E-mail nie je uvedený" : "Email not provided")}</p></div><span className={`rounded-full px-3 py-2 text-sm font-semibold ${due ? "bg-amber-50 text-amber-900" : "bg-indigo-50 text-[#2F3AA2]"}`}>{!record.next_followup ? (sk ? "Doplniť dátum" : "Add date") : due ? (sk ? "Ozvať sa dnes / po termíne" : "Contact today / overdue") : (sk ? "Naplánované" : "Scheduled")}</span></div><p className="mt-2 text-sm text-gray-600">{(sk ? ({to_contact:"Ozvať sa",contacted:"Kontaktovaný",waiting:"Čaká sa na odpoveď",later:"Ozvať sa neskôr"} as Record<string,string>) : ({to_contact:"Contact",contacted:"Contacted",waiting:"Waiting for reply",later:"Contact later"} as Record<string,string>))[record.status]||record.status}</p><FollowupForm key={`${student.id}:${record.updated_at}`} studentId={student.id} record={record}/></li>)}</ul>}
          <p className="mt-4 text-sm text-gray-500">{sk ? "Ide o interný plán. Kontaktovanie vykonáte sami; žiadna správa sa automaticky neodosiela." : "This is an internal plan. You contact students manually; no message is sent automatically."}</p>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Komu sa ozvať ohľadom pokračovania" : "Students to contact about continuing"}</h2>
          <p className="mt-2 text-sm text-gray-600">{sk ? "Aktívni študenti s celkovým zostatkom 0–2 hodiny. Nové účty bez zakúpeného balíčka sem nepatria. Pred kontaktovaním skontrolujte balíčky a dohodnuté termíny." : "Active students with a total balance of 0–2 lessons. New accounts without a purchased package are excluded. Check packages and scheduled lessons before contacting them."}</p>
          {renewalRows === null ? <p role="alert" className="mt-4 text-red-700">{sk ? "Zostatky sa nepodarilo overiť. Obnovte stránku." : "Balances could not be verified. Refresh the page."}</p> : renewalRows.length === 0 ? <p className="mt-4 text-gray-600">{sk ? "Momentálne nikto nemá zostatok 0–2 hodiny na pokračovanie." : "No students currently have a 0–2 lesson balance for continuation."}</p> : <ul className="mt-5 divide-y divide-indigo-100">{renewalRows.map(student => <li key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{getName(student, sk ? "Študent" : "Student")}</p><p className="break-all text-sm text-gray-600">{student.email || (sk ? "E-mail nie je uvedený" : "Email not provided")}</p></div><span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-[#2F3AA2]">{sk ? (student.remaining === 0 ? "Balíček vyčerpaný" : student.remaining === 1 ? "Posledná hodina" : "Posledné 2 hodiny") : (student.remaining === 0 ? "Package used up" : student.remaining === 1 ? "Last lesson" : "Last 2 lessons")}</span>{!followupError && <FollowupForm key={`${student.id}:${followupRows.find(row=>row.student_id===student.id)?.updated_at||"new"}`} studentId={student.id} record={followupRows.find(row=>row.student_id===student.id)}/>}</li>)}</ul>}
          {followupError && <p role="alert" className="mt-4 text-sm text-red-700">{sk ? "Záznamy kontaktovania nie sú dostupné. Najprv treba pripraviť databázu alebo obnoviť stránku." : "Follow-up records are unavailable. Prepare the database first or refresh the page."}</p>}
          <div className="mt-5 flex flex-wrap gap-4"><Link href="/admin/packages" className="font-semibold text-[#2F3AA2] underline">{sk ? "Skontrolovať balíčky" : "Check packages"}</Link><Link href="/admin/students" className="font-semibold text-[#2F3AA2] underline">{sk ? "Prehľad študentov" : "Student overview"}</Link><Link href="/admin/lessons" className="font-semibold text-[#2F3AA2] underline">{sk ? "Dohodnuté hodiny" : "Scheduled lessons"}</Link></div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#E5E7F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                {new Intl.DateTimeFormat(localeFor(language), {
                  day: "numeric",
                  month: "long",
                  timeZone: "Europe/Bratislava",
                }).format(now)}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{sk ? "Dnešné hodiny" : "Today’s lessons"}</h2>
            </div>
            <BookOpen size={21} className="text-[#2F3AA2]" />
          </div>

          {lessonsError ? <p className="mt-5 text-sm text-red-700">{sk ? "Dnešné hodiny sa nepodarilo načítať. Obnovte stránku." : "Today’s lessons could not be loaded. Refresh the page."}</p> : todayLessons.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">{sk ? "Na dnes nie sú naplánované žiadne hodiny." : "No lessons are scheduled for today."}</p>
          ) : (
            <div className="mt-5 divide-y divide-gray-100">
              {todayLessons.map((lesson) => {
                const student = Array.isArray(lesson.student) ? lesson.student[0] : lesson.student;
                const teacher = Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher;
                return (
                  <div key={lesson.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{getName(student, sk ? "Študent" : "Student")}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatLanguage(lesson.language, language)} · {getName(teacher, sk ? "Lektor" : "Teacher")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatTime(lesson.scheduled_at, language)}</span>
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold capitalize text-[#3730A3]">
                        {formatLessonStatus(lesson.status, language)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
