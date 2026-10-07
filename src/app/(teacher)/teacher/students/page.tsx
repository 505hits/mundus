import { teacherDirectory } from "@/lib/teacher-directory";
import {
  BookOpen,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage } from "@/lib/portalLabels";
import StudentSearchList from "./StudentSearchList";
import { currentLanguage } from "@/lib/i18n";

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined,
  sk: boolean
) {
  return profile?.full_name?.trim() || profile?.email || (sk ? "Študent" : "Student");
}

export default async function TeacherStudentsPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();
  const studentDirectory = await teacherDirectory(supabase);

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      status,
      language,
      student:profiles!lessons_student_id_fkey (
        full_name
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled", "completed"])
    .order("scheduled_at", { ascending: false });

  const studentIds = Array.from(
    new Set((lessons ?? []).map((lesson) => lesson.student_id))
  );

  const { data: packages, error: packagesError } = studentIds.length
    ? await supabase
        .from("lesson_packages")
        .select(
          "student_id,total_lessons,used_lessons,remaining_lessons,status"
        )
        .in("student_id", studentIds)
        .eq("status", "active")
    : { data: [], error: null };

  if (lessonsError || packagesError) {
    return <main className="mx-auto max-w-5xl px-5 py-10"><h1 className="text-3xl font-semibold">{sk ? "Moji študenti" : "My students"}</h1><p role="alert" className="mt-5 text-red-700">{sk ? "Študentov alebo zostatky sa nepodarilo načítať. Obnovte stránku alebo to skúste o chvíľu znova." : "Students or lesson balances could not be loaded. Refresh the page or try again shortly."}</p></main>;
  }

  const packageMap = new Map<
    string,
    {
      remaining: number;
      total: number;
    }
  >();

  for (const pkg of packages ?? []) {
    const existing = packageMap.get(pkg.student_id);

    packageMap.set(pkg.student_id, {
      remaining:
        (existing?.remaining ?? 0) +
        (pkg.remaining_lessons ?? 0),
      total:
        (existing?.total ?? 0) +
        (pkg.total_lessons ?? 0),
    });
  }

  const studentMap = new Map<
    string,
    {
      id: string;
      name: string;
      language: string;
      nextLesson: string | null;
      remaining: number;
      completed: number;
    }
  >();

  for (const lesson of lessons ?? []) {
    const existing = studentMap.get(lesson.student_id);

    const student = studentDirectory.get(lesson.student_id);

    const isFuture =
      ["scheduled", "rescheduled"].includes(lesson.status) &&
      new Date(lesson.scheduled_at).getTime() >= new Date().getTime();

    if (!existing) {
      studentMap.set(lesson.student_id, {
        id: lesson.student_id,
        name: getName(student, sk),
        language: formatLanguage(lesson.language, language),
        nextLesson: isFuture ? lesson.scheduled_at : null,
        remaining:
          packageMap.get(lesson.student_id)?.remaining ?? 0,
        completed: lesson.status === "completed" ? 1 : 0,
      });

      continue;
    }

    if (lesson.status === "completed") {
      existing.completed += 1;
    }

    if (
      isFuture &&
      (!existing.nextLesson ||
        new Date(lesson.scheduled_at).getTime() <
          new Date(existing.nextLesson).getTime())
    ) {
      existing.nextLesson = lesson.scheduled_at;
    }
  }

  const students = Array.from(studentMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const totalRemaining = students.reduce(
    (sum, student) => sum + student.remaining,
    0
  );

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk ? "Študenti" : "Students"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk ? "Moji študenti" : "My students"}
          </h1>

          <p className="mt-2 text-gray-500">
            {sk ? "Pozrite si svojich študentov a ich aktivitu vo výučbe." : "See your students and their learning activity."}
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#2F3AA2]" />

            <p className="mt-4 text-3xl font-semibold">
              {students.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Študenti s hodinami" : "Students with lessons"}
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#2F3AA2]" />

            <p className="mt-4 text-3xl font-semibold">
              {totalRemaining}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {sk ? "Zostávajúce hodiny" : "Remaining lessons"}
            </p>
          </div>
        </section>

        <StudentSearchList students={students} />
      </div>
    </main>
  );
}
