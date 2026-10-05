"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {useLanguage} from "@/context/LanguageContext";

type Props = {
  lessonId: string;
  studentId: string;
  packageId: string | null;
  scheduledAt: string;
};

const statusOptions=(sk:boolean)=>[
  {value:"completed",label:sk?"Dokončená":"Completed"},{value:"student_no_show",label:sk?"Študent sa nedostavil":"Student no-show"},
  {value:"student_cancelled",label:sk?"Zrušená študentom":"Cancelled by student"},{value:"late_cancellation",label:sk?"Neskoré zrušenie":"Late cancellation"},
  {value:"teacher_cancelled",label:sk?"Zrušená lektorom":"Cancelled by teacher"},
];

export default function LessonStatusActions({
  lessonId,
  packageId,
  scheduledAt,
}: Props) {
  const router = useRouter();
  const {language}=useLanguage(); const sk=language==="sk";
  const [status, setStatus] = useState("completed");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function saveStatus() {
    if (saving || saved) return;

    setError("");

    if (
      (status === "completed" || status === "student_no_show") &&
      new Date(scheduledAt).getTime() > Date.now()
    ) {
      setError(
        status === "completed"
          ? (sk?"Budúcu hodinu nie je možné označiť ako dokončenú.":"A future lesson cannot be marked completed.")
          : (sk?"Budúcu hodinu nie je možné označiť ako neprítomnosť študenta.":"A future lesson cannot be marked as student no-show.")
      );
      return;
    }

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (status === "completed") {
        if (!packageId) {
          setError(sk?"K hodine nie je priradený balíček. Kontaktujte administrátora.":"No package is assigned to this lesson. Contact the administrator.");
          return;
        }
      }

      const { data: updatedLesson, error: updateError } = status === "completed"
        ? await supabase.rpc("mundus_complete_lesson", { target_lesson_id: lessonId })
        : await supabase
          .from("lessons")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", lessonId)
          .in("status", ["scheduled", "rescheduled"])
          .select("id")
          .maybeSingle();

      if (updateError || !updatedLesson) {
        setError(
          status === "completed"
            ? (sk?"Hodinu sa nepodarilo dokončiť a overiť odpočítanie kreditu. Obnovte stránku alebo kontaktujte Mundus.":"The lesson could not be completed and credit deduction verified. Refresh the page or contact Mundus.")
            : (sk?"Stav hodiny sa nepodarilo uložiť. Skúste to prosím znova.":"The lesson status could not be saved. Please try again.")
        );
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError(sk?"Stav hodiny sa nepodarilo uložiť. Skontrolujte pripojenie a skúste to znova.":"The lesson status could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        disabled={saving || saved}
        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#0a0a0f] outline-none focus:border-[#2F3AA2]"
      >
        {statusOptions(sk).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={saveStatus}
        disabled={saving || saved}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle2 size={16} />
        {saving?(sk?"Ukladám...":"Saving..."):saved?(sk?"Uložené":"Saved"):(sk?"Uložiť stav":"Save status")}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-700 sm:max-w-xs">{error}</p>
      )}
    </div>
  );
}
