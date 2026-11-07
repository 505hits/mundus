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
  const prefix=`/${language}`;

  return <div className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-3xl rounded-3xl border border-[#DDE2FB] bg-white/95 p-5 shadow-[0_24px_70px_rgba(23,26,43,.20)] backdrop-blur-xl sm:bottom-6 sm:p-6">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]"><ShieldCheck size={19}/></span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#171A2B]">{sk?"Cookies":"Cookies"}</p>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {sk
            ?"Používame nevyhnutné cookies, aby stránka správne fungovala. Analytické cookies od Google Analytics a Microsoft Clarity použijeme iba s vaším súhlasom, aby sme mohli zlepšovať web a nákupný proces."
            :"We use essential cookies to keep the site working properly. Analytics cookies from Google Analytics and Microsoft Clarity are used only with your consent so we can improve the website and purchase journey."}
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button onClick={()=>choose("granted")} className="rounded-xl bg-[#2F3AA2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]">
            {sk?"Prijať analytické cookies":"Accept analytics"}
          </button>
          <button onClick={()=>choose("denied")} className="rounded-xl border border-[#DDE2FB] bg-white px-4 py-3 text-sm font-semibold text-[#2F3AA2] transition hover:bg-[#F5F6FF]">
            {sk?"Len nevyhnutné cookies":"Essential only"}
          </button>
        </div>

        <Link href={`${prefix}/cookies`} className="mt-3 inline-flex text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-[#2F3AA2]">
          {sk?"Nastavenia a informácie o cookies":"Cookie settings & information"}
        </Link>
      </div>
    </div>
  </div>;
}