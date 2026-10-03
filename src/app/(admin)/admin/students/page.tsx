import { AlertCircle, BookOpen, Users } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatProfileStatus } from "@/lib/portalLabels";
import StudentStatusAction from "./StudentStatusAction";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function AdminStudentsPage({searchParams}:{searchParams:Promise<{q?:string;status?:string}>}) {
  const filters=await searchParams;
  const search=(typeof filters.q === "string" ? filters.q : "").trim().slice(0,100);
  const statusFilter=["active","inactive","pending"].includes(filters.status||"") ? filters.status : "";
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [{ data: profiles, error: profilesError }, { data: lessons, error: lessonsError }, { data: packages, error: packagesError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id,full_name,email,status")
        .eq("role", "student")
        .order("full_name", { ascending: true }),
      supabase
        .from("lessons")
        .select("student_id,teacher_id,scheduled_at,status,language,teacher:profiles!lessons_teacher_id_fkey(full_name,email)")
        .in("status", ["scheduled", "rescheduled", "completed"])
        .order("scheduled_at", { ascending: true }),
      supabase
        .from("lesson_packages")
        .select("student_id,remaining_lessons,status")
        .eq("status", "active"),
    ]);

  const packageRemaining = new Map<string, number>();
  for (const pkg of packages ?? []) {
    packageRemaining.set(
      pkg.student_id,
      (packageRemaining.get(pkg.student_id) ?? 0) + (pkg.remaining_lessons ?? 0)
    );
  }

  const now = new Date().getTime();
  const studentRows = (profiles ?? []).map((profile) => {
    const studentLessons = (lessons ?? []).filter((lesson) => lesson.student_id === profile.id);
    const nextLesson = studentLessons.find(
      (lesson) =>
        ["scheduled", "rescheduled"].includes(lesson.status) &&
        new Date(lesson.scheduled_at).getTime() >= now
    );
    const latestWithLanguage = [...studentLessons].reverse().find((lesson) => lesson.language);
    const teacherRelation = nextLesson?.teacher;
    const teacher = Array.isArray(teacherRelation) ? teacherRelation[0] : teacherRelation;
    const remaining = packageRemaining.get(profile.id) ?? 0;

    return {
      ...profile,
      language: nextLesson?.language || latestWithLanguage?.language ? formatLanguage(nextLesson?.language || latestWithLanguage?.language) : "—",
      teacher: lessonsError ? "Nedostupné" : teacher?.full_name?.trim() || teacher?.email || (nextLesson ? "Lektor nie je uvedený" : "Bez nasledujúcej hodiny"),
      remaining,
      nextLesson: nextLesson?.scheduled_at ?? null,
    };
  });

  const activeStudents = studentRows.filter((student) => student.status === "active").length;
  const renewalSoon = studentRows.filter(
    (student) => student.status === "active" && student.remaining > 0 && student.remaining <= 2
  ).length;
  const needsAttention = studentRows.filter(
    (student) => student.status === "active" && (!student.nextLesson || student.remaining <= 2)
  ).length;

  const visibleStudents=studentRows.filter(student=>(!statusFilter||student.status===statusFilter)&&(!search||`${student.full_name||""} ${student.email||""}`.toLocaleLowerCase("sk").includes(search.toLocaleLowerCase("sk"))));

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Študenti</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Správa študentov</h1>
          <p className="mt-2 text-gray-500">Reálne účty študentov, balíčky a najbližšie hodiny.</p>
        </section>

        {(profilesError || lessonsError || packagesError) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Niektoré účty, hodiny alebo zostatky sa nepodarilo načítať. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{profilesError ? "—" : activeStudents}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívni študenti</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{profilesError || packagesError ? "—" : renewalSoon}</p>
            <p className="mt-1 text-sm text-gray-500">Blíži sa pokračovanie</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{profilesError || lessonsError || packagesError ? "—" : needsAttention}</p>
            <p className="mt-1 text-sm text-gray-500">Vyžaduje pozornosť</p>
          </div>
        </section>

        <form action="/admin/students" method="get" className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-indigo-100 bg-white p-5">
          <label className="flex-1 text-sm font-semibold">Meno alebo e-mail<input name="q" type="search" defaultValue={search} maxLength={100} className="mt-2 block w-full min-w-48 rounded-xl border border-gray-200 p-3"/></label>
          <label className="text-sm font-semibold">Stav účtu<select name="status" defaultValue={statusFilter} className="mt-2 block rounded-xl border border-gray-200 p-3"><option value="">Všetky účty</option><option value="active">Aktívne</option><option value="inactive">Neaktívne</option><option value="pending">Čakajúce</option></select></label>
          <button className="rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">Vyhľadať</button><a href="/admin/students" className="px-3 py-3 font-semibold text-[#2F3AA2] underline">Zrušiť filtre</a>
          <p className="w-full text-sm text-gray-500">Prehľadové počty vyššie zahŕňajú všetkých načítaných študentov; filtre menia zoznam nižšie.</p>
        </form>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {visibleStudents.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">{profilesError ? "Účty sa nepodarilo načítať. Obnovte stránku." : search || statusFilter ? "Žiadny študent nezodpovedá zvolenému vyhľadávaniu." : "Zatiaľ nie sú vytvorené žiadne účty študentov."}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleStudents.map((student) => (
                <div key={student.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.7fr_1.2fr_0.8fr_0.9fr] lg:items-center lg:px-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{student.full_name?.trim() || student.email || "Študent"}</p>
                      {!packagesError && student.status === "active" && student.remaining > 0 && student.remaining <= 2 && (
                        <span className="rounded-full bg-[#faf1d9] px-2.5 py-1 text-xs font-semibold text-[#2F3AA2]">
                          Blíži sa pokračovanie
                        </span>
                      )}
                    </div>
                    <p className="mt-1 break-all text-sm text-gray-500">{student.email}</p>
                    <p className="mt-1 text-sm text-gray-400">{lessonsError ? "Jazyk sa nepodarilo načítať" : student.language}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lektor</p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">{student.teacher}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Zostáva hodín</p>
                    <p className="mt-1 text-sm font-semibold lg:mt-0">{packagesError ? "—" : student.remaining}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Najbližšia hodina</p>
                    <p className="mt-1 text-sm text-gray-500 lg:mt-0">
                      {lessonsError ? "Nedostupné" : student.nextLesson ? formatDateTime(student.nextLesson) : "Nenaplánované"}
                    </p>
                  </div>
                  <div>
                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold capitalize text-[#3730A3]">
                      {formatProfileStatus(student.status)}
                    </span>
                  </div>
                  <div>
                    <StudentStatusAction
                      studentId={student.id}
                      status={student.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
