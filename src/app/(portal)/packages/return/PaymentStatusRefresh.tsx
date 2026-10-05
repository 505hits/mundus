"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentStatusRefresh() {
  const router = useRouter();
  const { language } = useLanguage();
  const sk = language === "sk";
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
      ? (sk ? "Automatické kontroly sa skončili. Stav môžete skontrolovať tlačidlom alebo neskôr v prehľade balíčkov." : "Automatic checks have stopped. You can check the status with the button or later in your package overview.")
      : (sk ? "Stav sa priebežne obnovuje. Pri pomalšej platbe ho môžete skontrolovať aj neskôr v prehľade balíčkov." : "The status is refreshing automatically. For slower payments, you can also check later in your package overview.")}</p>
    <button type="button" disabled={refreshing} onClick={() => startTransition(() => router.refresh())}
      className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold disabled:opacity-50">
      {refreshing ? (sk ? "Kontrolujem…" : "Checking…") : (sk ? "Skontrolovať teraz" : "Check now")}
    </button>
    {stopped && <p className="text-sm text-gray-500">{sk ? "Ak platba odišla, nezačínajte ďalšiu platbu za ten istý balíček. Ak sa hodiny nepripíšu, " : "If the payment went through, do not start another payment for the same package. If the lessons do not appear, "}<a href="/contact" className="font-semibold underline">{sk ? "kontaktujte Mundus" : "contact Mundus"}</a>.</p>}
  </div>;
}
