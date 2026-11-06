"use client";
import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/components/AnalyticsManager";

export default function AnalyticsConsentSettings({sk}:{sk:boolean}){
  const [value,setValue]=useState<AnalyticsConsent>(null);
  useEffect(()=>setValue(getAnalyticsConsent()),[]);
  const update=(next:"granted"|"denied")=>{setAnalyticsConsent(next);setValue(next);};
  const status = value==="granted" ? (sk?"povolená":"allowed") : value==="denied" ? (sk?"zakázaná":"disabled") : (sk?"nezvolená":"not chosen");
  return <div className="rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] p-5">
    <p className="font-semibold text-[#171A2B]">{sk?"Nastavenie analytiky":"Analytics preference"}</p>
    <p className="mt-1 text-sm text-gray-600">{sk?"Aktuálne":"Current"}: {status}.</p>
    <div className="mt-4 flex flex-wrap gap-2">
      <button onClick={()=>update("granted")} className="rounded-xl bg-[#2F3AA2] px-4 py-2.5 text-sm font-semibold text-white">{sk?"Povoliť analytiku":"Allow analytics"}</button>
      <button onClick={()=>update("denied")} className="rounded-xl border border-[#DDE2FB] bg-white px-4 py-2.5 text-sm font-semibold text-[#2F3AA2]">{sk?"Zakázať analytiku":"Disable analytics"}</button>
    </div>
  </div>;
}