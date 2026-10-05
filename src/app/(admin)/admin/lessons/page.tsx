import { safeLessonLink } from "@/lib/lesson-link";
import ScheduleNotificationStatus from "@/components/ScheduleNotificationStatus";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatLessonStatus } from "@/lib/portalLabels";
import AdminCreateLessonForm from "./AdminCreateLessonForm";
import AdminLessonActions from "./AdminLessonActions";
import { currentLanguage, localeFor } from "@/lib/i18n";
import type { Language } from "@/context/LanguageContext";

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function formatTime(value: string, language: Language) {
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

function name(profile: { full_name?: string | null; email?: string | null } | null | undefined) {
  return profile?.full_name?.trim() || profile?.email || "Neznáme";
}

export default async function AdminLessonsPage() {
  const language=await currentLanguage();
  const sk=language==="sk";
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [
    { data: lessons, error },
    { data: students, error: studentsError },
    { data: teachers, error: teachersError },
    { data: packages, error: packagesError },
  ] = await Promise.all([
    supabase
      .from("lessons")
      .select(`
        id,student_id,package_id,scheduled_at,duration_minutes,status,attendance_status,language,meet_link,
        student:profiles!lessons_student_id_fkey(full_name,email),
        teacher:profiles!lessons_teacher_id_fkey(full_name,email)
      `)
      .order("scheduled_at", { ascending: false })
      .limit(100),
    supabase
      .from("profiles")
      .select("id,full_name,email")
      .eq("role", "student")
      .eq("status", "active")
      .order("full_name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id,full_name,email")
      .eq("role", "teacher")
      .eq("status", "active")
      .order("full_name", { ascending: true }),
    supabase
      .from("lesson_packages")
      .select("id,student_id,total_lessons,remaining_lessons")
      .eq("status", "active"),
  ]);

  const rows = lessons ?? [];
  const now = new Date();
  const bratislavaDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const todayKey = bratislavaDay.format(now);
  const today = rows.filter((lesson) => bratislavaDay.format(new Date(lesson.scheduled_at)) === todayKey);
  const completed = rows.filter((lesson) => lesson.status === "completed");
  const attention = rows.filter((lesson) =>
    ["student_no_show", "teacher_cancelled", "student_cancelled", "late_cancellation"].includes(lesson.status)
  );

  return (
    <main className="min-h-screen bg-transparent text-[#0a0a0f]">
      <ScheduleNotificationStatus />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Hodiny":"Lessons"}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Správa hodín":"Lesson management"}</h1>
          <p className="mt-2 text-gray-500">{sk?"Reálny prehľad hodín študentov a lektorov Mundus.":"Real overview of Mundus student and teacher lessons."}</p>
        </section>

        {(error || studentsError || teachersError || packagesError) && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk?"Nepodarilo sa načítať údaje o hodinách. Obnovte stránku a skúste to znova.":"Lesson data could not be loaded. Refresh the page and try again."}
          </div>
        )}

        <AdminCreateLessonForm
          students={students ?? []}
          teachers={teachers ?? []}
          packages={packages ?? []}
        />

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{today.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Dnes":"Today"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{completed.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Dokončené v načítanej histórii":"Completed in loaded history"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{attention.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Zrušené / nedostavenie sa":"Cancelled / no-show"}</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">{sk?"Zatiaľ neboli zaznamenané žiadne hodiny.":"No lessons have been recorded yet."}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((lesson) => {
                const student = Array.isArray(lesson.student) ? lesson.student[0] : lesson.student;
                const teacher = Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher;
                return (
                  <div key={lesson.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1fr_0.9fr_0.7fr_0.9fr_0.9fr_0.5fr_0.7fr] lg:items-center lg:px-6">
                    <div>
                      <p className="font-semibold">{name(student)}</p>
                      <p className="mt-1 text-sm text-gray-400">{formatLanguage(lesson.language,language)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Lektor":"Teacher"}</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{name(teacher)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Dátum":"Date"}</p>
                      <p className="mt-1 text-sm lg:mt-0">{formatDate(lesson.scheduled_at,language)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock3 size={15} className="text-gray-400" />
                      {formatTime(lesson.scheduled_at,language)}
                    </div>
                    <div>
                      <span className="inline-flex rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold capitalize text-[#3730A3]">
                        {formatLessonStatus(lesson.status,language)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Dochádzka":"Attendance"}</p>
                      <p className="mt-1 text-xs font-medium lg:mt-0">{lesson.attendance_status==="attended"?(sk?"Účasť":"Attended"):lesson.attendance_status==="student_no_show"?"No-show":lesson.attendance_status==="late_cancellation"?(sk?"Neskoré zrušenie":"Late cancellation"):lesson.attendance_status==="student_cancelled"?(sk?"Zrušené študentom":"Cancelled by student"):lesson.attendance_status==="teacher_cancelled"?(sk?"Zrušené lektorom":"Cancelled by teacher"):"—"}</p>
                    </div>
                    <div>
                      {safeLessonLink(lesson.meet_link) && (
                        <a href={safeLessonLink(lesson.meet_link) ?? undefined} target="_blank" rel="noreferrer" aria-label={sk?"Otvoriť online hodinu":"Open online lesson"} className="inline-flex rounded-xl p-2 text-[#0a0a0f] hover:bg-[#EEF2FF]">
                          <Video size={17} />
                        </a>
                      )}
                    </div>
                    <div>
                      <AdminLessonActions
                        lessonId={lesson.id}
                        studentId={lesson.student_id}
                        packageId={lesson.package_id}
                        scheduledAt={lesson.scheduled_at}
                        meetLink={lesson.meet_link}
                        currentStatus={lesson.status}
                      />
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
