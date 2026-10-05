"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {useLanguage} from "@/context/LanguageContext";

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
  const {language}=useLanguage(); const sk=language==="sk";

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
      !remaining.trim() ||
      !Number.isInteger(remainingValue) ||
      remainingValue < 0 ||
      remainingValue > totalLessons
    ) {
      setError(
        sk?`Zostatok musí byť od 0 do ${totalLessons} hodín.`:`Remaining lessons must be between 0 and ${totalLessons}.`
      );
      return;
    }

    if (remainingValue > 0 && packageStatus === "completed") {
      setError(sk?"Balíček so zostávajúcimi hodinami nemožno označiť ako dokončený.":"A package with remaining lessons cannot be marked completed.");
      return;
    }

    const normalizedStatus =
      remainingValue === 0 && packageStatus === "active"
        ? "completed"
        : packageStatus;

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { data: updatedPackage, error: updateError } = await supabase
        .from("lesson_packages")
        .update({
          remaining_lessons: remainingValue,
          used_lessons: totalLessons - remainingValue,
          status: normalizedStatus,
        })
        .eq("id", packageId)
        .eq("remaining_lessons", remainingLessons)
        .select("id")
        .maybeSingle();

      if (updateError || !updatedPackage) {
        setError(
          sk?"Balíček sa nepodarilo aktualizovať. Obnovte stránku a skontrolujte aktuálny zostatok.":"The package could not be updated. Refresh the page and check the current balance."
        );
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError(sk?"Uloženie sa nepodarilo. Skontrolujte pripojenie a skúste to znova.":"Saving failed. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="relative">
      <summary
        className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold text-[#0a0a0f]"
        aria-label={sk?"Upraviť balíček":"Edit package"}
      >
        <Settings2 size={15} />
        {sk?"Upraviť":"Edit"}
      </summary>

      <div className="mt-3 min-w-[230px] rounded-2xl border border-black/10 bg-[#FAFAF9] p-4">
        <label className="block text-xs font-medium text-gray-600">
          {sk?"Zostávajúce hodiny":"Remaining lessons"}
          <input
            disabled={saving}
            type="number"
            min={0}
            max={totalLessons}
            value={remaining}
            onChange={(event) => { setRemaining(event.target.value); setSaved(false); }}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#2F3AA2]"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-gray-600">
          {sk?"Stav":"Status"}
          <select
            disabled={saving}
            value={packageStatus}
            onChange={(event) => { setPackageStatus(event.target.value); setSaved(false); }}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#2F3AA2]"
          >
            <option value="active">{sk?"Aktívny":"Active"}</option>
            <option value="completed">{sk?"Dokončený":"Completed"}</option>
            <option value="expired">{sk?"Po platnosti":"Expired"}</option>
            <option value="cancelled">{sk?"Zrušený":"Cancelled"}</option>
          </select>
        </label>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-3 w-full rounded-xl bg-[#2F3AA2] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving?(sk?"Ukladám...":"Saving..."):(sk?"Uložiť zmenu":"Save change")}
        </button>

        {saved && (
          <p role="status" className="mt-2 text-xs font-medium text-[#3730A3]">
            {sk?"Uložené.":"Saved."}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>
        )}
      </div>
    </details>
  );
}
