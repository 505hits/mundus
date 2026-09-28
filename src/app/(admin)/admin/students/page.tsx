import { AlertCircle, BookOpen, Users } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage } from "@/lib/portalLabels";

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

export default async function AdminStudentsPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [{ data: profiles, error: profilesError }, { data: lessons }, { data: packages }] =
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

  const now = Date.now();
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
      teacher: teacher?.full_name?.trim() || teacher?.email || "Not assigned",
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

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">Študenti</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Správa študentov</h1>
          <p className="mt-2 text-gray-500">Real student accounts, packages and upcoming lessons.</p>
        </section>

        {profilesError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Nepodarilo sa načítať účty študentov. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{activeStudents}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívni študenti</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{renewalSoon}</p>
            <p className="mt-1 text-sm text-gray-500">Renewal approaching</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{needsAttention}</p>
            <p className="mt-1 text-sm text-gray-500">Need attention</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {studentRows.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">Zatiaľ nie sú vytvorené žiadne účty študentov.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {studentRows.map((student) => (
                <div key={student.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.7fr_1.2fr_0.8fr] lg:items-center lg:px-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{student.full_name?.trim() || student.email || "Student"}</p>
                      {student.status === "active" && student.remaining > 0 && student.remaining <= 2 && (
                        <span className="rounded-full bg-[#faf1d9] px-2.5 py-1 text-xs font-semibold text-[#9a8049]">
                          Blíži sa pokračovanie
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{student.language}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">Lektor</p>
                    <p className="mt-1 text-sm font-medium lg:mt-0">{student.teacher}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">Zostáva hodín</p>
                    <p className="mt-1 text-sm font-semibold lg:mt-0">{student.remaining}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 lg:hidden">Najbližšia hodina</p>
                    <p className="mt-1 text-sm text-gray-500 lg:mt-0">
                      {student.nextLesson ? formatDateTime(student.nextLesson) : "Nenaplánované"}
                    </p>
                  </div>
                  <div>
                    <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold capitalize text-[#527064]">
                      {student.status || "active"}
                    </span>
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
