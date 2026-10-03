"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";

type Props = {
  lessonId: string;
  studentId: string;
  hasPendingRequest: boolean;
};


export default function ProposeScheduleChangeForm({
  lessonId,
  studentId,
  hasPendingRequest,
}: Props) {
  const router = useRouter();
  const [preferredAt, setPreferredAt] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (saving || sent || hasPendingRequest) return;

    setError("");
    setSent(false);

    if (!preferredAt) {
      setError("Vyberte nový dátum a čas.");
      return;
    }

    const proposed = bratislavaLocalToUtc(preferredAt);

    if (Number.isNaN(proposed.getTime())) {
      setError(INVALID_LESSON_TIME);
      return;
    }

    if (
      proposed.getTime() <= Date.now()
    ) {
      setError("Navrhovaný termín musí byť v budúcnosti.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Vaše prihlásenie vypršalo. Prihláste sa prosím znova.");
        return;
      }

      const { data: existingRequest, error: checkError } = await supabase
        .from("schedule_change_requests")
        .select("id")
        .eq("lesson_id", lessonId)
        .eq("status", "pending")
        .limit(1)
        .maybeSingle();

      if (checkError) {
        setError("Nepodarilo sa skontrolovať existujúce žiadosti. Skúste to znova.");
        return;
      }

      if (existingRequest) {
        setError("Pre túto hodinu už existuje čakajúca žiadosť o zmenu termínu.");
        return;
      }

      const { error: insertError } = await supabase
        .from("schedule_change_requests")
        .insert({
          lesson_id: lessonId,
          student_id: studentId,
          requested_by: user.id,
          preferred_at: proposed.toISOString(),
          message: message.trim() || null,
          status: "pending",
        });

      if (insertError) {
        setError("Návrh termínu sa nepodarilo odoslať. Skúste to prosím znova.");
        return;
      }

      setPreferredAt("");
      setMessage("");
      setSent(true);
      router.refresh();
    } catch {
      setError("Návrh sa nepodarilo odoslať. Skontrolujte pripojenie a skúste to znova.");
    } finally {
      setSaving(false);
    }
  }

  if (hasPendingRequest) {
    return (
      <div className="mt-3 rounded-2xl border border-[#c6a65b]/20 bg-[#faf6eb] p-4 text-sm text-[#7e693a]">
        Pre túto hodinu už existuje čakajúca žiadosť o zmenu termínu.
      </div>
    );
  }

  return (
    <details className="mt-3 rounded-2xl border border-black/5 bg-white/80 p-4 text-[#183f38]">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
        <CalendarClock size={16} />
        Navrhnúť študentovi nový termín
      </summary>

      <div className="mt-4 grid gap-4">
        <label className="text-sm font-medium">
          Navrhovaný dátum a čas
          <input
            disabled={saving}
            type="datetime-local"
            value={preferredAt}
            onChange={(event) => setPreferredAt(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Správa pre študenta <span className="font-normal text-gray-400">(voliteľné)</span>
          <textarea
            disabled={saving}
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Napríklad: Potrebovala by som presunúť hodinu na tento termín."
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving || sent}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {saving ? "Odosielam..." : "Odoslať návrh"}
        </button>

        {sent && (
          <span role="status" className="text-sm font-medium text-[#527064]">
            Návrh bol odoslaný študentovi.
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        Pôvodný termín zostane platný, kým študent nový termín nepotvrdí.
      </p>
    </details>
  );
}
