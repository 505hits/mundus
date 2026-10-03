"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { bratislavaLocalToUtc, INVALID_LESSON_TIME } from "@/lib/lesson-time";

type RequestChangeFormProps = {
  lessonId: string;
  studentId: string;
};


export default function RequestChangeForm({
  lessonId,
  studentId,
}: RequestChangeFormProps) {
  const router = useRouter();

  const [preferredAt, setPreferredAt] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!preferredAt) {
      setErrorMessage("Vyberte si prosím preferovaný dátum a čas.");
      return;
    }

    const selectedDate = bratislavaLocalToUtc(preferredAt);

    if (Number.isNaN(selectedDate.getTime())) {
      setErrorMessage(INVALID_LESSON_TIME);
      return;
    }

    if (
      selectedDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Vyberte prosím budúci dátum a čas.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("schedule_change_requests")
      .insert({
        lesson_id: lessonId,
        student_id: studentId,
        requested_by: studentId,
        preferred_at: selectedDate.toISOString(),
        message: message.trim() || null,
        status: "pending",
      });

    if (error) {
      setErrorMessage(
        "Žiadosť sa nepodarilo odoslať. Skúste to prosím znova."
      );
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    router.refresh();
    } catch {
      setErrorMessage("Žiadosť sa nepodarilo odoslať. Skúste znova alebo kontaktujte Mundus.");
    } finally {
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
          Žiadosť odoslaná
        </h2>

        <p className="mt-2 leading-7 text-gray-500">
          Lektor teraz môže vašu žiadosť skontrolovať. Pôvodný termín zostáva platný, kým nebude zmena schválená.
        </p>

        <button
          type="button"
          onClick={() => router.push("/lessons")}
          className="mt-6 rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white"
        >
          Späť na moje hodiny
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
            Preferovaný nový termín
          </p>
          <h2 className="font-semibold">
            Kedy by vám to vyhovovalo viac?
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7" aria-busy={submitting}>
        <label
          htmlFor="preferredAt"
          className="text-sm font-semibold"
        >
          Nový dátum a čas
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
          Správa pre lektora{" "}
          <span className="font-normal text-gray-400">
            (voliteľné)
          </span>
        </label>

        <textarea
          disabled={submitting}
          id="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Napríklad: Vyhovoval by vám namiesto toho utorok večer?"
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

            {submitting ? "Odosielam..." : "Odoslať žiadosť"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/lessons")}
            disabled={submitting}
            className="rounded-2xl border border-black/10 px-5 py-3.5 font-medium text-[#0a0a0f]"
          >
            Zrušiť
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-gray-400">
          Čas zadávate v časovom pásme Bratislava. Odoslaním žiadosti sa potvrdený termín automaticky nemení. Termín sa zmení až po schválení žiadosti.
        </p>
      </form>
    </section>
  );
}
