"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  lessonId: string;
  studentId: string;
  packageId: string | null;
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
  studentId,
  packageId,
  scheduledAt,
}: Props) {
  const router = useRouter();
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
          ? "Budúcu hodinu nie je možné označiť ako dokončenú."
          : "Budúcu hodinu nie je možné označiť ako neprítomnosť študenta."
      );
      return;
    }

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (status === "completed") {
        if (!packageId) {
          setError("K hodine nie je priradený balíček. Kontaktujte administrátora.");
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
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Stav hodiny sa nepodarilo uložiť. Skontrolujte pripojenie a skúste to znova.");
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
        {statusOptions.map((option) => (
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
        {saving ? "Ukladám..." : saved ? "Uložené" : "Uložiť stav"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-700 sm:max-w-xs">{error}</p>
      )}
    </div>
  );
}
