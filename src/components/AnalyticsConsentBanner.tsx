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

  return <div className="fixed bottom-[max(.5rem,env(safe-area-inset-bottom))] left-3 right-3 z-[120] mx-auto max-h-[75dvh] max-w-3xl overflow-y-auto overscroll-contain rounded-[1.4rem] border border-[#DDE2FB] bg-white/95 p-4 shadow-[0_24px_70px_rgba(23,26,43,.20)] backdrop-blur-xl sm:bottom-6 sm:rounded-3xl sm:p-6">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2] sm:flex"><ShieldCheck size={19}/></span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#171A2B]">{sk?"Cookies":"Cookies"}</p>
        <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
          {sk
            ?"Používame nevyhnutné cookies, aby stránka správne fungovala. Analytické cookies od Google Analytics a Microsoft Clarity použijeme iba s vaším súhlasom, aby sme mohli zlepšovať web a nákupný proces."
            :"We use essential cookies to keep the site working properly. Analytics cookies from Google Analytics and Microsoft Clarity are used only with your consent so we can improve the website and purchase journey."}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-row sm:flex-wrap">
          <button onClick={()=>choose("granted")} className="min-h-11 rounded-xl bg-[#2F3AA2] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#252E82] sm:px-4 sm:py-3 sm:text-sm">
            {sk?"Prijať cookies":"Accept cookies"}
          </button>
          <button onClick={()=>choose("denied")} className="min-h-11 rounded-xl border border-[#DDE2FB] bg-white px-2 py-2 text-xs font-semibold text-[#2F3AA2] transition hover:bg-[#F5F6FF] sm:px-4 sm:py-3 sm:text-sm">
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