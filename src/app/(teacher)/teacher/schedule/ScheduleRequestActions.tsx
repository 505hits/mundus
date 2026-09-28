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

  async function respond(status: "accepted" | "declined") {
    setLoading(status);
    setErrorMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("schedule_change_requests")
      .update({
        status,
        responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (error) {
      setErrorMessage(
        "We couldn't update this request. Please try again."
      );
      setLoading(null);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => respond("accepted")}
          className="flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12332d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={16} />
          {loading === "accepted" ? "Accepting..." : "Accept"}
        </button>

        <button
          type="button"
          disabled={loading !== null}
          onClick={() => respond("declined")}
          className="flex items-center gap-2 rounded-xl border border-[#7e693a]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#7e693a] transition hover:bg-[#f7f2e7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined"
            ? "Declining..."
            : "Keep original"}
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 max-w-xs text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
