"use client";
import { safeLessonLink } from "@/lib/lesson-link";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import {useLanguage} from "@/context/LanguageContext";

type Props = {
  lessonId: string;
  studentId: string;
  packageId: string | null;
  scheduledAt: string;
  meetLink: string | null;
  currentStatus: string;
};

const statusOptions=(sk:boolean)=>[
  ["scheduled", sk?"Naplánovaná":"Scheduled"],["rescheduled",sk?"Presunutá":"Rescheduled"],["completed",sk?"Dokončená":"Completed"],
  ["student_no_show",sk?"Študent sa nedostavil":"Student no-show"],["student_cancelled",sk?"Zrušená študentom":"Cancelled by student"],
  ["late_cancellation",sk?"Neskoré zrušenie":"Late cancellation"],["teacher_cancelled",sk?"Zrušená lektorom":"Cancelled by teacher"],
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
  packageId,
  scheduledAt,
  meetLink,
  currentStatus,
}: Props) {
  const router = useRouter();
  const {language}=useLanguage(); const sk=language==="sk";
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
      setError(sk?INVALID_LESSON_TIME:"The selected lesson time is invalid.");
      return;
    }

    const trimmedLink = link.trim();
    if (trimmedLink && !safeLessonLink(trimmedLink)) {
      setError(sk?"Zadajte platný odkaz na online hodinu s https:// bez prihlasovacích údajov.":"Enter a valid https:// online lesson link without login credentials.");
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
          ? (sk?"Budúcu hodinu nie je možné označiť ako dokončenú.":"A future lesson cannot be marked completed.")
          : (sk?"Budúcu hodinu nie je možné označiť ako neprítomnosť študenta.":"A future lesson cannot be marked as student no-show.")
      );
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();

      if (nextStatus === "completed" && currentStatus !== "completed") {
        if (!packageId) {
          setError(sk?"K hodine nie je priradený balíček.":"No package is assigned to this lesson.");
          return;
        }

        if (changedTime || (trimmedLink || null) !== meetLink) {
          setError(sk?"Najprv uložte opravu času alebo odkazu s pôvodným stavom. Potom označte hodinu ako dokončenú.":"First save the corrected time or link with the original status. Then mark the lesson completed.");
          return;
        }
        const { data, error } = await supabase.rpc("mundus_complete_lesson", { target_lesson_id: lessonId });
        if (error || !data) {
          setError(sk?"Hodinu sa nepodarilo dokončiť a overiť odpočítanie kreditu. Obnovte stránku alebo skontrolujte balíček.":"The lesson could not be completed and credit deduction verified. Refresh the page or check the package.");
          return;
        }
        setSaved(true);
        router.refresh();
        return;
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
        setError(sk?"Hodinu sa nepodarilo aktualizovať. Skúste to prosím znova.":"The lesson could not be updated. Please try again.");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError(sk?"Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.":"Saving failed. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold">
        <Settings2 size={15} />
        {sk?"Upraviť":"Edit"}
      </summary>

      <div className="mt-3 min-w-[260px] rounded-2xl border border-black/10 bg-[#FAFAF9] p-4">
        <label className="block text-xs font-medium text-gray-600">
          {sk?"Dátum a čas":"Date and time"}
          <input
            disabled={saving}
            type="datetime-local"
            value={dateTime}
            onChange={(event) => { setDateTime(event.target.value); setSaved(false); }}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          {sk?"Stav":"Status"}
          <select
            disabled={saving || currentStatus === "completed"}
            value={status}
            onChange={(event) => { setStatus(event.target.value); setSaved(false); }}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          >
            {statusOptions(sk).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        {currentStatus === "completed" && <p className="mt-2 text-xs text-gray-500">Dokončenú hodinu nemožno znovu otvoriť. Opravu účtovania riešte samostatne, aby sa kredit neodpočítal dvakrát.</p>}

        <label className="mt-3 block text-xs font-medium text-gray-600">
          {sk?"Odkaz na online hodinu":"Online lesson link"}
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
          className="mt-3 w-full rounded-xl bg-[#2F3AA2] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving?(sk?"Ukladám...":"Saving..."):(sk?"Uložiť zmeny":"Save changes")}
        </button>

        {saved && <p role="status" className="mt-2 text-xs font-medium text-[#3730A3]">{sk?"Uložené.":"Saved."}</p>}
        {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
      </div>
    </details>
  );
}
