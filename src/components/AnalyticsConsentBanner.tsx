"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/components/AnalyticsManager";
import { useLanguage } from "@/context/LanguageContext";

export default function AnalyticsConsentBanner(){
  const {language}=useLanguage(); const sk=language==="sk";
  const consent=useAnalyticsConsent();
  if(consent!==null) return null;
  const choose=(value:"granted"|"denied")=>setAnalyticsConsent(value);
  return <div className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-3xl rounded-3xl border border-[#DDE2FB] bg-white/95 p-5 shadow-[0_24px_70px_rgba(23,26,43,.20)] backdrop-blur-xl sm:bottom-6 sm:p-6">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]"><ShieldCheck size={19}/></span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#171A2B]">{sk?"Analytika a súkromie":"Analytics & privacy"}</p>
        <p className="mt-1 text-sm leading-6 text-gray-600">{sk?"Nevyhnutné technológie používame na fungovanie stránky. Google Analytics a Microsoft Clarity zapneme iba s vaším súhlasom, aby sme vedeli zlepšovať web a nákupný proces.":"We use necessary technology to operate the site. Google Analytics and Microsoft Clarity are enabled only with your consent so we can improve the website and purchase journey."}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button onClick={()=>choose("granted")} className="rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white">{sk?"Povoliť analytiku":"Allow analytics"}</button>
          <button onClick={()=>choose("denied")} className="rounded-xl border border-[#DDE2FB] bg-white px-4 py-3 text-sm font-semibold text-[#2F3AA2]">{sk?"Iba nevyhnutné":"Necessary only"}</button>
          <Link href="/cookies" className="px-2 py-3 text-center text-sm font-medium text-gray-500 underline underline-offset-3">{sk?"Viac informácií":"Learn more"}</Link>
        </div>
      </div>
    </div>
  </div>;
}