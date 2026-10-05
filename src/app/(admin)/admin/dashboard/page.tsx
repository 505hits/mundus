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
import { formatLanguage, formatLessonStatus } from "@/lib/portalLabels";
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
      teacherPublicProfilesError
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
    <main className="min-h-screen bg-transparent text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
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

        {newPaidUnassigned.length > 0 && <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">{sk ? "Nový nákup" : "New purchase"}</p><h2 className="mt-1 text-xl font-semibold text-amber-950">{sk ? "Priraďte lektora" : "Assign a teacher"}</h2><p className="mt-2 text-sm text-amber-900/75">{sk ? "Títo študenti majú zaplatený balíček a zatiaľ nemajú vytvorenú žiadnu hodinu." : "These students have a paid package but no lesson has been created yet."}</p></div>
            <Link href="/admin/matching" className="rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">{sk ? "Zobraziť odporúčania" : "View recommendations"}</Link>
          </div>
          <ul className="mt-4 divide-y divide-amber-200">{newPaidUnassigned.map(student=><li key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-semibold text-amber-950">{getName(student,"Študent")}</p><p className="text-sm text-amber-900/70">{student.email}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">{sk ? "Čaká na priradenie" : "Waiting for assignment"}</span></li>)}</ul>
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
                <p className="font-medium">{paidOrdersError || lessonsError ? (sk ? "Nové nákupy sa nepodarilo overiť" : "New purchases could not be verified") : sk ? (newPaidUnassigned.length === 1 ? "1 nový platený študent čaká na lektora" : newPaidUnassigned.length + " nových platených študentov čaká na lektora") : `${newPaidUnassigned.length} paid student${newPaidUnassigned.length === 1 ? "" : "s"} waiting for a teacher`}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Po nákupe skontrolujte smart matching a vytvorte prvú hodinu." : "After purchase, check smart matching and create the first lesson."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{packagesError ? "Stav balíčkov sa nepodarilo načítať" : packageAlertLabel(lowPackages.length, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Odporúčame kontaktovať študenta ohľadom pokračovania." : "We recommend contacting the student about continuing."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{requestsError ? "Žiadosti sa nepodarilo načítať" : requestAlertLabel(pendingRequests, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Čaká sa na kontrolu alebo odpoveď lektora." : "Waiting for teacher review or response."}</p>
              </div>
              <div className="rounded-2xl bg-[#EEF2FF] p-4">
                <p className="font-medium">{studentsError || lessonsError ? "Ďalšie termíny sa nepodarilo overiť" : noUpcomingLabel(noUpcoming, language)}</p>
                <p className="mt-1 text-sm text-gray-500">{sk ? "Môže byť potrebné dohodnúť ďalší termín." : "A new lesson time may need to be arranged."}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{onboardingError ? "Onboarding študentov sa nepodarilo overiť" : studentsMissingOnboarding.length === 1 ? "1 aktívny študent nemá dokončený onboarding" : `${studentsMissingOnboarding.length} aktívnych študentov nemá dokončený onboarding`}</p>
                <p className="mt-1 text-sm text-gray-500">Bez onboardingu môžu chýbať údaje potrebné pre matching a správne nastavenie výučby.</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{teacherPreferencesError ? "Matching nastavenia lektorov sa nepodarilo overiť" : teachersMissingMatching.length === 1 ? "1 aktívny lektor nemá kompletné matching nastavenia" : `${teachersMissingMatching.length} aktívnych lektorov nemá kompletné matching nastavenia`}</p>
                <p className="mt-1 text-sm text-gray-500">Lektor potrebuje jazyky, úrovne, dni, časové okno a kapacitu.</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-medium">{teacherPublicProfilesError ? "Verejné profily lektorov sa nepodarilo overiť" : teachersMissingPublicProfile.length === 1 ? "1 aktívny lektor nemá kompletný verejný profil" : `${teachersMissingPublicProfile.length} aktívnych lektorov nemá kompletný verejný profil`}</p>
                <p className="mt-1 text-sm text-gray-500">Pred zverejnením je potrebná fotka, jazyky, titulok a predstavenie.</p>
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
              <p className="mt-2 text-sm text-gray-600">Naplánované a presunuté hodiny počas najbližších 7 dní. Je to orientačný prehľad pre priraďovanie nových študentov.</p>
            </div>
            <Link href="/admin/matching" className="font-semibold text-[#2F3AA2] underline">{sk ? "Otvoriť priradenie" : "Open matching"}</Link>
          </div>
          {teachersError || lessonsError ? (
            <p role="alert" className="mt-4 text-red-700">{sk ? "Vyťaženie lektorov" : "Teacher workload"} sa nepodarilo načítať.</p>
          ) : teacherWorkload.length === 0 ? (
            <p className="mt-4 text-gray-600">Zatiaľ nemáte aktívnych lektorov.</p>
          ) : (
            <ul className="mt-4 divide-y divide-indigo-100">
              {teacherWorkload.map((teacher) => (
                <li key={teacher.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-semibold">{getName(teacher, "Lektor")}</p>
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
          <p className="mt-2 text-sm text-gray-600">Kontrola posledných 50 dokončených hodín. Záznam pomáha študentovi vidieť spätnú väzbu a ďalšie zameranie; jeho uloženie nemení zostatok balíčka.</p>
          {missingReports === null ? <p role="alert" className="mt-4 text-red-700">Záznamy hodín sa nepodarilo overiť. Obnovte stránku.</p> : !missingReports.length ? <p className="mt-4 text-gray-600">Skontrolované dokončené hodiny majú uložený záznam alebo zatiaľ nemáte dokončené hodiny.</p> : <ul className="mt-4 divide-y divide-indigo-100">{missingReports.map(lesson=>{const student=Array.isArray(lesson.student)?lesson.student[0]:lesson.student;const teacher=Array.isArray(lesson.teacher)?lesson.teacher[0]:lesson.teacher;return <li key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{getName(student,"Študent")} · {formatLanguage(lesson.language, language)}</p><p className="mt-1 text-sm text-gray-600">{new Intl.DateTimeFormat(localeFor(language),{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Bratislava"}).format(new Date(lesson.scheduled_at))} · Lektor: {getName(teacher,"Nepriradený")}</p></div><span className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">Doplniť záznam</span></li>;})}</ul>}
          <Link href="/admin/lessons" className="mt-5 inline-block font-semibold text-[#2F3AA2] underline">{sk ? "Otvoriť prehľad hodín" : "Open lesson overview"}</Link>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Plán kontaktovania študentov" : "Student follow-up plan"}</h2>
          <p className="mt-2 text-sm text-gray-600">Otvorené záznamy podľa ďalšieho kontaktovania, aj po zakúpení nového balíčka. Dátumy sa posudzujú podľa Bratislavy. Uzavreté záznamy a neaktívne účty sa nezobrazujú.</p>
          {contactQueue === null ? <p role="alert" className="mt-4 text-red-700">Plán kontaktovania sa nepodarilo načítať. Overte pripravenie databázy alebo obnovte stránku.</p> : !contactQueue.length ? <p className="mt-4 text-gray-600">Zatiaľ žiadne otvorené záznamy. Pridajte záznam pri študentovi v zozname pokračovania nižšie.</p> : <ul className="mt-4 divide-y divide-indigo-100">{contactQueue.map(({student,record,due})=><li key={student.id} className="py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{getName(student,"Študent")}</p><p className="break-all text-sm text-gray-600">{student.email||"E-mail nie je uvedený"}</p></div><span className={`rounded-full px-3 py-2 text-sm font-semibold ${due ? "bg-amber-50 text-amber-900" : "bg-indigo-50 text-[#2F3AA2]"}`}>{!record.next_followup ? "Doplniť dátum" : due ? "Ozvať sa dnes / po termíne" : "Naplánované"}</span></div><p className="mt-2 text-sm text-gray-600">{({to_contact:"Ozvať sa",contacted:"Kontaktovaný",waiting:"Čaká sa na odpoveď",later:"Ozvať sa neskôr"} as Record<string,string>)[record.status]||record.status}</p><FollowupForm key={`${student.id}:${record.updated_at}`} studentId={student.id} record={record}/></li>)}</ul>}
          <p className="mt-4 text-sm text-gray-500">Ide o interný plán. Kontaktovanie vykonáte sami; žiadna správa sa automaticky neodosiela.</p>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3AA2]">{sk ? "Komu sa ozvať ohľadom pokračovania" : "Students to contact about continuing"}</h2>
          <p className="mt-2 text-sm text-gray-600">{sk ? "Aktívni študenti" : "Active students"} s celkovým zostatkom 0–2 hodiny. Nové účty bez zakúpeného balíčka sem nepatria. Pred kontaktovaním skontrolujte balíčky a dohodnuté termíny.</p>
          {renewalRows === null ? <p role="alert" className="mt-4 text-red-700">Zostatky sa nepodarilo overiť. Obnovte stránku.</p> : renewalRows.length === 0 ? <p className="mt-4 text-gray-600">Momentálne nikto nemá zostatok 0–2 hodiny na pokračovanie.</p> : <ul className="mt-5 divide-y divide-indigo-100">{renewalRows.map(student => <li key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{getName(student,"Študent")}</p><p className="break-all text-sm text-gray-600">{student.email || "E-mail nie je uvedený"}</p></div><span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-[#2F3AA2]">{student.remaining === 0 ? "Balíček vyčerpaný" : student.remaining === 1 ? "Posledná hodina" : "Posledné 2 hodiny"}</span>{!followupError && <FollowupForm key={`${student.id}:${followupRows.find(row=>row.student_id===student.id)?.updated_at||"new"}`} studentId={student.id} record={followupRows.find(row=>row.student_id===student.id)}/>}</li>)}</ul>}
          {followupError && <p role="alert" className="mt-4 text-sm text-red-700">Záznamy kontaktovania nie sú dostupné. Najprv treba pripraviť databázu alebo obnoviť stránku.</p>}
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

          {lessonsError ? <p className="mt-5 text-sm text-red-700">{sk ? "Dnešné hodiny" : "Today’s lessons"} sa nepodarilo načítať. Obnovte stránku.</p> : todayLessons.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">{sk ? "Na dnes nie sú naplánované žiadne hodiny." : "No lessons are scheduled for today."}</p>
          ) : (
            <div className="mt-5 divide-y divide-gray-100">
              {todayLessons.map((lesson) => {
                const student = Array.isArray(lesson.student) ? lesson.student[0] : lesson.student;
                const teacher = Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher;
                return (
                  <div key={lesson.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{getName(student, "Študent")}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatLanguage(lesson.language, language)} · {getName(teacher, "Lektor")}
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
