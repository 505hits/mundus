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

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function getName(profile: { full_name?: string | null; email?: string | null } | null | undefined, fallback: string) {
  return profile?.full_name?.trim() || profile?.email || fallback;
}

export default async function AdminDashboardPage() {
  const { profile } = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [
    { data: students },
    { data: teachers },
    { data: lessons, error: lessonsError },
    { data: packages },
    { data: requests },
  ] = await Promise.all([
    supabase.from("profiles").select("id").eq("role", "student").eq("status", "active"),
    supabase.from("profiles").select("id").eq("role", "teacher").eq("status", "active"),
    supabase
      .from("lessons")
      .select(`
        id,student_id,scheduled_at,status,language,
        student:profiles!lessons_student_id_fkey(full_name,email),
        teacher:profiles!lessons_teacher_id_fkey(full_name,email)
      `)
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("lesson_packages")
      .select("student_id,remaining_lessons,status")
      .eq("status", "active"),
    supabase
      .from("schedule_change_requests")
      .select("id,status")
      .eq("status", "pending"),
  ]);

  const now = new Date();
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayKey = dateKey.format(now);

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

  const lowPackages = (packages ?? []).filter(
    (pkg) => (pkg.remaining_lessons ?? 0) > 0 && (pkg.remaining_lessons ?? 0) <= 2
  );
  const noUpcoming = (students ?? []).filter(
    (student) => !upcomingStudentIds.has(student.id)
  ).length;
  const pendingRequests = requests?.length ?? 0;

  const firstName =
    profile?.full_name?.trim()?.split(/\s+/)[0] || "Admin";

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Mundus administrácia
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Vitajte, {firstName}
          </h1>
          <p className="mt-2 text-gray-500">
            Aktuálny prehľad študentov, lektorov a dnešných hodín.
          </p>
        </section>

        {lessonsError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Niektoré údaje sa nepodarilo načítať. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{students?.length ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívni študenti</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{teachers?.length ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívni lektori</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{todayLessons.length}</p>
            <p className="mt-1 text-sm text-gray-500">Dnešné hodiny</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{pendingRequests}</p>
            <p className="mt-1 text-sm text-gray-500">Čakajúce žiadosti o zmenu termínu</p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Priority</p>
                <h2 className="mt-1 text-xl font-semibold">Vyžaduje pozornosť</h2>
              </div>
              <AlertCircle size={21} className="text-[#9a8049]" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[#faf8f2] p-4">
                <p className="font-medium">{lowPackages.length} {lowPackages.length === 1 ? "balíček s 1–2 zostávajúcimi hodinami" : "balíčky s 1–2 zostávajúcimi hodinami"}</p>
                <p className="mt-1 text-sm text-gray-500">Odporúčame kontaktovať študenta ohľadom pokračovania.</p>
              </div>
              <div className="rounded-2xl bg-[#faf8f2] p-4">
                <p className="font-medium">{pendingRequests} {pendingRequests === 1 ? "čakajúca žiadosť o zmenu termínu" : "čakajúcich žiadostí o zmenu termínu"}</p>
                <p className="mt-1 text-sm text-gray-500">Čaká sa na kontrolu alebo odpoveď lektora.</p>
              </div>
              <div className="rounded-2xl bg-[#faf8f2] p-4">
                <p className="font-medium">{noUpcoming} {noUpcoming === 1 ? "aktívny študent bez naplánovanej ďalšej hodiny" : "aktívnych študentov bez naplánovanej ďalšej hodiny"}</p>
                <p className="mt-1 text-sm text-gray-500">Môže byť potrebné dohodnúť ďalší termín.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-[#183f38] p-6 text-white shadow-sm">
            <Package size={21} className="text-[#d7b56d]" />
            <p className="mt-5 text-sm text-white/50">Balíčky</p>
            <h2 className="mt-1 text-xl font-semibold">Prehľad pokračovania</h2>
            <p className="mt-7 text-4xl font-semibold">{lowPackages.length}</p>
            <p className="mt-2 text-sm text-white/65">Aktívne balíčky s poslednými 1–2 hodinami</p>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                {new Intl.DateTimeFormat("sk-SK", {
                  day: "numeric",
                  month: "long",
                  timeZone: "Europe/Bratislava",
                }).format(now)}
              </p>
              <h2 className="mt-1 text-xl font-semibold">Dnešné hodiny</h2>
            </div>
            <BookOpen size={21} className="text-[#9a8049]" />
          </div>

          {todayLessons.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">Na dnes nie sú naplánované žiadne hodiny.</p>
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
                        {formatLanguage(lesson.language)} · {getName(teacher, "Lektor")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatTime(lesson.scheduled_at)}</span>
                      <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold capitalize text-[#527064]">
                        {formatLessonStatus(lesson.status)}
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
