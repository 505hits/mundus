import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
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

export default async function TeacherStudentPage({
  params,
}: Props) {
  const { user } = await requireRole("teacher");
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select(`
      id,
      student_id,
      teacher_id,
      scheduled_at,
      duration_minutes,
      status,
      language,
      lesson_type,
      meet_link,
      student:profiles!lessons_student_id_fkey (
        full_name,
        email
      )
    `)
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  /*
   * The query above is only used to verify that the route belongs
   * to a lesson/student assigned to this teacher.
   *
   * We then use the student_id for the complete student view.
   */
  const studentId = lessons?.student_id;

  if (!studentId) {
    const { data: studentLesson } = await supabase
      .from("lessons")
      .select("student_id")
      .eq("student_id", id)
      .eq("teacher_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!studentLesson?.student_id) {
      notFound();
    }

    return renderStudentPage(
      supabase,
      user.id,
      studentLesson.student_id
    );
  }

  return renderStudentPage(supabase, user.id, studentId);
}

async function renderStudentPage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  teacherId: string,
  studentId: string
) {
  const [
    profileResult,
    lessonsResult,
    packagesResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", studentId)
      .single(),

    supabase
      .from("lessons")
      .select(`
        id,
        scheduled_at,
        duration_minutes,
        status,
        language,
        lesson_type,
        meet_link
      `)
      .eq("teacher_id", teacherId)
      .eq("student_id", studentId)
      .order("scheduled_at", { ascending: false }),

    supabase
      .from("lesson_packages")
      .select(
        "id,total_lessons,used_lessons,remaining_lessons,status"
      )
      .eq("student_id", studentId)
      .eq("status", "active"),
  ]);

  const profile = profileResult.data;
  const lessons = lessonsResult.data ?? [];
  const packages = packagesResult.data ?? [];

  if (!profile) {
    notFound();
  }

  const studentName = getName(profile);

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const upcomingLessons = lessons
    .filter(
      (lesson) =>
        ["scheduled", "rescheduled"].includes(lesson.status) &&
        new Date(lesson.scheduled_at).getTime() >= Date.now()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() -
        new Date(b.scheduled_at).getTime()
    );

  const nextLesson = upcomingLessons[0] ?? null;

  const lessonsRemaining = packages.reduce(
    (sum, pkg) => sum + (pkg.remaining_lessons ?? 0),
    0
  );

  const language =
    nextLesson?.language ||
    lessons[0]?.language ||
    "Language";

  const lessonType =
    nextLesson?.lesson_type ||
    lessons[0]?.lesson_type ||
    "Individual lesson";

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/teacher/students"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={17} />
            My students
          </Link>

          <p className="text-sm font-semibold">
            Student overview
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">
              My student
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {studentName}
            </h1>

            <p className="mt-2 text-gray-500">
              {language} · {lessonType}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#eaf4ed] px-3 py-1.5 text-xs font-semibold text-[#527064]">
            Active student
          </span>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <BookOpen size={19} className="text-[#9a8049]" />

            <p className="mt-4 text-sm text-gray-400">
              Lessons completed
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {completedLessons.length}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={19} className="text-[#9a8049]" />

            <p className="mt-4 text-sm text-gray-400">
              Lessons remaining
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {lessonsRemaining}
            </p>
          </article>

          <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <TrendingUp size={19} className="text-[#9a8049]" />

            <p className="mt-4 text-sm text-gray-400">
              Learning activity
            </p>

            <p className="mt-1 text-sm font-semibold">
              {completedLessons.length > 0
                ? "Lessons in progress"
                : "Getting started"}
            </p>
          </article>
        </div>

        {nextLesson && (
          <section className="mt-6 rounded-3xl bg-[#183f38] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/55">
                  Next lesson
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {nextLesson.language || language} ·{" "}
                  {nextLesson.lesson_type || "Lesson"}
                </h2>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/65">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {formatDate(nextLesson.scheduled_at)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {formatTime(nextLesson.scheduled_at)}
                  </span>
                </div>
              </div>

              {nextLesson.meet_link ? (
                <a
                  href={nextLesson.meet_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#183f38]"
                >
                  <Video size={18} />
                  Join lesson
                </a>
              ) : (
                <span className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white/60">
                  Meet link not added
                </span>
              )}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div>
            <p className="text-sm text-gray-400">
              History
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Recent lessons
            </h2>
          </div>

          {completedLessons.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="font-medium">
                No completed lessons yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Completed lessons will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              {completedLessons.slice(0, 10).map(
                (lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between gap-4 p-5 sm:p-6 ${
                      index !==
                      Math.min(completedLessons.length, 10) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {lesson.lesson_type ||
                          lesson.language ||
                          "Lesson"}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {formatShortDate(
                          lesson.scheduled_at
                        )}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-semibold text-[#527064]">
                      Completed
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <MessageCircle
              size={20}
              className="text-[#9a8049]"
            />

            <h2 className="text-lg font-semibold">
              Student notes
            </h2>
          </div>

          <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-5">
            <p className="text-sm leading-6 text-gray-500">
              Student notes will appear here once the teacher
              note system is connected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
