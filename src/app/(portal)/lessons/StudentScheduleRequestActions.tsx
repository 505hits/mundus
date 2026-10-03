"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  requestId: string;
};

export default function StudentScheduleRequestActions({
  requestId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);
  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  async function respond(status: "accepted" | "declined") {
    if (loading || saved) return;

    setLoading(status);
    setError("");

    try {
    const supabase = createSupabaseBrowserClient();

    const { data: updatedRequest, error: updateError } = await supabase
      .from("schedule_change_requests")
      .update({
        status,
        responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError || !updatedRequest) {
      setError("Odpoveď sa nepodarilo uložiť. Skúste to prosím znova.");
      setLoading(null);
      return;
    }

    setSaved(true);
    router.refresh();
    } catch {
      setError("Odpoveď sa nepodarilo uložiť. Skúste znova alebo kontaktujte Mundus.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => respond("accepted")}
          disabled={loading !== null || saved}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={16} />
          {loading === "accepted" ? "Potvrdzujem..." : "Potvrdiť nový termín"}
        </button>

        <button
          type="button"
          onClick={() => respond("declined")}
          disabled={loading !== null || saved}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#183f38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined" ? "Odmietam..." : "Ponechať pôvodný termín"}
        </button>
      </div>

      {saved && <p role="status" className="mt-3 text-sm text-[#2F3AA2]">Odpoveď bola uložená. Aktuálny termín nájdete v rozvrhu.</p>}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
