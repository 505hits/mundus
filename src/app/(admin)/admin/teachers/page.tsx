import {
  AlertCircle,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatTeacherStatus(status: string | null) {
  if (status === "active") return "Aktívny";
  if (status === "pending") return "Čaká na schválenie";
  if (status === "inactive") return "Neaktívny";
  return status ? status.replaceAll("_", " ") : "Neznámy";
}

export default async function AdminTeachersPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [{ data: teachers, error }, { data: lessons }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,status")
      .eq("role", "teacher")
      .order("full_name", { ascending: true }),
    supabase
      .from("lessons")
      .select("teacher_id,student_id,scheduled_at,status,language")
      .in("status", ["scheduled", "rescheduled", "completed"]),
  ]);

  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() + mondayOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const teacherRows = (teachers ?? []).map((teacher) => {
    const teacherLessons = (lessons ?? []).filter(
      (lesson) => lesson.teacher_id === teacher.id
    );
    const studentCount = new Set(
      teacherLessons.map((lesson) => lesson.student_id)
    ).size;
    const lessonsThisWeek = teacherLessons.filter((lesson) => {
      const time = new Date(lesson.scheduled_at).getTime();
      return time >= weekStart.getTime() && time < weekEnd.getTime();
    }).length;
    const languages = Array.from(
      new Set(
        teacherLessons
          .map((lesson) => lesson.language)
          .filter((language): language is string => Boolean(language))
      )
    );

    return {
      ...teacher,
      studentCount,
      lessonsThisWeek,
      languages: languages.length ? languages.join(", ") : "—",
    };
  });

  const activeTeachers = teacherRows.filter(
    (teacher) => teacher.status === "active"
  ).length;
  const pendingTeachers = teacherRows.filter(
    (teacher) => teacher.status !== "active"
  ).length;
  const assignedStudents = new Set(
    (lessons ?? []).map((lesson) => lesson.student_id)
  ).size;
  const lessonsThisWeek = teacherRows.reduce(
    (sum, teacher) => sum + teacher.lessonsThisWeek,
    0
  );

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">Lektori</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Správa lektorov
          </h1>
          <p className="mt-2 text-gray-500">
            Reálne účty lektorov a aktuálna výučba.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Nepodarilo sa načítať účty lektorov. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{activeTeachers}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívni lektori</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{assignedStudents}</p>
            <p className="mt-1 text-sm text-gray-500">Priradení študenti</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{lessonsThisWeek}</p>
            <p className="mt-1 text-sm text-gray-500">Hodiny tento týždeň</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{pendingTeachers}</p>
            <p className="mt-1 text-sm text-gray-500">Čakajúci / neaktívni</p>
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm text-gray-400">Tím</p>
          <h2 className="mt-1 text-xl font-semibold">Účty lektorov</h2>

          {teacherRows.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Zatiaľ nie sú vytvorené žiadne účty lektorov.
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="divide-y divide-gray-100">
                {teacherRows.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.8fr_0.9fr_0.8fr] lg:items-center lg:px-6"
                  >
                    <div>
                      <p className="font-semibold">
                        {teacher.full_name?.trim() || teacher.email || "Lektor"}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {teacher.languages}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Email</p>
                      <p className="mt-1 truncate text-sm lg:mt-0">
                        {teacher.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Študenti</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {teacher.studentCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Tento týždeň</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {teacher.lessonsThisWeek} hodín
                      </p>
                    </div>
                    <div>
                      <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold capitalize text-[#527064]">
                        {formatTeacherStatus(teacher.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
