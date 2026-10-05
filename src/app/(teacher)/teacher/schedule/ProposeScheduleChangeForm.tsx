"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language } = useLanguage();
  const sk = language === "sk";
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
      setError(sk ? "Vyberte nový dátum a čas." : "Choose a new date and time.");
      return;
    }

    const proposed = bratislavaLocalToUtc(preferredAt);

    if (Number.isNaN(proposed.getTime())) {
      setError(sk ? INVALID_LESSON_TIME : "The proposed lesson time is invalid.");
      return;
    }

    if (
      proposed.getTime() <= Date.now()
    ) {
      setError(sk ? "Navrhovaný termín musí byť v budúcnosti." : "The proposed time must be in the future.");
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
        setError(sk ? "Vaše prihlásenie vypršalo. Prihláste sa prosím znova." : "Your session expired. Please sign in again.");
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
        setError(sk ? "Nepodarilo sa skontrolovať existujúce žiadosti. Skúste to znova." : "Existing requests could not be checked. Please try again.");
        return;
      }

      if (existingRequest) {
        setError(sk ? "Pre túto hodinu už existuje čakajúca žiadosť o zmenu termínu." : "A schedule-change request is already pending for this lesson.");
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
        setError(sk ? "Návrh termínu sa nepodarilo odoslať. Skúste to prosím znova." : "The proposed time could not be sent. Please try again.");
        return;
      }

      setPreferredAt("");
      setMessage("");
      setSent(true);
      router.refresh();
    } catch {
      setError(sk ? "Návrh sa nepodarilo odoslať. Skontrolujte pripojenie a skúste to znova." : "The proposal could not be sent. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (hasPendingRequest) {
    return (
      <div className="mt-3 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4 text-sm text-[#92400e]">
        {sk ? "Pre túto hodinu už existuje čakajúca žiadosť o zmenu termínu." : "A schedule-change request is already pending for this lesson."}
      </div>
    );
  }

  return (
    <details className="mt-3 rounded-2xl border border-black/5 bg-white/80 p-4 text-[#0a0a0f]">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
        <CalendarClock size={16} />
        {sk ? "Navrhnúť študentovi nový termín" : "Propose a new time to the student"}
      </summary>

      <div className="mt-4 grid gap-4">
        <label className="text-sm font-medium">
          {sk ? "Navrhovaný dátum a čas" : "Proposed date and time"}
          <input
            disabled={saving}
            type="datetime-local"
            value={preferredAt}
            onChange={(event) => setPreferredAt(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          {sk ? "Správa pre študenta" : "Message for student"} <span className="font-normal text-gray-400">{sk ? "(voliteľné)" : "(optional)"}</span>
          <textarea
            disabled={saving}
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={sk ? "Napríklad: Potrebovala by som presunúť hodinu na tento termín." : "For example: I need to move the lesson to this time."}
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving || sent}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {saving ? (sk ? "Odosielam..." : "Sending...") : (sk ? "Odoslať návrh" : "Send proposal")}
        </button>

        {sent && (
          <span role="status" className="text-sm font-medium text-[#3730A3]">
            {sk ? "Návrh bol odoslaný študentovi." : "The proposal was sent to the student."}
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        {sk ? "Pôvodný termín zostane platný, kým študent nový termín nepotvrdí." : "The original time remains valid until the student confirms the new one."}
      </p>
    </details>
  );
}
