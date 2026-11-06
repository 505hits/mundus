"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY="mundus_newsletter_popup_hidden_until";
const PUBLIC_PATHS=["/","/contact","/companies","/group-lessons"];

export default function NewsletterPopup(){
  const pathname=usePathname();const {language}=useLanguage();const sk=language==="sk";
  const [open,setOpen]=useState(false);
  const normalizedPath=pathname.replace(/^\\/(sk|en)(?=\\/|$)/,"")||"/";
  const allowed=PUBLIC_PATHS.includes(normalizedPath);

  const hideForDays=useCallback((days:number)=>{
    try{localStorage.setItem(STORAGE_KEY,String(Date.now()+days*24*60*60*1000));}catch{}
    setOpen(false);
  },[]);

  useEffect(()=>{
    if(!allowed)return;
    try{
      const hiddenUntil=Number(localStorage.getItem(STORAGE_KEY)||0);
      if(hiddenUntil>Date.now())return;
    }catch{}
    let shown=false;
    const show=()=>{if(shown)return;shown=true;setOpen(true);};
    const timer=window.setTimeout(show,30000);
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(max>0&&window.scrollY/max>=0.45) show();
    };
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>{window.clearTimeout(timer);window.removeEventListener("scroll",onScroll);};
  },[allowed,pathname]);

  if(!allowed||!open)return null;
  return <div className="fixed inset-x-3 bottom-20 z-[70] mx-auto max-w-xl sm:bottom-6" role="dialog" aria-modal="false" aria-labelledby="newsletter-popup-title">
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#DDE2FB] bg-white p-6 shadow-[0_24px_80px_rgba(30,35,90,0.2)] sm:p-7">
      <button onClick={()=>hideForDays(14)} aria-label={sk?"Zavrieť":"Close"} className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={19}/></button>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]"><Sparkles size={20}/></span>
      <h2 id="newsletter-popup-title" className="mt-4 pr-10 text-2xl font-semibold tracking-tight">{sk?"Nezmeškajte ďalšiu ponuku ✨":"Don’t miss the next offer ✨"}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">{sk?"Prihláste sa a ako prví sa dozviete o sezónnych zľavách, nových termínoch a novinkách z Mundus Languages. Žiadny spam.":"Join the list for occasional seasonal offers, new openings and Mundus Languages updates. No spam."}</p>
      <div className="mt-5"><NewsletterSignup source="popup" onSubscribed={()=>hideForDays(365)}/></div>
      <button onClick={()=>hideForDays(14)} className="mt-3 text-xs font-medium text-gray-400 underline underline-offset-2 hover:text-gray-700">{sk?"Teraz nie":"Not now"}</button>
    </div>
  </div>;
}
