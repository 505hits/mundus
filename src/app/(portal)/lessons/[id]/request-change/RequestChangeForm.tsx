"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

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

    if (!preferredAt) {
      setErrorMessage("Please choose your preferred date and time.");
      return;
    }

    const selectedDate = new Date(preferredAt);

    if (selectedDate.getTime() <= Date.now()) {
      setErrorMessage("Please choose a future date and time.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

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
        "We couldn't send your request. Please try again."
      );
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    router.refresh();
  }

  if (success) {
    return (
      <section className="mt-6 rounded-3xl border border-[#dfe8e2] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ef] text-[#183f38]">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-semibold">
          Request sent
        </h2>

        <p className="mt-2 leading-7 text-gray-500">
          Your teacher can now review your schedule change request.
          Your current lesson stays confirmed until the change is
          accepted.
        </p>

        <button
          type="button"
          onClick={() => router.push("/lessons")}
          className="mt-6 rounded-2xl bg-[#183f38] px-5 py-3 font-semibold text-white"
        >
          Back to my lessons
        </button>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#f7f2e7] p-3 text-[#9a8049]">
          <CalendarDays size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Preferred new time
          </p>
          <h2 className="font-semibold">
            When would work better?
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7">
        <label
          htmlFor="preferredAt"
          className="text-sm font-semibold"
        >
          New date and time
        </label>

        <input
          id="preferredAt"
          type="datetime-local"
          required
          value={preferredAt}
          onChange={(event) => setPreferredAt(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#183f38]"
        />

        <label
          htmlFor="message"
          className="mt-6 block text-sm font-semibold"
        >
          Message to your teacher{" "}
          <span className="font-normal text-gray-400">
            (optional)
          </span>
        </label>

        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="For example: Would Tuesday evening work instead?"
          className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#183f38]"
        />

        {errorMessage && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#183f38] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={17} />

            {submitting ? "Sending..." : "Send request"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/lessons")}
            disabled={submitting}
            className="rounded-2xl border border-black/10 px-5 py-3.5 font-medium text-[#183f38]"
          >
            Cancel
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-gray-400">
          Sending a request does not automatically change your
          confirmed lesson. The schedule changes only after the
          request is accepted.
        </p>
      </form>
    </section>
  );
}
