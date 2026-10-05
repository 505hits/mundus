"use client";
import { safeLessonLink } from "@/lib/lesson-link";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import { useLanguage } from "@/context/LanguageContext";

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


export default function EditLessonForm({
  lessonId,
  scheduledAt,
  meetLink,
}: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const sk = language === "sk";
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
      setError(sk ? "Vyberte dátum a čas hodiny." : "Choose the lesson date and time.");
      return;
    }

    const selectedDate = dateTime === initialDateTime
      ? new Date(scheduledAt)
      : bratislavaLocalToUtc(dateTime);

    if (Number.isNaN(selectedDate.getTime())) {
      setError(sk ? INVALID_LESSON_TIME : "The selected lesson time is invalid.");
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      setError(sk ? "Nový termín musí byť v budúcnosti." : "The new lesson time must be in the future.");
      return;
    }

    const trimmedLink = link.trim();

    if (
      trimmedLink &&
      !safeLessonLink(trimmedLink)
    ) {
      setError(sk ? "Zadajte platný odkaz na online hodinu s https:// bez prihlasovacích údajov." : "Enter a valid https:// online lesson link without login credentials.");
      return;
    }

    setSaving(true);

    const changedTime =
      selectedDate.toISOString() !==
      new Date(scheduledAt).toISOString();

    try {
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

      const { data: updatedLesson, error: updateError } = await supabase
        .from("lessons")
        .update(update)
        .eq("id", lessonId)
        .eq("scheduled_at", scheduledAt)
        .in("status", ["scheduled", "rescheduled"])
        .select("id")
        .maybeSingle();

      if (updateError || !updatedLesson) {
        setError(
          (sk ? "Hodinu sa nepodarilo aktualizovať. Obnovte stránku a skontrolujte aktuálny stav hodiny." : "The lesson could not be updated. Refresh the page and check the current lesson status.")
        );
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError(sk ? "Hodinu sa nepodarilo aktualizovať. Skontrolujte pripojenie a skúste to znova." : "The lesson could not be updated. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="mt-4 rounded-2xl border border-black/5 bg-white/80 p-4 text-[#0a0a0f]">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
        <CalendarClock size={16} />
        {sk ? "Upraviť termín alebo online odkaz" : "Edit lesson time or online link"}
      </summary>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          {sk ? "Dátum a čas" : "Date and time"}
          <input
            disabled={saving}
            type="datetime-local"
            value={dateTime}
            onChange={(event) => { setDateTime(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          {sk ? "Odkaz na online hodinu" : "Online lesson link"}
          <input
            disabled={saving}
            type="url"
            value={link}
            onChange={(event) => { setLink(event.target.value); setSaved(false); }}
            placeholder="https://meet.google.com/..."
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? (sk ? "Ukladám..." : "Saving...") : (sk ? "Uložiť zmeny" : "Save changes")}
        </button>

        {saved && (
          <span role="status" className="text-sm font-medium text-[#3730A3]">
            {sk ? "Zmeny boli uložené." : "Changes saved."}
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        {sk ? "Časy v portáli sú vedené v časovom pásme Bratislava." : "Portal times use the Bratislava time zone."}
      </p>
    </details>
  );
}
