"use client";

import Link from "next/link";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/components/AnalyticsManager";
import { useLanguage } from "@/context/LanguageContext";

export default function AnalyticsConsentBanner() {
  const { language } = useLanguage();
  const consent = useAnalyticsConsent();
  if (consent !== null) return null;
  const sk = language === "sk";

  return (
    <aside aria-label={sk ? "Voľby cookies" : "Cookie choices"} className="fixed inset-x-3 bottom-[max(.5rem,env(safe-area-inset-bottom))] z-[120] mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-1.5 rounded-xl border border-[#DDE2FB] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-700">
        {sk ? "Analytické cookies používame len so súhlasom." : "Analytics cookies are optional."}{" "}
        <Link href={`/${language}/cookies`} className="underline">{sk ? "Podrobnosti" : "Details"}</Link>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => setAnalyticsConsent("denied")} className="min-h-9 rounded-lg border px-3 text-xs font-medium">{sk ? "Len nevyhnutné" : "Essential only"}</button>
        <button type="button" onClick={() => setAnalyticsConsent("granted")} className="min-h-9 rounded-lg bg-[#2F3AA2] px-3 text-xs font-medium text-white">{sk ? "Povoliť analytiku" : "Allow analytics"}</button>
      </div>
    </aside>
  );
}
