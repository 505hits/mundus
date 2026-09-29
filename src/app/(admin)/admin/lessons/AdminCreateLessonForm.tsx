"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { formatLessonCount } from "@/lib/portalLabels";

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

const languages = [
  ["English", "Angličtina"],
  ["German", "Nemčina"],
  ["Spanish", "Španielčina"],
  ["Italian", "Taliančina"],
  ["French", "Francúzština"],
  ["Portuguese", "Portugalčina"],
  ["Russian", "Ruština"],
  ["Turkish", "Turečtina"],
];

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return (
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second
    ) - date.getTime()
  );
}

function bratislavaLocalToUtc(value: string) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const localAsUtc = new Date(
    Date.UTC(year, month - 1, day, hour, minute, 0)
  );

  let offset = getTimeZoneOffset(
    localAsUtc,
    "Europe/Bratislava"
  );

  let result = new Date(localAsUtc.getTime() - offset);

  const correctedOffset = getTimeZoneOffset(
    result,
    "Europe/Bratislava"
  );

  if (correctedOffset !== offset) {
    offset = correctedOffset;
    result = new Date(localAsUtc.getTime() - offset);
  }

  return result;
}

function personName(person: PersonOption) {
  return person.full_name?.trim() || person.email || "Bez mena";
}

export default function AdminCreateLessonForm({
  students,
  teachers,
  packages,
}: Props) {
  const router = useRouter();

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
    if (saving) return;

    setError("");
    setSaved(false);

    if (!studentId || !teacherId) {
      setError("Vyberte študenta aj lektora.");
      return;
    }

    if (!effectivePackageId) {
      setError(
        "Vybraný študent nemá aktívny balíček s voľnými hodinami."
      );
      return;
    }

    if (!dateTime) {
      setError("Vyberte dátum a čas hodiny.");
      return;
    }

    const scheduledAt = bratislavaLocalToUtc(dateTime);

    if (
      Number.isNaN(scheduledAt.getTime()) ||
      scheduledAt.getTime() <= Date.now()
    ) {
      setError("Termín hodiny musí byť v budúcnosti.");
      return;
    }

    const durationMinutes = Number(duration);

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 15 ||
      durationMinutes > 180
    ) {
      setError("Dĺžka hodiny musí byť medzi 15 a 180 minútami.");
      return;
    }

    const trimmedLink = meetLink.trim();

    if (trimmedLink && !/^https:\/\//i.test(trimmedLink)) {
      setError("Odkaz na online hodinu musí začínať https://");
      return;
    }

    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const { data: selectedPackage, error: packageError } = await supabase
      .from("lesson_packages")
      .select("id")
      .eq("id", effectivePackageId)
      .eq("student_id", studentId)
      .eq("status", "active")
      .gt("remaining_lessons", 0)
      .maybeSingle();

    if (packageError || !selectedPackage) {
      setError(
        "Vybraný balíček už nemá voľný kredit alebo nepatrí tomuto študentovi."
      );
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("lessons")
      .insert({
        student_id: studentId,
        teacher_id: teacherId,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        status: "scheduled",
        lesson_type: "regular",
        meet_link: trimmedLink || null,
        language,
        package_id: effectivePackageId,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      setError(
        "Hodinu sa nepodarilo vytvoriť. Skontrolujte údaje a skúste to znova."
      );
      setSaving(false);
      return;
    }

    setSaved(true);
    setDateTime("");
    setMeetLink("");
    setSaving(false);
    router.refresh();
  }

  if (students.length === 0 || teachers.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#c6a65b]/20 bg-[#faf6eb] p-4 text-sm text-[#7e693a]">
        Na vytvorenie hodiny je potrebný aspoň jeden aktívny študent a jeden aktívny lektor.
      </div>
    );
  }

  return (
    <details className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <CalendarPlus size={19} />
        Naplánovať novú hodinu
      </summary>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium">
          Študent
          <select
            value={studentId}
            onChange={(event) => {
              setStudentId(event.target.value);
              setPackageId("");
            }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {personName(student)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Lektor
          <select
            value={teacherId}
            onChange={(event) => setTeacherId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {personName(teacher)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Jazyk
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          >
            {languages.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Dátum a čas
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Dĺžka
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          >
            <option value="30">30 minút</option>
            <option value="45">45 minút</option>
            <option value="60">60 minút</option>
            <option value="90">90 minút</option>
          </select>
        </label>

        <label className="text-sm font-medium">
          Balíček
          <select
            value={effectivePackageId}
            onChange={(event) => setPackageId(event.target.value)}
            disabled={studentPackages.length === 0}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            {studentPackages.length === 0 ? (
              <option value="">Žiadny dostupný balíček</option>
            ) : (
              studentPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.total_lessons == null ? "Neznámy balíček" : formatLessonCount(pkg.total_lessons)} · zostáva {formatLessonCount(pkg.remaining_lessons ?? 0)}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2 xl:col-span-3">
          Odkaz na online hodinu
          <input
            type="url"
            value={meetLink}
            onChange={(event) => setMeetLink(event.target.value)}
            placeholder="https://meet.google.com/..."
            className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={createLesson}
          disabled={saving || !effectivePackageId}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarPlus size={17} />
          {saving ? "Vytváram..." : "Vytvoriť hodinu"}
        </button>

        {saved && (
          <span className="text-sm font-medium text-[#527064]">
            Hodina bola vytvorená.
          </span>
        )}

        {error && (
          <span className="text-sm text-red-700">{error}</span>
        )}
      </div>
    </details>
  );
}
