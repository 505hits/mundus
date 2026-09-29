"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  lessonId: string;
  scheduledAt: string;
  meetLink: string | null;
  currentStatus: string;
};

const statusOptions = [
  ["scheduled", "Naplánovaná"],
  ["rescheduled", "Presunutá"],
  ["completed", "Dokončená"],
  ["student_no_show", "Študent sa nedostavil"],
  ["student_cancelled", "Zrušená študentom"],
  ["late_cancellation", "Neskoré zrušenie"],
  ["teacher_cancelled", "Zrušená lektorom"],
];

function bratislavaInputValue(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value)).replace(" ", "T");
}

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

  return Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second
  ) - date.getTime();
}

function bratislavaLocalToUtc(value: string) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const localAsUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  let offset = getTimeZoneOffset(localAsUtc, "Europe/Bratislava");
  let result = new Date(localAsUtc.getTime() - offset);
  const correctedOffset = getTimeZoneOffset(result, "Europe/Bratislava");

  if (correctedOffset !== offset) {
    offset = correctedOffset;
    result = new Date(localAsUtc.getTime() - offset);
  }

  return result;
}

export default function AdminLessonActions({
  lessonId,
  scheduledAt,
  meetLink,
  currentStatus,
}: Props) {
  const router = useRouter();
  const initialDateTime = useMemo(
    () => bratislavaInputValue(scheduledAt),
    [scheduledAt]
  );

  const [dateTime, setDateTime] = useState(initialDateTime);
  const [link, setLink] = useState(meetLink ?? "");
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (saving) return;
    setError("");
    setSaved(false);

    const selectedDate = bratislavaLocalToUtc(dateTime);
    if (!dateTime || Number.isNaN(selectedDate.getTime())) {
      setError("Zvolený dátum a čas nie je platný.");
      return;
    }

    const trimmedLink = link.trim();
    if (trimmedLink && !/^https:\/\//i.test(trimmedLink)) {
      setError("Odkaz na online hodinu musí začínať https://");
      return;
    }

    const changedTime =
      selectedDate.toISOString() !== new Date(scheduledAt).toISOString();

    let nextStatus = status;
    if (
      changedTime &&
      (status === "scheduled" || status === "rescheduled")
    ) {
      nextStatus = "rescheduled";
    }

    if (
      nextStatus === "completed" &&
      selectedDate.getTime() > Date.now()
    ) {
      setError("Budúcu hodinu nie je možné označiť ako dokončenú.");
      return;
    }

    setSaving(true);
    const supabase = createSupabaseBrowserClient();

    const { error: updateError } = await supabase
      .from("lessons")
      .update({
        scheduled_at: selectedDate.toISOString(),
        meet_link: trimmedLink || null,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lessonId);

    if (updateError) {
      setError("Hodinu sa nepodarilo aktualizovať. Skúste to prosím znova.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <details className="relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold">
        <Settings2 size={15} />
        Upraviť
      </summary>

      <div className="mt-3 min-w-[260px] rounded-2xl border border-black/10 bg-[#fafbf9] p-4">
        <label className="block text-xs font-medium text-gray-600">
          Dátum a čas
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          Stav
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          Odkaz na online hodinu
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://meet.google.com/..."
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-3 w-full rounded-xl bg-[#183f38] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Ukladám..." : "Uložiť zmeny"}
        </button>

        {saved && <p className="mt-2 text-xs font-medium text-[#527064]">Uložené.</p>}
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      </div>
    </details>
  );
}
