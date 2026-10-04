"use client";

import { useRef, useState } from "react";
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

function normalizeProgress(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  const map: Record<string, string> = {
    good_progress: "good_progress",
    normal_progress: "normal_progress",
    needs_attention: "needs_attention",
    "good progress": "good_progress",
    "dobrý pokrok": "good_progress",
    "normal progress": "normal_progress",
    "bežný pokrok": "normal_progress",
    "needs attention": "needs_attention",
    "vyžaduje pozornosť": "needs_attention",
    improving: "good_progress",
  };

  return (normalized && map[normalized]) || "good_progress";
}

export default function LessonReportForm({
  lessonId,
  studentId,
  existingReport,
}: Props) {
  const [topic, setTopic] = useState(existingReport?.topic ?? "");
  const [progress, setProgress] = useState(
    normalizeProgress(existingReport?.progress)
  );
  const [studentNote, setStudentNote] = useState(
    existingReport?.student_note ?? ""
  );
  const [homework, setHomework] = useState(
    existingReport?.homework ?? ""
  );
  const [nextFocus, setNextFocus] = useState(
    existingReport?.next_focus ?? ""
  );
  const [privateNote, setPrivateNote] = useState(
    existingReport?.private_teacher_note ?? ""
  );

  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(existingReport));
  const [error, setError] = useState("");

  async function saveReport() {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaved(false);
    setError("");

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

      const { data: savedReport, error: saveError } = await supabase
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
        )
        .select("id")
        .single();

      if (saveError || !savedReport?.id) {
        setError("Záznam sa nepodarilo uložiť. Skúste to prosím znova.");
        return;
      }

      setSaved(true);
    } catch {
      setError("Záznam sa nepodarilo uložiť. Skontrolujte pripojenie a skúste to znova.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-[#FAFAF9] p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Téma hodiny
          <input
            disabled={saving}
            value={topic}
            onChange={(event) => { setTopic(event.target.value); setSaved(false); }}
            placeholder="napr. minulý čas a konverzácia"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none transition focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          Pokrok
          <select
            disabled={saving}
            value={progress}
            onChange={(event) => { setProgress(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#2F3AA2]"
          >
            <option value="good_progress">Dobrý pokrok</option>
            <option value="normal_progress">Bežný pokrok</option>
            <option value="needs_attention">Vyžaduje pozornosť</option>
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2">
          Poznámka pre študenta
          <textarea
            disabled={saving}
            value={studentNote}
            onChange={(event) => { setStudentNote(event.target.value); setSaved(false); }}
            rows={3}
            placeholder="Čo sa darilo a na čo by sa mal študent zamerať ďalej?"
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          Domáca úloha
          <input
            disabled={saving}
            value={homework}
            onChange={(event) => { setHomework(event.target.value); setSaved(false); }}
            placeholder="Voliteľné"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium">
          Ďalšie zameranie
          <input
            disabled={saving}
            value={nextFocus}
            onChange={(event) => { setNextFocus(event.target.value); setSaved(false); }}
            placeholder="napr. istota pri rozprávaní"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="text-sm font-medium md:col-span-2">
          Súkromná poznámka lektora
          <textarea
            disabled={saving}
            value={privateNote}
            onChange={(event) => { setPrivateNote(event.target.value); setSaved(false); }}
            rows={2}
            placeholder="Viditeľné iba pre lektorov a administrátora Mundus"
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal text-gray-700 outline-none focus:border-[#2F3AA2]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveReport}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving
            ? "Ukladám..."
            : existingReport
              ? "Aktualizovať záznam"
              : "Uložiť záznam z hodiny"}
        </button>

        {saved && !saving && (
          <span role="status" className="flex items-center gap-1.5 text-sm font-medium text-[#3730A3]">
            <CheckCircle2 size={17} />
            Uložené
          </span>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
