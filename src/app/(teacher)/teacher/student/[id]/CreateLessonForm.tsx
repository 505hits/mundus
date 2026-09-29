"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { formatLessonCount } from "@/lib/portalLabels";

type PackageOption = {
  id: string;
  total_lessons: number | null;
  remaining_lessons: number | null;
};

type Props = {
  studentId: string;
  language: string;
  lessonType: string;
  packages: PackageOption[];
};

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

export default function CreateLessonForm({
  studentId,
  language,
  lessonType,
  packages,
}: Props) {
  const router = useRouter();

  const availablePackages = packages.filter(
    (pkg) => (pkg.remaining_lessons ?? 0) > 0
  );

  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [meetLink, setMeetLink] = useState("");
  const [packageId, setPackageId] = useState(
    availablePackages[0]?.id ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function createLesson() {
    if (saving) return;

    setError("");
    setSaved(false);

    if (!dateTime) {
      setError("Vyberte dátum a čas hodiny.");
      return;
    }

    if (!packageId) {
      setError(
        "Študent nemá dostupný aktívny balíček s voľnými hodinami."
      );
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Vaše prihlásenie vypršalo. Prihláste sa prosím znova.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("lessons")
      .insert({
        student_id: studentId,
        teacher_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        status: "scheduled",
        lesson_type: lessonType || "regular",
        meet_link: trimmedLink || null,
        language: language || null,
        package_id: packageId,
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

  return (
    <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#eef3ef] p-3">
          <CalendarPlus size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-400">Plánovanie</p>
          <h2 className="mt-1 text-xl font-semibold">
            Naplánovať ďalšiu hodinu
          </h2>
        </div>
      </div>

      {availablePackages.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-[#faf6eb] p-4 text-sm text-[#7e693a]">
          Študent momentálne nemá aktívny balíček s voľnými hodinami.
          Novú hodinu bude možné naplánovať po pridaní alebo obnovení balíčka.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              Dĺžka hodiny
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
                value={packageId}
                onChange={(event) => setPackageId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
              >
                {availablePackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.total_lessons == null ? "Neznámy balíček" : formatLessonCount(pkg.total_lessons)} · zostáva {formatLessonCount(pkg.remaining_lessons ?? 0)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
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
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CalendarPlus size={17} />
              {saving ? "Vytváram..." : "Naplánovať hodinu"}
            </button>

            {saved && (
              <span className="text-sm font-medium text-[#527064]">
                Hodina bola naplánovaná.
              </span>
            )}

            {error && (
              <span className="text-sm text-red-700">{error}</span>
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-400">
            Termín sa uloží v časovom pásme Bratislava. Po dokončení hodiny sa
            kredit odpočíta z vybraného balíčka.
          </p>
        </>
      )}
    </section>
  );
}
