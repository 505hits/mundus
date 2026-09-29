"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Props = {
  packageId: string;
  totalLessons: number;
  remainingLessons: number;
  status: string | null;
};

export default function PackageAdminActions({
  packageId,
  totalLessons,
  remainingLessons,
  status,
}: Props) {
  const router = useRouter();

  const [remaining, setRemaining] = useState(
    String(remainingLessons)
  );
  const [packageStatus, setPackageStatus] = useState(
    status || "active"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (saving) return;

    setError("");
    setSaved(false);

    const remainingValue = Number(remaining);

    if (
      !Number.isInteger(remainingValue) ||
      remainingValue < 0 ||
      remainingValue > totalLessons
    ) {
      setError(
        `Zostatok musí byť od 0 do ${totalLessons} hodín.`
      );
      return;
    }

    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const { data: updatedPackage, error: updateError } = await supabase
      .from("lesson_packages")
      .update({
        remaining_lessons: remainingValue,
        used_lessons: totalLessons - remainingValue,
        status: packageStatus,
      })
      .eq("id", packageId)
      .select("id")
      .maybeSingle();

    if (updateError || !updatedPackage) {
      setError(
        "Balíček sa nepodarilo aktualizovať. Skúste to prosím znova."
      );
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <details className="relative">
      <summary
        className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold text-[#183f38]"
        aria-label="Upraviť balíček"
      >
        <Settings2 size={15} />
        Upraviť
      </summary>

      <div className="mt-3 min-w-[230px] rounded-2xl border border-black/10 bg-[#fafbf9] p-4">
        <label className="block text-xs font-medium text-gray-600">
          Zostávajúce hodiny
          <input
            type="number"
            min={0}
            max={totalLessons}
            value={remaining}
            onChange={(event) => setRemaining(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#183f38]"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          Stav
          <select
            value={packageStatus}
            onChange={(event) => setPackageStatus(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#183f38]"
          >
            <option value="active">Aktívny</option>
            <option value="completed">Dokončený</option>
            <option value="expired">Po platnosti</option>
            <option value="cancelled">Zrušený</option>
          </select>
        </label>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-3 w-full rounded-xl bg-[#183f38] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Ukladám..." : "Uložiť zmenu"}
        </button>

        {saved && (
          <p className="mt-2 text-xs font-medium text-[#527064]">
            Uložené.
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-700">{error}</p>
        )}
      </div>
    </details>
  );
}
