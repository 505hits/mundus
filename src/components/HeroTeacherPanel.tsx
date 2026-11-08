"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ExternalLink, GraduationCap, Play, Video, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Licensed illustrative photography. These are not Mundus students or teachers.
// The linked Instagram post presents a real Mundus team member.
const imagery = {
  conversation: "https://images.unsplash.com/photo-1758876020491-9560594ec362?auto=format&fit=crop&w=1000&q=82",
  student: "https://images.unsplash.com/photo-1758874385197-07d99c183a6f?auto=format&fit=crop&w=600&q=80",
};
const teacherPost = "DfPIUSjjVZf";
const teacherUrl = `https://www.instagram.com/p/${teacherPost}/`;

export default function HeroTeacherPanel() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const [showVideo, setShowVideo] = useState(false);

  return <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
    <div aria-hidden="true" className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#6D78EC]/35 via-[#5361D4]/10 to-transparent blur-2xl" />
    <div className="relative grid grid-cols-[1.2fr_.8fr] gap-3 rounded-[2rem] border border-white/15 bg-white/[.09] p-3 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-4">
      <div className="relative col-span-2 h-[220px] overflow-hidden rounded-[1.4rem] bg-[#DAD9EE] sm:h-[280px]">
        <Image unoptimized src={imagery.conversation} alt={sk ? "Ilustračná fotografia osoby pri online konverzácii cez notebook" : "Illustrative photo of a person having an online video conversation"} fill sizes="(max-width: 640px) 90vw, 520px" className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11172C]/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-[#D2D7FF]">{sk ? "Učte sa kdekoľvek" : "Learn from anywhere"}</p><p className="mt-1 text-lg font-semibold leading-tight sm:text-2xl">{sk ? "Rozprávajte s istotou." : "Speak with confidence."}</p></div>
          <span className="rounded-full bg-white/20 p-2.5 backdrop-blur"><Video size={19}/></span>
        </div>
      </div>
      <div className="relative min-h-[170px] overflow-hidden rounded-[1.3rem] bg-[#E6E6F2] sm:min-h-[215px]">
        <Image unoptimized src={imagery.student} alt={sk ? "Ilustračná fotografia študentky na online hovore" : "Illustrative photo of a learner on a video call"} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover object-center" />
      </div>
      <div className="flex min-w-0 flex-col justify-between rounded-[1.3rem] bg-[#DDE8E5] p-3.5 text-[#17473D] sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-wider">Mundus people</span>
        <div><p className="text-lg font-semibold leading-tight tracking-tight sm:text-2xl">{sk ? "Spoznajte našich lektorov." : "Meet our teachers."}</p>
        <p className="mt-2 text-xs leading-5">{sk ? "Pozrite si skutočné predstavenie z nášho Instagramu." : "Watch a real introduction from our Instagram."}</p></div>
        <button onClick={() => setShowVideo(true)} type="button" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17473D] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#245E50] sm:text-sm"><Play size={15} fill="currentColor"/>{sk ? "Pozrieť video" : "Watch video"}</button>
      </div>
      <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-white/70 sm:text-xs">
        <span>{sk ? "Fotografie sú ilustračné; videá predstavujú skutočný Mundus." : "Photos are illustrative; the Instagram introduction is real Mundus content."}</span>
        <Link href={`/${language}/teachers`} className="inline-flex items-center gap-1.5 font-semibold text-[#DDE2FF] hover:text-white">{sk ? "Všetci lektori" : "All teachers"}<ArrowRight size={14}/></Link>
      </div>
    </div>
    {showVideo && typeof document !== "undefined" && createPortal(<div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0D1120]/85 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={sk ? "Predstavenie lektora Mundus" : "Mundus teacher introduction"} onClick={() => setShowVideo(false)}>
      <div className="relative w-full max-w-[480px] rounded-[1.5rem] bg-white p-3 shadow-2xl sm:p-5" onClick={e => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3 px-1"><p className="font-semibold text-[#171A2B]">{sk ? "Spoznajte lektora Mundus" : "Meet a Mundus teacher"}</p><button type="button" onClick={() => setShowVideo(false)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3FA]" aria-label={sk ? "Zavrieť video" : "Close video"}><X size={20}/></button></div>
        <iframe title={sk ? "Instagram video Mundus" : "Mundus Instagram video"} src={`https://www.instagram.com/p/${teacherPost}/embed/`} loading="lazy" allow="encrypted-media; picture-in-picture; web-share" className="h-[min(66dvh,560px)] w-full rounded-xl border-0 bg-white" />
        <a href={teacherUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-[#2F3AA2]">{sk ? "Otvoriť na Instagrame" : "Open on Instagram"} <ExternalLink size={16}/></a>
      </div>
    </div>, document.body)}
  </div>;
}
