import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Search,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function getName(
  profile:
    | { full_name?: string | null; email?: string | null }
    | null
    | undefined
) {
  return profile?.full_name?.trim() || profile?.email || "Student";
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
      new Date(lesson.scheduled_at).getTime() >= Date.now();

    if (!existing) {
      studentMap.set(lesson.student_id, {
        id: lesson.student_id,
        name: getName(student),
        language: lesson.language || "Language",
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
            Students
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            My students
          </h1>

          <p className="mt-2 text-gray-500">
            See your assigned students and their learning activity.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {students.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Students with lessons
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={20} className="text-[#9a8049]" />

            <p className="mt-4 text-3xl font-semibold">
              {totalRemaining}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Lessons remaining
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <div className="w-full rounded-2xl border border-black/5 bg-white py-3 pl-11 pr-4 text-sm text-gray-400">
              Student search coming soon
            </div>
          </div>

          {students.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                No students assigned yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Students will appear here once they have lessons with you.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {students.map((student) => (
                <article
                  key={student.id}
                  className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef3ef] font-semibold text-[#183f38]">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">
                            {student.name}
                          </h2>

                          <span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#527064]">
                            Active
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {student.language}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:flex md:items-center md:gap-8">
                      <div>
                        <p className="text-xs text-gray-400">
                          Lessons left
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {student.remaining}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Next lesson
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {student.nextLesson
                            ? `${formatDate(
                                student.nextLesson
                              )} · ${formatTime(
                                student.nextLesson
                              )}`
                            : "Not scheduled"}
                        </p>
                      </div>

                      <Link
                        href={`/teacher/student/${student.id}`}
                        className="flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        View student
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
