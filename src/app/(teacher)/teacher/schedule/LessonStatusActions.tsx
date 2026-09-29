"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  lessonId: string;
  scheduledAt: string;
};

const statusOptions = [
  { value: "completed", label: "Dokončená" },
  { value: "student_no_show", label: "Študent sa nedostavil" },
  { value: "student_cancelled", label: "Zrušená študentom" },
  { value: "late_cancellation", label: "Neskoré zrušenie" },
  { value: "teacher_cancelled", label: "Zrušená lektorom" },
];

export default function LessonStatusActions({
  lessonId,
  scheduledAt,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState("completed");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveStatus() {
    if (saving) return;

    setError("");

    if (
      (status === "completed" || status === "student_no_show") &&
      new Date(scheduledAt).getTime() > Date.now()
    ) {
      setError(
        status === "completed"
          ? "Budúcu hodinu nie je možné označiť ako dokončenú."
          : "Budúcu hodinu nie je možné označiť ako neprítomnosť študenta."
      );
      return;
    }

    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const { data: updatedLesson, error: updateError } = await supabase
      .from("lessons")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lessonId)
      .in("status", ["scheduled", "rescheduled"])
      .select("id")
      .maybeSingle();

    if (updateError || !updatedLesson) {
      setError(
        "Stav hodiny sa nepodarilo uložiť. Skúste to prosím znova."
      );
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        disabled={saving}
        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#183f38] outline-none focus:border-[#183f38]"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={saveStatus}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle2 size={16} />
        {saving ? "Ukladám..." : "Uložiť stav"}
      </button>

      {error && (
        <p className="text-sm text-red-700 sm:max-w-xs">{error}</p>
      )}
    </div>
  );
}
