"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PauseCircle } from "lucide-react";
import { updateAccountStatus } from "../account-status";

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

  async function updateStatus(nextStatus: "active" | "inactive") {
    if (saving) return;

    setSaving(true);
    setError("");

    const updated = await updateAccountStatus(teacherId, "teacher", nextStatus).catch(() => false);

    if (!updated) {
      setError(
        nextStatus === "active"
          ? "Účet lektora sa nepodarilo schváliť. Skúste to prosím znova."
          : "Účet lektora sa nepodarilo deaktivovať. Skúste to prosím znova."
      );
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      {status === "active" ? (
        <button
          type="button"
          onClick={() => updateStatus("inactive")}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#7e693a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PauseCircle size={15} />
          {saving ? "Deaktivujem..." : "Deaktivovať"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => updateStatus("active")}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckCircle2 size={15} />
          {saving ? "Schvaľujem..." : "Schváliť účet"}
        </button>
      )}

      {error && (
        <p className="mt-2 max-w-xs text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
