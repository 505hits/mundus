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

  async function respond(status: "accepted" | "declined") {
    if (loading) return;

    setLoading(status);
    setError("");

    const supabase = createSupabaseBrowserClient();

    const { error: updateError } = await supabase
      .from("schedule_change_requests")
      .update({
        status,
        responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (updateError) {
      setError("Odpoveď sa nepodarilo uložiť. Skúste to prosím znova.");
      setLoading(null);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => respond("accepted")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={16} />
          {loading === "accepted" ? "Potvrdzujem..." : "Potvrdiť nový termín"}
        </button>

        <button
          type="button"
          onClick={() => respond("declined")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#183f38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined" ? "Odmietam..." : "Ponechať pôvodný termín"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
