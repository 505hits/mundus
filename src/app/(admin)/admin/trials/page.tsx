import { AlertCircle, CalendarDays, CheckCircle2, Clock3, UserPlus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function displayName(profile: { full_name?: string | null; email?: string | null } | null | undefined, fallback: string) {
  return profile?.full_name?.trim() || profile?.email || fallback;
}

export default async function AdminÚvodné hodinyPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: trials, error } = await supabase
    .from("lessons")
    .select(`
      id,scheduled_at,status,language,notes,student_id,
      student:profiles!lessons_student_id_fkey(full_name,email,status),
      teacher:profiles!lessons_teacher_id_fkey(full_name,email)
    `)
    .eq("lesson_type", "trial")
    .order("scheduled_at", { ascending: false });

  const rows = trials ?? [];
  const now = Date.now();
  const upcoming = rows.filter(
    (trial) =>
      ["scheduled", "rescheduled"].includes(trial.status) &&
      new Date(trial.scheduled_at).getTime() >= now
  );
  const completed = rows.filter((trial) => trial.status === "completed");
  const followUp = completed.filter((trial) => {
    const student = Array.isArray(trial.student) ? trial.student[0] : trial.student;
    return student?.status !== "active";
  });
  const converted = completed.filter((trial) => {
    const student = Array.isArray(trial.student) ? trial.student[0] : trial.student;
    return student?.status === "active";
  });

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">Úvodné hodiny</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Úvodné hodiny</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Live trial lesson overview from the Mundus lesson schedule.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Nepodarilo sa načítať úvodné hodiny. Obnovte stránku a skúste to znova.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{upcoming.length}</p>
            <p className="mt-1 text-sm text-gray-500">Upcoming trials</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{completed.length}</p>
            <p className="mt-1 text-sm text-gray-500">Dokončené úvodné hodiny</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{followUp.length}</p>
            <p className="mt-1 text-sm text-gray-500">Treba sa ozvať</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <UserPlus size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{converted.length}</p>
            <p className="mt-1 text-sm text-gray-500">Active students after trial</p>
          </div>
        </section>

        <section className="mt-8 space-y-3">
          {rows.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
              No trial lessons have been added yet.
            </div>
          ) : (
            rows.map((trial) => {
              const student = Array.isArray(trial.student) ? trial.student[0] : trial.student;
              const teacher = Array.isArray(trial.teacher) ? trial.teacher[0] : trial.teacher;
              const needsFollowUp = trial.status === "completed" && student?.status !== "active";

              return (
                <article
                  key={trial.id}
                  className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
                    needsFollowUp ? "border-[#2F3AA2]/15 bg-[#f5f6ff]" : "border-black/5 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{displayName(student, "Študent")}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          needsFollowUp
                            ? "bg-white text-[#2F3AA2]"
                            : "bg-[#eef0ff] text-[#2F3AA2]"
                        }`}>
                          {needsFollowUp ? "Treba sa ozvať" : trial.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{trial.language || "Language not set"}</p>
                      {trial.notes && <p className="mt-1 text-sm text-gray-400">{trial.notes}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-8">
                      <div>
                        <p className="text-xs text-gray-400">Lektor</p>
                        <p className="mt-1 text-sm font-medium">{displayName(teacher, "Not assigned")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Úvodná hodina</p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                          <Clock3 size={15} />
                          {formatDateTime(trial.scheduled_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
