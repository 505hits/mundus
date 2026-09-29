"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  teacherId: string;
  status: string | null;
};

export default function TeacherApprovalAction({
  teacherId,
  status,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (status === "active") {
    return (
      <span className="text-xs font-medium text-gray-400">
        Schválený
      </span>
    );
  }

  async function approve() {
    if (saving) return;

    setSaving(true);
    setError("");

    const supabase = createSupabaseBrowserClient();

    const { data: updatedTeacher, error: updateError } = await supabase
      .from("profiles")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", teacherId)
      .eq("role", "teacher")
      .select("id")
      .maybeSingle();

    if (updateError || !updatedTeacher) {
      setError(
        "Účet lektora sa nepodarilo schváliť. Skúste to prosím znova."
      );
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={approve}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle2 size={15} />
        {saving ? "Schvaľujem..." : "Schváliť účet"}
      </button>

      {error && (
        <p className="mt-2 max-w-xs text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
