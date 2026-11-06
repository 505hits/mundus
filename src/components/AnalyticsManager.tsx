"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY="mundus-analytics-consent";
export type AnalyticsConsent="granted"|"denied"|null;

export function getAnalyticsConsent():AnalyticsConsent{
  if(typeof window==="undefined") return null;
  const value=window.localStorage.getItem(CONSENT_KEY);
  return value==="granted"||value==="denied"?value:null;
}

export function setAnalyticsConsent(value:Exclude<AnalyticsConsent,null>){
  window.localStorage.setItem(CONSENT_KEY,value);
  window.dispatchEvent(new CustomEvent("mundus-analytics-consent",{detail:value}));
}

export function trackEvent(name:string,params:Record<string,string|number|boolean|undefined>={}){
  if(typeof window==="undefined"||getAnalyticsConsent()!=="granted") return;
  window.gtag?.("event",name,params);
  window.clarity?.("event",name);
}

export default function AnalyticsManager(){
  const pathname=usePathname();
  const [consent,setConsent]=useState<AnalyticsConsent>(null);
  const gaId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId=process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  useEffect(()=>{
    setConsent(getAnalyticsConsent());
    const handler=(event:Event)=>setConsent((event as CustomEvent<Exclude<AnalyticsConsent,null>>).detail);
    window.addEventListener("mundus-analytics-consent",handler);
    return()=>window.removeEventListener("mundus-analytics-consent",handler);
  },[]);
  useEffect(()=>{
    if(consent!=="granted"||!gaId||!window.gtag) return;
    window.gtag("event","page_view",{page_path:pathname});
  },[consent,gaId,pathname]);
  if(consent!=="granted") return null;
  return <>
    {gaId&&<>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/>
      <Script id="mundus-ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", "${gaId}", { send_page_view: true, anonymize_ip: true });
      `}</Script>
    </>}
    {clarityId&&<Script id="mundus-clarity" strategy="afterInteractive">{`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `}</Script>}
  </>;
}