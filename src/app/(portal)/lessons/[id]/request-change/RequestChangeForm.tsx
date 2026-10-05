"use client";

import { FormEvent, useRef, useState } from "react";
import { createRequestOnce } from "@/lib/request-creation";
import { useRouter } from "next/navigation";
import { CalendarDays, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";
import { useLanguage } from "@/context/LanguageContext";

type RequestChangeFormProps = {
  lessonId: string;
  studentId: string;
};


export default function RequestChangeForm({
  lessonId,
  studentId,
}: RequestChangeFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const sk = language === "sk";

  const [preferredAt, setPreferredAt] = useState("");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || success) return;

    if (!preferredAt) {
      setErrorMessage(sk ? "Vyberte si prosím preferovaný dátum a čas." : "Please choose your preferred date and time.");
      return;
    }

    const selectedDate = bratislavaLocalToUtc(preferredAt);

    if (Number.isNaN(selectedDate.getTime())) {
      setErrorMessage(sk ? INVALID_LESSON_TIME : "The selected lesson time is invalid.");
      return;
    }

    if (
      selectedDate.getTime() <= Date.now()
    ) {
      setErrorMessage(sk ? "Vyberte prosím budúci dátum a čas." : "Please choose a future date and time.");
      return;
    }

    busy.current = true;
    setSubmitting(true);
    setErrorMessage("");

    try {
    const supabase = createSupabaseBrowserClient();

    const details = {
      lesson_id: lessonId, student_id: studentId, requested_by: studentId,
      preferred_at: selectedDate.toISOString(), message: message.trim() || null,
    };
    const signature = JSON.stringify(details);
    if (attempt.current?.signature !== signature) {
      attempt.current = { signature, id: crypto.randomUUID() };
    }
    const id = attempt.current.id;
    const confirm = async () => {
      const { data, error } = await supabase.from("schedule_change_requests")
        .select("id,lesson_id,student_id,requested_by,preferred_at,message")
        .eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return false;
      if (data.lesson_id !== details.lesson_id || data.student_id !== details.student_id
        || data.requested_by !== details.requested_by || data.message !== details.message
        || Date.parse(data.preferred_at) !== Date.parse(details.preferred_at)) {
        throw new Error("Request conflict");
      }
      return true;
    };
    await createRequestOnce(confirm, async () => {
      const { error } = await supabase.from("schedule_change_requests")
        .insert({ ...details, id, status: "pending" }).select("id").single();
      if (error) throw error;
    });
    attempt.current = null;

    setSuccess(true);
    setSubmitting(false);
    router.refresh();
    } catch {
      setErrorMessage(sk ? "Žiadosť sa nepodarilo odoslať. Skúste znova alebo kontaktujte Mundus." : "The request could not be sent. Try again or contact Mundus.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="mt-6 rounded-3xl border border-[#E0E7FF] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#0a0a0f]">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-semibold">
          {sk ? "Žiadosť odoslaná" : "Request sent"}
        </h2>

        <p className="mt-2 leading-7 text-gray-500">
          {sk ? "Lektor teraz môže vašu žiadosť skontrolovať. Pôvodný termín zostáva platný, kým nebude zmena schválená." : "Your teacher can now review the request. The original time remains valid until the change is approved."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/lessons")}
          className="mt-6 rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white"
        >
          {sk ? "Späť na moje hodiny" : "Back to my lessons"}
        </button>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#EEF2FF] p-3 text-[#2F3AA2]">
          <CalendarDays size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-400">
            {sk ? "Preferovaný nový termín" : "Preferred new time"}
          </p>
          <h2 className="font-semibold">
            {sk ? "Kedy by vám to vyhovovalo viac?" : "When would suit you better?"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7" aria-busy={submitting}>
        <label
          htmlFor="preferredAt"
          className="text-sm font-semibold"
        >
          {sk ? "Nový dátum a čas" : "New date and time"}
        </label>

        <input
          disabled={submitting}
          id="preferredAt"
          type="datetime-local"
          required
          value={preferredAt}
          onChange={(event) => setPreferredAt(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#2F3AA2]"
        />

        <label
          htmlFor="message"
          className="mt-6 block text-sm font-semibold"
        >
          {sk ? "Správa pre lektora" : "Message for teacher"}{" "}
          <span className="font-normal text-gray-400">
            {sk ? "(voliteľné)" : "(optional)"}
          </span>
        </label>

        <textarea
          disabled={submitting}
          id="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={sk ? "Napríklad: Vyhovoval by vám namiesto toho utorok večer?" : "For example: Would Tuesday evening work instead?"}
          className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#2F3AA2]"
        />

        {errorMessage && (
          <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={17} />

            {submitting ? (sk ? "Odosielam..." : "Sending...") : (sk ? "Odoslať žiadosť" : "Send request")}
          </button>

          <button
            type="button"
            onClick={() => router.push("/lessons")}
            disabled={submitting}
            className="rounded-2xl border border-black/10 px-5 py-3.5 font-medium text-[#0a0a0f]"
          >
            {sk ? "Zrušiť" : "Cancel"}
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-gray-400">
          {sk ? "Čas zadávate v časovom pásme Bratislava. Odoslaním žiadosti sa potvrdený termín automaticky nemení. Termín sa zmení až po schválení žiadosti." : "Times are entered in the Bratislava time zone. Sending a request does not automatically change the confirmed lesson. The time changes only after approval."}
        </p>
      </form>
    </section>
  );
}
