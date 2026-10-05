"use client";

import { useActionState } from "react";
import { Star } from "lucide-react";
import { saveTeacherFeedback, type TeacherFeedbackState } from "./actions";

type Props = {
  teacherId: string;
  teacherName: string;
  feedbackMonth: string;
  initialRating?: number | null;
  initialFeedback?: string | null;
  initialCategories?: string[] | null;
};

const initialState: TeacherFeedbackState = {};

export default function TeacherFeedbackForm({
  teacherId,
  teacherName,
  feedbackMonth,
  initialRating,
  initialFeedback,
  initialCategories,
}: Props) {
  const [state, action, pending] = useActionState(saveTeacherFeedback, initialState);

  return (
    <form action={action} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <input type="hidden" name="teacher_id" value={teacherId} />
      <input type="hidden" name="feedback_month" value={feedbackMonth} />

      <div>
        <p className="text-sm text-gray-400">Lektor</p>
        <h2 className="mt-1 text-xl font-semibold">{teacherName}</h2>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-gray-700">Ako hodnotíte tento mesiac?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="rating"
                value={value}
                defaultChecked={initialRating === value}
                required
              />
              <span className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition peer-checked:border-[#2F3AA2] peer-checked:bg-[#EEF2FF] peer-checked:text-[#2F3AA2]">
                <Star size={16} fill="currentColor" />
                {value}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-gray-700">Čo oceňujete? <span className="font-normal text-gray-400">(nepovinné)</span></legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["preparation","Príprava"],
            ["explanation","Vysvetľovanie"],
            ["conversation","Konverzácia"],
            ["friendly","Prístup"],
            ["punctuality","Dochvíľnosť"],
          ].map(([value,label]) => (
            <label key={value} className="cursor-pointer">
              <input className="peer sr-only" type="checkbox" name="categories" value={value} defaultChecked={initialCategories?.includes(value)} />
              <span className="inline-flex rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition peer-checked:border-[#2F3AA2] peer-checked:bg-[#EEF2FF] peer-checked:text-[#2F3AA2]">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-gray-700">Spätná väzba pre Mundus <span className="font-normal text-gray-400">(nepovinné)</span></span>
        <textarea
          name="feedback"
          defaultValue={initialFeedback ?? ""}
          maxLength={1500}
          rows={4}
          placeholder="Čo sa vám páčilo? Čo by sme mohli zlepšiť?"
          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10"
        />
      </label>

      {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="mt-3 text-sm font-medium text-emerald-700">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Ukladám..." : initialRating ? "Aktualizovať hodnotenie" : "Odoslať hodnotenie"}
      </button>
    </form>
  );
}
