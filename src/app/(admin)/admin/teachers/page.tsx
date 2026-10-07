import {
  AlertCircle,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatLanguage, formatProfileStatus } from "@/lib/portalLabels";
import InviteTeacherForm from "./invite/InviteTeacherForm";
import TeacherApprovalAction from "./TeacherApprovalAction";
import { currentLanguage } from "@/lib/i18n";

export default async function AdminTeachersPage() {
  const language=await currentLanguage();
  const sk=language==="sk";
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [
    { data: teachers, error },
    { data: lessons, error: lessonsError },
    { data: preferences, error: preferencesError },
    { data: publicProfiles, error: publicProfilesError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,status")
      .eq("role", "teacher")
      .order("full_name", { ascending: true }),
    supabase
      .from("lessons")
      .select("teacher_id,student_id,scheduled_at,status,language")
      .in("status", ["scheduled", "rescheduled", "completed"]),
    supabase
      .from("teacher_preferences")
      .select("teacher_id,languages"),
    supabase
      .from("teacher_public_profiles")
      .select("teacher_id,headline,bio,languages,photo_path,website_visible"),
  ]);

  const now = new Date();
  const bratislavaDateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const todayKey = bratislavaDateKey.format(now);
  const currentMonthKey = todayKey.slice(0, 7);

  const teacherRows = (teachers ?? []).map((teacher) => {
    const teacherLessons = (lessons ?? []).filter(
      (lesson) => lesson.teacher_id === teacher.id
    );
    const studentCount = new Set(
      teacherLessons.map((lesson) => lesson.student_id)
    ).size;
    const completedThisMonth = teacherLessons.filter((lesson) =>
      lesson.status === "completed" &&
      bratislavaDateKey.format(new Date(lesson.scheduled_at)).startsWith(currentMonthKey)
    ).length;
    const preference = (preferences ?? []).find((item) => item.teacher_id === teacher.id);
    const websiteProfile = (publicProfiles ?? []).find((item) => item.teacher_id === teacher.id);
    const lessonLanguages = Array.from(
      new Set(
        teacherLessons
          .map((lesson) => lesson.language)
          .filter((language): language is string => Boolean(language))
      )
    );
    const languageValues = preference?.languages?.length ? preference.languages : lessonLanguages;
    const publicProfileComplete = Boolean(
      websiteProfile?.photo_path &&
      websiteProfile?.headline?.trim() &&
      websiteProfile?.bio?.trim().length >= 20 &&
      websiteProfile?.languages?.length
    );

    return {
      ...teacher,
      studentCount,
      completedThisMonth,
      languages: languageValues.length ? languageValues.map((value: string) => formatLanguage(value,language)).join(", ") : "—",
      publicProfileComplete,
      websiteVisible: Boolean(websiteProfile?.website_visible),
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
  const completedThisMonth = teacherRows.reduce(
    (sum, teacher) => sum + teacher.completedThisMonth,
    0
  );

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">
            {sk?"Lektori":"Teachers"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {sk?"Správa lektorov":"Teacher management"}
          </h1>
          <p className="mt-2 text-gray-500">
            {sk?"Reálne účty lektorov a aktuálna výučba.":"Real teacher accounts and current teaching activity."}
          </p>
        </section>

        <InviteTeacherForm enabled={process.env.MUNDUS_INVITATIONS_ENABLED === "true"} />

        {(error || lessonsError || preferencesError || publicProfilesError) && (
          <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk?"Nepodarilo sa načítať účty lektorov. Obnovte stránku a skúste to znova.":"Teacher accounts could not be loaded. Refresh the page and try again."}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <GraduationCap size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{activeTeachers}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Aktívni lektori":"Active teachers"}</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Users size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{assignedStudents}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Priradení študenti":"Assigned students"}</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{completedThisMonth}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Dokončené hodiny tento mesiac":"Completed lessons this month"}</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{pendingTeachers}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Čakajúci / neaktívni":"Pending / inactive"}</p>
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm text-gray-400">{sk?"Tím":"Team"}</p>
          <h2 className="mt-1 text-xl font-semibold">{sk?"Účty lektorov":"Teacher accounts"}</h2>

          {teacherRows.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-500 shadow-sm">
              {sk?"Zatiaľ nie sú vytvorené žiadne účty lektorov.":"No teacher accounts have been created yet."}
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="divide-y divide-gray-100">
                {teacherRows.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[1.35fr_1fr_0.7fr_0.8fr_0.9fr_0.9fr_1fr] lg:items-center lg:px-6"
                  >
                    <div>
                      <p className="font-semibold">
                        {teacher.full_name?.trim() || teacher.email || (sk?"Lektor":"Teacher")}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {teacher.languages}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">E-mail</p>
                      <p className="mt-1 truncate text-sm lg:mt-0">
                        {teacher.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Študenti":"Students"}</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {teacher.studentCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Tento mesiac":"This month"}</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">
                        {teacher.completedThisMonth} {sk?"hodín":"lessons"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Web profil":"Web profile"}</p>
                      <span className={teacher.publicProfileComplete && teacher.websiteVisible
                        ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"}>
                        {teacher.publicProfileComplete
                          ? teacher.websiteVisible ? (sk?"Zobrazený":"Visible") : (sk?"Pripravený":"Ready")
                          : (sk?"Nedokončený":"Incomplete")}
                      </span>
                    </div>
                    <div>
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold capitalize text-[#3730A3]">
                        {formatProfileStatus(teacher.status,language)}
                      </span>
                    </div>
                    <div>
                      <TeacherApprovalAction
                        teacherId={teacher.id}
                        status={teacher.status}
                      />
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
