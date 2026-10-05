"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PaymentStatusRefresh() {
  const router = useRouter();
  const [stopped, setStopped] = useState(false);
  const [refreshing, startTransition] = useTransition();
  useEffect(() => {
    let checks = 0;
    const timer = setInterval(() => {
      router.refresh();
      if (++checks >= 12) {
        clearInterval(timer);
        setStopped(true);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [router]);
  return <div className="mt-3 space-y-3">
    <p role="status" className="text-sm text-gray-500">{stopped
      ? "Automatické kontroly sa skončili. Stav môžete skontrolovať tlačidlom alebo neskôr v prehľade balíčkov."
      : "Stav sa priebežne obnovuje. Pri pomalšej platbe ho môžete skontrolovať aj neskôr v prehľade balíčkov."}</p>
    <button type="button" disabled={refreshing} onClick={() => startTransition(() => router.refresh())}
      className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold disabled:opacity-50">
      {refreshing ? "Kontrolujem…" : "Skontrolovať teraz"}
    </button>
    {stopped && <p className="text-sm text-gray-500">Ak platba odišla, nezačínajte ďalšiu platbu za ten istý balíček. Ak sa hodiny nepripíšu, <a href="/contact" className="font-semibold underline">kontaktujte Mundus</a>.</p>}
  </div>;
}
