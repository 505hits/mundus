"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  requestId: string;
};

export default function ScheduleRequestActions({
  requestId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "accepted" | "declined" | null
  >(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [saved, setSaved] = useState(false);

  async function respond(status: "accepted" | "declined") {
    if (loading || saved) return;
    setLoading(status);
    setErrorMessage("");

    try {
    const supabase = createSupabaseBrowserClient();

    const { data: updatedRequest, error } = await supabase
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

    if (error || !updatedRequest) {
      setErrorMessage(
        "Žiadosť sa nepodarilo aktualizovať. Skúste to prosím znova."
      );
      setLoading(null);
      return;
    }

    setSaved(true);
    router.refresh();
    } catch {
      setErrorMessage("Odpoveď sa nepodarilo uložiť. Skúste znova alebo kontaktujte Mundus.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading !== null || saved}
          onClick={() => respond("accepted")}
          className="flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#252E82] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={16} />
          {loading === "accepted" ? "Schvaľujem..." : "Schváliť"}
        </button>

        <button
          type="button"
          disabled={loading !== null || saved}
          onClick={() => respond("declined")}
          className="flex items-center gap-2 rounded-xl border border-[#92400e]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#92400e] transition hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined"
            ? "Zamietam..."
            : "Ponechať pôvodný termín"}
        </button>
      </div>

      {saved && <p role="status" className="mt-3 text-sm text-[#2F3AA2]">Odpoveď bola uložená. Aktuálny termín nájdete v rozvrhu.</p>}

      {errorMessage && (
        <p role="alert" className="mt-3 max-w-xs text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
