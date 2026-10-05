"use client";

import { useRef, useState } from "react";
import { confirmScheduleResponse, ScheduleResponseError } from "@/lib/schedule-response";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  requestId: string;
};

export default function StudentScheduleRequestActions({
  requestId,
}: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const sk = language === "sk";
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);
  const [error, setError] = useState("");

  const busy = useRef(false);
  const [saved, setSaved] = useState(false);

  async function respond(status: "accepted" | "declined") {
    if (busy.current || saved) return;
    busy.current = true;

    setLoading(status);
    setError("");

    try {
    const supabase = createSupabaseBrowserClient();

    await confirmScheduleResponse(status, async () => {
      const { data, error } = await supabase.from("schedule_change_requests")
        .update({ status, responded_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", requestId).eq("status", "pending").select("id").maybeSingle();
      if (error) throw error;
      return Boolean(data);
    }, async () => {
      const { data, error } = await supabase.from("schedule_change_requests")
        .select("status").eq("id", requestId).maybeSingle();
      if (error) throw error;
      return data?.status ?? null;
    });

    setSaved(true);
    router.refresh();
    } catch (error) {
      setError(error instanceof ScheduleResponseError ? error.message : (sk ? "Odpoveď sa nepodarilo uložiť. Skúste znova alebo kontaktujte Mundus." : "The response could not be saved. Try again or contact Mundus."));
    } finally {
      busy.current = false;
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={16} />
          {loading === "accepted" ? (sk ? "Potvrdzujem..." : "Confirming...") : (sk ? "Potvrdiť nový termín" : "Confirm new time")}
        </button>

        <button
          type="button"
          onClick={() => respond("declined")}
          disabled={loading !== null || saved}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#0a0a0f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined" ? (sk ? "Odmietam..." : "Declining...") : (sk ? "Ponechať pôvodný termín" : "Keep original time")}
        </button>
      </div>

      {saved && <p role="status" className="mt-3 text-sm text-[#2F3AA2]">{sk ? "Odpoveď bola uložená. Aktuálny termín nájdete v rozvrhu." : "Your response was saved. The current lesson time is shown in your schedule."}</p>}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
