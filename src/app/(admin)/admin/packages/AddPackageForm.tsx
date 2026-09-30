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

    if (!Number.isInteger(total) || total <= 0 || total > 100) {
      setError("Počet hodín musí byť od 1 do 100.");
      return;
    }

    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const { error: insertError } = await supabase
      .from("lesson_packages")
      .insert({
        student_id: studentId,
        package_type: `${total}_lessons`,
        total_lessons: total,
        purchased_at: new Date().toISOString(),
        status: "active",
        notes: notes.trim() || null,
      });

    if (insertError) {
      setError(
        "Balíček sa nepodarilo vytvoriť. Skontrolujte údaje a skúste to znova."
      );
      setSaving(false);
      return;
    }

    setSaved(true);
    setNotes("");
    setSaving(false);
    router.refresh();
  }

  if (students.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#c6a65b]/20 bg-[#faf6eb] p-4 text-sm text-[#7e693a]">
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
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
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
            value={totalLessons}
            onChange={(event) => setTotalLessons(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
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
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            placeholder="Voliteľné"
            className="mt-2 w-full resize-none rounded-xl border border-black/10 px-3 py-2.5 font-normal outline-none focus:border-[#183f38]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={createPackage}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183f38] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PackagePlus size={17} />
          {saving ? "Pridávam..." : "Pridať balíček"}
        </button>

        {saved && (
          <span className="text-sm font-medium text-[#527064]">
            Balíček bol pridaný.
          </span>
        )}

        {error && (
          <span className="text-sm text-red-700">{error}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-400">
        Po vytvorení sa celý počet hodín nastaví ako dostupný. Využité hodiny sa budú odpočítavať po označení hodiny ako dokončenej.
      </p>
    </details>
  );
}
