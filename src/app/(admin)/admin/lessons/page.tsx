import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Video,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    scheduled: "Naplánovaná",
    rescheduled: "Presunutá",
    completed: "Dokončená",
    student_no_show: "Neúčasť študenta",
    teacher_cancelled: "Zrušená lektorom",
    student_cancelled: "Zrušená študentom",
    late_cancellation: "Neskoré zrušenie",
  };
  return labels[status] || status.replaceAll("_", " ");
}

function name(profile: { full_name?: string | null; email?: string | null } | null | undefined) {
  return profile?.full_name?.trim() || profile?.email || "Neznáme";
}

export default async function AdminLessonsPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(`
      id,scheduled_at,duration_minutes,status,language,meet_link,
      student:profiles!lessons_student_id_fkey(full_name,email),
      teacher:profiles!lessons_teacher_id_fkey(full_name,email)
    `)
    .order("scheduled_at", { ascending: false })
    .limit(100);

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
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">Hodiny</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Správa hodín</h1>
          <p className="mt-2 text-gray-500">Prehľad všetkých hodín študentov a lektorov v Mundus.</p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Nepodarilo sa načítať údaje o hodinách. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{today.length}</p>
            <p className="mt-1 text-sm text-gray-500">Dnes</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{completed.length}</p>
            <p className="mt-1 text-sm text-gray-500">Dokončené v histórii</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{attention.length}</p>
            <p className="mt-1 text-sm text-gray-500">Zrušené / neúčasť</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">Zatiaľ neboli zaznamenané žiadne hodiny.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((lesson) => {
                const student = Array.isArray(lesson.student) ? lesson.student[0] : lesson.student;
                const teacher = Array.isArray(lesson.teacher) ? lesson.teacher[0] : lesson.teacher;
                return (
                  <div key={lesson.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1fr_0.9fr_0.7fr_0.9fr_0.5fr] lg:items-center lg:px-6">
                    <div>
                      <p className="font-semibold">{name(student)}</p>
                      <p className="mt-1 text-sm text-gray-400">{lesson.language || "Jazyk"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Lektor</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{name(teacher)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Dátum</p>
                      <p className="mt-1 text-sm lg:mt-0">{formatDate(lesson.scheduled_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock3 size={15} className="text-gray-400" />
                      {formatTime(lesson.scheduled_at)}
                    </div>
                    <div>
                      <span className="inline-flex rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold capitalize text-[#527064]">
                        {formatStatus(lesson.status)}
                      </span>
                    </div>
                    <div>
                      {lesson.meet_link && (
                        <a href={lesson.meet_link} target="_blank" rel="noreferrer" aria-label="Otvoriť online hodinu" className="inline-flex rounded-xl p-2 text-[#183f38] hover:bg-[#eef3ef]">
                          <Video size={17} />
                        </a>
                      )}
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
