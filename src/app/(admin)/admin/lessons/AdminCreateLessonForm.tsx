"use client";
import { createLessonOnce, type LessonCreation } from "@/lib/lesson-creation";
import { safeLessonLink } from "@/lib/lesson-link";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import { formatLessonCount } from "@/lib/portalLabels";
import { MUNDUS_LANGUAGE_OPTIONS } from "@/lib/language-offer";
import {useLanguage} from "@/context/LanguageContext";
import {formatLanguage} from "@/lib/portalLabels";

type PersonOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type PackageOption = {
  id: string;
  student_id: string;
  total_lessons: number | null;
  remaining_lessons: number | null;
};

type Props = {
  students: PersonOption[];
  teachers: PersonOption[];
  packages: PackageOption[];
};

function personName(person: PersonOption) {
  return person.full_name?.trim() || person.email || "—";
}

export default function AdminCreateLessonForm({
  students,
  teachers,
  packages,
}: Props) {
  const router = useRouter();
  const {language:uiLanguage}=useLanguage(); const sk=uiLanguage==="sk";

  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [language, setLanguage] = useState("English");
  const [meetLink, setMeetLink] = useState("");
  const [packageId, setPackageId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const attempt = useRef<{ signature: string; id: string } | null>(null);

  const studentPackages = useMemo(
    () =>
      packages.filter(
        (pkg) =>
          pkg.student_id === studentId &&
          (pkg.remaining_lessons ?? 0) > 0
      ),
    [packages, studentId]
  );

  const effectivePackageId =
    studentPackages.some((pkg) => pkg.id === packageId)
      ? packageId
      : studentPackages[0]?.id ?? "";

  async function createLesson() {
    if (busy.current) return;

    setError("");
    setSaved(false);

    if (!studentId || !teacherId) {
      setError(sk?"Vyberte študenta aj lektora.":"Choose both a student and a teacher.");
      return;
    }

    if (!effectivePackageId) {
      setError(
        sk?"Vybraný študent nemá aktívny balíček s voľnými hodinami.":"The selected student has no active package with available lessons."
      );
      return;
    }

    if (!dateTime) {
      setError(sk?"Vyberte dátum a čas hodiny.":"Choose the lesson date and time.");
      return;
    }

    const scheduledAt = bratislavaLocalToUtc(dateTime);

    if (Number.isNaN(scheduledAt.getTime())) {
      setError(sk?INVALID_LESSON_TIME:"The selected lesson time is invalid.");
      return;
    }

    if (
      scheduledAt.getTime() <= Date.now()
    ) {
      setError(sk?"Termín hodiny musí byť v budúcnosti.":"The lesson time must be in the future.");
      return;
    }

    const durationMinutes = Number(duration);

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 15 ||
      durationMinutes > 180
    ) {
      setError(sk?"Dĺžka hodiny musí byť medzi 15 a 180 minútami.":"Lesson duration must be between 15 and 180 minutes.");
      return;
    }

    const trimmedLink = meetLink.trim();

    if (trimmedLink && !safeLessonLink(trimmedLink)) {
      setError(sk?"Zadajte platný odkaz na online hodinu s https:// bez prihlasovacích údajov.":"Enter a valid https:// online lesson link without login credentials.");
      return;
    }

    busy.current = true;
    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const details = {
        student_id: studentId,
        teacher_id: teacherId,
        package_id: effectivePackageId,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        status: "scheduled",
        lesson_type: "regular",
        meet_link: trimmedLink || null,
        language,
      };
      const signature = JSON.stringify(details);
      if (attempt.current?.signature !== signature) {
        attempt.current = { signature, id: crypto.randomUUID() };
      }
      const row = { ...details, id: attempt.current.id };
      await createLessonOnce(row, async () => {
        const { data, error } = await supabase.from("lessons")
          .select("id,student_id,teacher_id,package_id,scheduled_at,duration_minutes,language,lesson_type,meet_link")
          .eq("id", row.id).maybeSingle();
        if (error) throw error;
        return data as LessonCreation | null;
      }, async () => {
        const { data: selectedPackage, error: packageError } = await supabase
          .from("lesson_packages").select("id")
          .eq("id", effectivePackageId).eq("student_id", studentId)
          .eq("status", "active").gt("remaining_lessons", 0).maybeSingle();
        if (packageError || !selectedPackage) {
          throw new Error(sk?"Vybraný balíček už nemá voľný kredit alebo nepatrí tomuto študentovi.":"The selected package has no available credit or does not belong to this student.");
        }
        const { error } = await supabase.from("lessons").insert({
          ...row, updated_at: new Date().toISOString(),
        }).select("id").single();
        if (error) throw error;
      });

      attempt.current = null;
      setSaved(true);
      setDateTime("");
      setMeetLink("");
      router.refresh();
    } catch {
      setError(sk?"Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.":"Saving failed. Check your connection and try again.");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  if (students.length === 0 || teachers.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4 text-sm text-[#92400e]">
        {sk?"Na vytvorenie hodiny je potrebný aspoň jeden aktívny študent a jeden aktívny lektor.":"At least one active student and one active teacher are required to create a lesson."}
      </div>
    );
  }

  return (
    <details className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <CalendarPlus size={19} />
        {sk?"Naplánovať novú hodinu":"Schedule a new lesson"}
      </summary>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium">
          {sk?"Študent":"Student"}
          <select
            disabled={saving}
            value={studentId}
            onChange={(event) => {
              setSaved(false);
              setStudentId(event.target.value);
              setPackageId("");
            }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {personName(student)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          {sk?"Lektor":"Teacher"}
          <select
            disabled={saving}
            value={teacherId}
            onChange={(event) => { setTeacherId(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {personName(teacher)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          {sk?"Jazyk":"Language"}
          <select
            disabled={saving}
            value={language}
            onChange={(event) => { setLanguage(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {MUNDUS_LANGUAGE_OPTIONS.map(({ value }) => (
              <option key={value} value={value}>{formatLanguage(value,uiLanguage)}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          {sk?"Dátum a čas":"Date and time"}
          <input
            disabled={saving}
            type="datetime-local"
            value={dateTime}
            onChange={(event) => { setDateTime(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          {sk?"Dĺžka":"Duration"}
          <select
            disabled={saving}
            value={duration}
            onChange={(event) => { setDuration(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            <option value="30">30 {sk?"minút":"minutes"}</option>
            <option value="45">45 {sk?"minút":"minutes"}</option>
            <option value="60">60 {sk?"minút":"minutes"}</option>
            <option value="90">90 {sk?"minút":"minutes"}</option>
          </select>
        </label>

        <label className="text-sm font-medium">
          {sk?"Balíček":"Package"}
          <select
            value={effectivePackageId}
            onChange={(event) => { setPackageId(event.target.value); setSaved(false); }}
            disabled={saving || studentPackages.length === 0}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            {studentPackages.length === 0 ? (
              <option value="">{sk?"Žiadny dostupný balíček":"No available package"}</option>
            ) : (
              studentPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.total_lessons == null ? (sk?"Neznámy balíček":"Unknown package") : formatLessonCount(pkg.total_lessons,uiLanguage)} · {sk?"zostáva":"remaining"} {formatLessonCount(pkg.remaining_lessons ?? 0,uiLanguage)}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2 xl:col-span-3">
          {sk?"Odkaz na online hodinu":"Online lesson link"}
          <input
            disabled={saving}
            type="url"
            value={meetLink}
            onChange={(event) => { setMeetLink(event.target.value); setSaved(false); }}
            placeholder="https://meet.google.com/..."
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={createLesson}
          disabled={saving || !effectivePackageId}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarPlus size={17} />
          {saving?(sk?"Vytváram...":"Creating..."):(sk?"Vytvoriť hodinu":"Create lesson")}
        </button>

        {saved && (
          <span role="status" className="text-sm font-medium text-[#3730A3]">
            {sk?"Hodina bola vytvorená.":"Lesson created."}
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>
    </details>
  );
}
