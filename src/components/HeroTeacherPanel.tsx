"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, GraduationCap, Heart, Instagram, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/components/AnalyticsManager";

const postUrl = "https://www.instagram.com/p/DfPIUSjjVZf/";

export default function HeroTeacherPanel() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const consent = useAnalyticsConsent();
  return <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
    <div aria-hidden="true" className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#6D78EC]/45 via-[#5361D4]/10 to-transparent blur-2xl"/>
    <div className="relative grid gap-3 rounded-[2rem] border border-white/15 bg-white/[.09] p-3 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-4">
      <div className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-[#F6F3EE] px-4 py-3 text-[#171A2B]">
        <div><span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#4652A8]">Mundus people</span><p className="mt-1 text-base font-semibold sm:text-lg">{sk ? "Učte sa s reálnymi ľuďmi." : "Learn with real people."}</p></div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE2FF] text-[#2F3AA2]"><Heart size={19}/></span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,.72fr)] gap-3">
        <div className="relative min-h-[264px] overflow-hidden rounded-[1.4rem] bg-[#E6E4FF] sm:min-h-[350px]">
          {consent === "granted" ?
            <iframe title={sk ? "Skutočné predstavenie lektora Mundus na Instagrame" : "Real Mundus teacher introduction on Instagram"} src="https://www.instagram.com/p/DfPIUSjjVZf/embed/" loading="lazy" className="h-full min-h-[350px] w-full border-0 bg-white" allow="encrypted-media; picture-in-picture; web-share" /> :
            <div className="flex h-full min-h-[264px] flex-col justify-between bg-gradient-to-br from-[#CBC6F3] via-[#EAE6FA] to-[#F8E8D6] p-4 text-[#222550]">
              <Instagram size={23}/>
              <div><p className="max-w-[180px] text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{sk ? "Spoznajte našich lektorov." : "Meet your future teachers."}</p><p className="mt-2 text-xs leading-5">{sk ? "Skutočné predstavenia na Mundus Instagrame" : "Real introductions from the Mundus Instagram"}</p></div>
              <button type="button" onClick={() => setAnalyticsConsent("granted")} className="rounded-xl bg-[#252E82] px-3 py-3 text-xs font-semibold text-white">{sk ? "Zobraziť Instagram" : "Show Instagram"}</button>
            </div>}
          <a href={postUrl} target="_blank" rel="noopener noreferrer" aria-label={sk ? "Otvoriť predstavenie na Instagrame" : "Open introduction on Instagram"} className="absolute right-2 top-2 rounded-full bg-white p-2 text-[#2F3AA2] shadow"><ExternalLink size={15}/></a>
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-1 flex-col justify-between rounded-[1.4rem] bg-[#DDE8E5] p-3.5 text-[#17473D] sm:p-5">
            <Sparkles size={22}/>
            <div><p className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{sk ? "Hodiny podľa vás." : "Lessons built around you."}</p><p className="mt-2 text-xs leading-5">{sk ? "Ciele, tempo aj čas." : "Your goals. Your pace."}</p></div>
          </div>
          <div className="flex flex-1 flex-col justify-between rounded-[1.4rem] bg-[#F7D8C9] p-3.5 text-[#653D36] sm:p-5">
            <MessageCircle size={22}/>
            <div><p className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{sk ? "Viac rozprávania." : "More real conversation."}</p><p className="mt-2 text-xs leading-5">{sk ? "Menej zbytočnej teórie." : "Less unnecessary theory."}</p></div>
          </div>
        </div>
      </div>
      <Link href={`/${language}/teachers`} className="flex min-h-12 items-center justify-between gap-2 rounded-[1.1rem] bg-[#F6F3EE] px-4 py-3 text-sm font-semibold text-[#263399] transition hover:bg-white"><span className="inline-flex items-center gap-2"><GraduationCap size={19}/>{sk ? "Spoznajte všetkých lektorov" : "Meet all our teachers"}</span><ArrowRight size={17}/></Link>
    </div>
  </div>;
}
