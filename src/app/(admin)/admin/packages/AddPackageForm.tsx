"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

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
      setError("Vyberte študenta.");
      return;
    }

    const total = Number(totalLessons);

    if (!packageSizes.includes(total)) {
      setError("Vyberte balíček s 1, 5, 10, 20 alebo 30 hodinami.");
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
          "Balíček sa nepodarilo vytvoriť. Skontrolujte údaje a skúste to znova."
        );
        return;
      }

      setSaved(true);
      setNotes("");
      router.refresh();
    } catch {
      setError("Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.");
    } finally {
      setSaving(false);
    }
  }

  if (students.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#2F3AA2]/20 bg-[#faf6eb] p-4 text-sm text-[#92400e]">
        Balíček zatiaľ nemožno pridať, pretože nie je dostupný žiadny aktívny študent.
      </div>
    );
  }

  return (
    <details className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <PackagePlus size={19} />
        Pridať balíček
      </summary>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Študent
          <select
            disabled={saving}
            value={studentId}
            onChange={(event) => { setStudentId(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name?.trim() || student.email || "Študent"}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          Počet hodín
          <select
            disabled={saving}
            value={totalLessons}
            onChange={(event) => { setTotalLessons(event.target.value); setSaved(false); }}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2F3AA2]"
          >
            {packageSizes.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "hodina" : "hodín"}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2">
          Interná poznámka
          <textarea
            disabled={saving}
            value={notes}
            onChange={(event) => { setNotes(event.target.value); setSaved(false); }}
            rows={2}
            placeholder="Voliteľné"
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
          {saving ? "Pridávam..." : "Pridať balíček"}
        </button>

        {saved && (
          <span role="status" className="text-sm font-medium text-[#3730A3]">
            Balíček bol pridaný.
          </span>
        )}

        {error && (
          <span role="alert" className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        Po vytvorení sa celý počet hodín nastaví ako dostupný. Využité hodiny sa budú odpočítavať po označení hodiny ako dokončenej.
      </p>
    </details>
  );
}
