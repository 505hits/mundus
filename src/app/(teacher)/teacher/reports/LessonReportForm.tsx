"use client";

import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type ExistingReport = {
  id: string;
  lesson_id: string;
  topic: string | null;
  progress: string | null;
  student_note: string | null;
  homework: string | null;
  next_focus: string | null;
  private_teacher_note: string | null;
};

type Props = {
  lessonId: string;
  studentId: string;
  existingReport: ExistingReport | null;
};

export default function LessonReportForm({
  lessonId,
  studentId,
  existingReport,
}: Props) {
  const [topic, setTéma] = useState(existingReport?.topic ?? "");
  const [progress, setPokrok] = useState(
    existingReport?.progress ?? "Good progress"
  );
  const [studentNote, setStudentNote] = useState(
    existingReport?.student_note ?? ""
  );
  const [homework, setDomáca úloha] = useState(
    existingReport?.homework ?? ""
  );
  const [nextFocus, setNextFocus] = useState(
    existingReport?.next_focus ?? ""
  );
  const [privateNote, setPrivateNote] = useState(
    existingReport?.private_teacher_note ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [saved, setUložené] = useState(Boolean(existingReport));
  const [error, setError] = useState("");

  async function saveReport() {
    setSaving(true);
    setUložené(false);
    setError("");

    const supabase = createSupabaseBrowserClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Your session has expired. Please sign in again.");
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("lesson_reports")
      .upsert(
        {
          lesson_id: lessonId,
          teacher_id: user.id,
          student_id: studentId,
          topic: topic.trim() || null,
          progress: progress || null,
          student_note: studentNote.trim() || null,
          homework: homework.trim() || null,
          next_focus: nextFocus.trim() || null,
          private_teacher_note: privateNote.trim() || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "lesson_id",
        }
      );

    if (saveError) {
      setError("We couldn't save the report. Please try again.");
      setSaving(false);
      return;
    }

    setUložené(true);
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-[#fafbf9] p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Lesson topic
          <input
            value={topic}
            onChange={(event) => setTéma(event.target.value)}
            placeholder="e.g. Past tense & conversation"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none transition focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Pokrok
          <select
            value={progress}
            onChange={(event) => setPokrok(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#183f38]"
          >
            <option>Good progress</option>
            <option>Normal progress</option>
            <option>Needs attention</option>
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2">
          Student-visible note
          <textarea
            value={studentNote}
            onChange={(event) => setStudentNote(event.target.value)}
            rows={3}
            placeholder="What went well and what should the student focus on next?"
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Domáca úloha
          <input
            value={homework}
            onChange={(event) => setDomáca úloha(event.target.value)}
            placeholder="Voliteľné"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium">
          Ďalšie zameranie
          <input
            value={nextFocus}
            onChange={(event) => setNextFocus(event.target.value)}
            placeholder="e.g. Speaking confidence"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="text-sm font-medium md:col-span-2">
          Súkromná poznámka lektora
          <textarea
            value={privateNote}
            onChange={(event) => setPrivateNote(event.target.value)}
            rows={2}
            placeholder="Visible only to teachers and Mundus admin"
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#183f38]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveReport}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12332d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving
            ? "Ukladám..."
            : existingReport
              ? "Update report"
              : "Save lesson report"}
        </button>

        {saved && !saving && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#527064]">
            <CheckCircle2 size={17} />
            Uložené
          </span>
        )}

        {error && (
          <p className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
