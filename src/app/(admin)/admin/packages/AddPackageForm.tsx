"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {useLanguage} from "@/context/LanguageContext";

type StudentOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Props = {
  students: StudentOption[];
};

const packageSizes = [1, 5, 10, 20, 30];

export default function AddPackageForm({ students }: Props) {
  const router = useRouter();
  const {language}=useLanguage(); const sk=language==="sk";

  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [totalLessons, setTotalLessons] = useState("10");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function createPackage() {
    if (saving) return;

    setError("");
    setSaved(false);

    if (!studentId) {
      setError(sk?"Vyberte študenta.":"Choose a student.");
      return;
    }

    const total = Number(totalLessons);

    if (!packageSizes.includes(total)) {
      setError(sk?"Vyberte balíček s 1, 5, 10, 20 alebo 30 hodinami.":"Choose a package with 1, 5, 10, 20 or 30 lessons.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: insertError } = await supabase
        .from("lesson_packages")
        .insert({
          student_id: studentId,
          package_type: `${total}_lessons`,
          total_lessons: total,
          used_lessons: 0,
          remaining_lessons: total,
          purchased_at: new Date().toISOString(),
          status: "active",
          notes: notes.trim() || null,
        });

      if (insertError) {
        setError(
          sk?"Balíček sa nepodarilo vytvoriť. Skontrolujte údaje a skúste to znova.":"The package could not be created. Check the details and try again."
        );
        return;
      }

      setSaved(true);
      setNotes("");
      router.refresh();
    } catch {
      setError(sk?"Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.":"Saving failed. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (students.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4 text-sm text-[#92400e]">
        {sk?"Balíček zatiaľ nemožno pridať, pretože nie je dostupný žiadny aktívny študent.":"A package cannot be added because no active student is available."}
      </div>
    );
  }

  return (
    <details className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <PackagePlus size={19} />
        {sk?"Pridať balíček":"Add package"}
      </summary>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          {sk?"Študent":"Student"}
          <select
            disabled={saving}
            value={studentId}
            onChange={(event) => { setStudentId(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name?.trim() || student.email || (sk?"Študent":"Student")}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          {sk?"Počet hodín":"Number of lessons"}
          <select
            disabled={saving}
            value={totalLessons}
            onChange={(event) => { setTotalLessons(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {packageSizes.map((size) => (
              <option key={size} value={size}>
                {size} {sk?(size===1?"hodina":"hodín"):(size===1?"lesson":"lessons")}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2">
          {sk?"Interná poznámka":"Internal note"}
          <textarea
            disabled={saving}
            value={notes}
            onChange={(event) => { setNotes(event.target.value); setSaved(false); }}
            rows={2}
            placeholder={sk?"Voliteľné":"Optional"}
            className="mt-2 w-full resize-none rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={createPackage}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PackagePlus size={17} />
          {saving?(sk?"Pridávam...":"Adding..."):(sk?"Pridať balíček":"Add package")}
        </button>

        {saved && (
          <span role="status" className="text-sm font-medium text-[#3730A3]">
            {sk?"Balíček bol pridaný.":"Package added."}
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        {sk?"Po vytvorení sa celý počet hodín nastaví ako dostupný. Využité hodiny sa budú odpočítavať po označení hodiny ako dokončenej.":"After creation, the full lesson count is available. Used lessons are deducted when a lesson is marked completed."}
      </p>
    </details>
  );
}
