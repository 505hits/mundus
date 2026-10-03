"use client";
import { safeLessonLink } from "@/lib/lesson-link";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";

type Props = {
  lessonId: string;
  studentId: string;
  packageId: string | null;
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


export default function AdminLessonActions({
  lessonId,
  studentId,
  packageId,
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

    const selectedDate = dateTime === initialDateTime
      ? new Date(scheduledAt)
      : bratislavaLocalToUtc(dateTime);

    if (Number.isNaN(selectedDate.getTime())) {
      setError(INVALID_LESSON_TIME);
      return;
    }

    const trimmedLink = link.trim();
    if (trimmedLink && !safeLessonLink(trimmedLink)) {
      setError("Zadajte platný odkaz na online hodinu s https:// bez prihlasovacích údajov.");
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
      (nextStatus === "completed" || nextStatus === "student_no_show") &&
      selectedDate.getTime() > Date.now()
    ) {
      setError(
        nextStatus === "completed"
          ? "Budúcu hodinu nie je možné označiť ako dokončenú."
          : "Budúcu hodinu nie je možné označiť ako neprítomnosť študenta."
      );
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();

      if (nextStatus === "completed" && currentStatus !== "completed") {
        if (!packageId) {
          setError("K hodine nie je priradený balíček.");
          return;
        }

        const { data: pkg, error: packageError } = await supabase
          .from("lesson_packages")
          .select("id")
          .eq("id", packageId)
          .eq("student_id", studentId)
          .eq("status", "active")
          .gt("remaining_lessons", 0)
          .maybeSingle();

        if (packageError || !pkg) {
          setError("Hodinu nemožno dokončiť: balíček nemá voľný kredit alebo nepatrí tomuto študentovi.");
          return;
        }
      }

      const { data: updatedLesson, error: updateError } = await supabase
        .from("lessons")
        .update({
          scheduled_at: selectedDate.toISOString(),
          meet_link: trimmedLink || null,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lessonId)
        .eq("status", currentStatus)
        .eq("scheduled_at", scheduledAt)
        .select("id")
        .maybeSingle();

      if (updateError || !updatedLesson) {
        setError("Hodinu sa nepodarilo aktualizovať. Skúste to prosím znova.");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.");
    } finally {
      setSaving(false);
    }
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
            disabled={saving}
            type="datetime-local"
            value={dateTime}
            onChange={(event) => { setDateTime(event.target.value); setSaved(false); }}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          Stav
          <select
            disabled={saving}
            value={status}
            onChange={(event) => { setStatus(event.target.value); setSaved(false); }}
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
            disabled={saving}
            type="url"
            value={link}
            onChange={(event) => { setLink(event.target.value); setSaved(false); }}
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

        {saved && <p role="status" className="mt-2 text-xs font-medium text-[#527064]">Uložené.</p>}
        {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
      </div>
    </details>
  );
}
