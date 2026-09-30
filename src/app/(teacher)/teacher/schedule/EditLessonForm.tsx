"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  lessonId: string;
  scheduledAt: string;
  meetLink: string | null;
};

function bratislavaInputValue(value: string) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(new Date(value)).replace(" ", "T");
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

  const asUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second
  );

  return asUtc - date.getTime();
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

export default function EditLessonForm({
  lessonId,
  scheduledAt,
  meetLink,
}: Props) {
  const router = useRouter();
  const initialDateTime = useMemo(
    () => bratislavaInputValue(scheduledAt),
    [scheduledAt]
  );

  const [dateTime, setDateTime] = useState(initialDateTime);
  const [link, setLink] = useState(meetLink ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    if (saving) return;

    setError("");
    setSaved(false);

    if (!dateTime) {
      setError("Vyberte dátum a čas hodiny.");
      return;
    }

    const selectedDate = bratislavaLocalToUtc(dateTime);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Zvolený termín nie je platný.");
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      setError("Nový termín musí byť v budúcnosti.");
      return;
    }

    const trimmedLink = link.trim();

    if (
      trimmedLink &&
      !/^https:\/\//i.test(trimmedLink)
    ) {
      setError("Odkaz na online hodinu musí začínať https://");
      return;
    }

    setSaving(true);

    const changedTime =
      selectedDate.toISOString() !==
      new Date(scheduledAt).toISOString();

    const supabase = createSupabaseBrowserClient();

    const update: {
      scheduled_at: string;
      meet_link: string | null;
      updated_at: string;
      status?: string;
    } = {
      scheduled_at: selectedDate.toISOString(),
      meet_link: trimmedLink || null,
      updated_at: new Date().toISOString(),
    };

    if (changedTime) {
      update.status = "rescheduled";
    }

    const { error: updateError } = await supabase
      .from("lessons")
      .update(update)
      .eq("id", lessonId)
      .in("status", ["scheduled", "rescheduled"]);

    if (updateError) {
      setError(
        "Hodinu sa nepodarilo aktualizovať. Skúste to prosím znova."
      );
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <details className="mt-4 rounded-2xl border border-black/5 bg-white/80 p-4 text-[#183f38]">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
        <CalendarClock size={16} />
        Upraviť termín alebo online odkaz
      </summary>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Dátum a čas
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Odkaz na online hodinu
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://meet.google.com/..."
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Ukladám..." : "Uložiť zmeny"}
        </button>

        {saved && (
          <span className="text-sm font-medium text-[#527064]">
            Zmeny boli uložené.
          </span>
        )}

        {error && (
          <span className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        Časy v portáli sú vedené v časovom pásme Bratislava.
      </p>
    </details>
  );
}
