import {
  BookOpen,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage } from "@/lib/portalLabels";
import StudentSearchList from "./StudentSearchList";

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return profile?.full_name?.trim() || profile?.email || "Študent";
}

export default async function TeacherStudentsPage() {
  const { user } = await requireRole("teacher");
  const supabase = await createSupabaseServerClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      scheduled_at,
      status,
      language,
      student:profiles!lessons_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq("teacher_id", user.id)
    .in("status", ["scheduled", "rescheduled", "completed"])
    .order("scheduled_at", { ascending: false });

  const studentIds = Array.from(
    new Set((lessons ?? []).map((lesson) => lesson.student_id))
  );

  const { data: packages } = studentIds.length
    ? await supabase
        .from("lesson_packages")
        .select(
          "student_id,total_lessons,used_lessons,remaining_lessons,status"
        )
        .in("student_id", studentIds)
        .eq("status", "active")
    : { data: [] };

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

    const student = Array.isArray(lesson.student)
      ? lesson.student[0]
      : lesson.student;

    const isFuture =
      ["scheduled", "rescheduled"].includes(lesson.status) &&
      new Date(lesson.scheduled_at).getTime() >= new Date().getTime();

    if (!existing) {
      studentMap.set(lesson.student_id, {
        id: lesson.student_id,
        name: getName(student),
        language: formatLanguage(lesson.language),
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
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
            Študenti
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Moji študenti
          </h1>

          <p className="mt-2 text-gray-500">
            Pozrite si svojich študentov a ich aktivitu vo výučbe.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {students.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Študenti s hodinami
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {totalRemaining}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Zostávajúce hodiny
            </p>
          </div>
        </section>

        <StudentSearchList students={students} />
      </div>
    </main>
  );
}
