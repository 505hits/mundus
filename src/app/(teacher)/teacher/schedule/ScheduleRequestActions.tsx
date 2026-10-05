"use client";

import { useRef, useState } from "react";
import { confirmScheduleResponse, ScheduleResponseError } from "@/lib/schedule-response";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {useLanguage} from "@/context/LanguageContext";

type Props = {
  requestId: string;
};

export default function ScheduleRequestActions({
  requestId,
}: Props) {
  const router = useRouter();
  const {language}=useLanguage(); const sk=language==="sk";

  const [loading, setLoading] = useState<
    "accepted" | "declined" | null
  >(null);

  const [errorMessage, setErrorMessage] = useState("");

  const busy = useRef(false);
  const [saved, setSaved] = useState(false);

  async function respond(status: "accepted" | "declined") {
    if (busy.current || saved) return;
    busy.current = true;
    setLoading(status);
    setErrorMessage("");

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
      setErrorMessage(error instanceof ScheduleResponseError ? error.message : (sk?"Odpoveď sa nepodarilo uložiť. Skúste znova alebo kontaktujte Mundus.":"The response could not be saved. Try again or contact Mundus."));
    } finally {
      busy.current = false;
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
          {loading==="accepted"?(sk?"Schvaľujem...":"Approving..."):(sk?"Schváliť":"Approve")}
        </button>

        <button
          type="button"
          disabled={loading !== null || saved}
          onClick={() => respond("declined")}
          className="flex items-center gap-2 rounded-xl border border-[#92400e]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#92400e] transition hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={16} />
          {loading === "declined"
            ? (sk?"Zamietam...":"Declining...")
            : (sk?"Ponechať pôvodný termín":"Keep original time")}
        </button>
      </div>

      {saved && <p role="status" className="mt-3 text-sm text-[#2F3AA2]">{sk?"Odpoveď bola uložená. Aktuálny termín nájdete v rozvrhu.":"Response saved. The current lesson time is shown in the schedule."}</p>}

      {errorMessage && (
        <p role="alert" className="mt-3 max-w-xs text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
