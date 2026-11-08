"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroTeacherPanel() {
 const { language } = useLanguage();
 const sk = language === "sk";
 return (
  <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
   <div aria-hidden="true" className="pointer-events-none absolute -inset-5 rounded-[3rem] bg-[#7381D7]/20 blur-3xl"/>
   <div className="relative grid grid-cols-[1fr_.72fr] gap-3 rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-[0_35px_90px_rgba(6,10,36,.28)] sm:gap-4 sm:p-4">
    <div className="relative col-span-2 grid min-h-[260px] grid-cols-[.9fr_1.1fr] overflow-hidden rounded-[1.6rem] bg-[#E4E8FF] sm:min-h-[345px]">
    <div className="relative z-10 flex flex-col justify-between p-4 text-[#28326F] sm:p-7">
      <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider sm:text-xs"><MessageCircle size={17}/>{sk?"Mundus komunita":"Mundus community"}</div>
      <div><p className="text-[clamp(1.45rem,4vw,2.7rem)] font-semibold leading-[1.06] tracking-[-.045em] text-[#222B6D]">{sk?"Jazyky naozaj používajte.":"Find your voice."}</p><p className="mt-3 max-w-[180px] text-xs leading-5 text-[#556093] sm:text-sm sm:leading-6">{sk?"Prirodzená komunikácia a flexibilné hodiny.":"Real conversations. Flexible lessons."}</p></div>
    </div>
    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#CFD9F3] p-3 sm:min-h-[345px] sm:p-5">
      <div className="relative h-[230px] w-full max-w-[230px] overflow-hidden rounded-[1.25rem] border-[6px] border-white bg-white shadow-[0_20px_45px_rgba(31,40,91,.18)] sm:h-[300px]">
       <Image src="/images/mundus/DWQ3XM8DQ9W.webp" fill priority sizes="230px" alt={sk?"Skutočná fotografia z Mundus Instagramu":"Real Mundus Instagram photo"} className="object-contain"/>
      </div>
    </div>
   </div>
   <div className="relative min-h-[188px] overflow-hidden rounded-[1.4rem] bg-[#DCE4F7] sm:min-h-[230px]">
     <Image src="/images/mundus/DYSRMMnNZbh.webp" fill sizes="(max-width:640px) 54vw,325px" alt={sk?"Moment z komunity Mundus":"A Mundus community moment"} className="object-contain p-2"/>
    </div>
    <Link href={`/${language}/teachers`} className="flex min-w-0 flex-col justify-between rounded-[1.4rem] bg-[#E5E6FD] p-4 text-[#27328A] transition hover:bg-[#F0F1FF] sm:p-6">
     <div className="flex items-center justify-between"><GraduationCap size={25}/><ArrowUpRight size={20}/></div>
     <div>
      <p className="text-xl font-semibold leading-tight tracking-tight sm:text-[1.65rem]">{sk?"Spoznajte našich lektorov.":"Meet our teachers."}</p>
      <p className="mt-2 text-xs leading-5 text-[#56609B] sm:text-sm">{sk?"Skutočné tváre Mundus":"Real Mundus people"}</p>
     </div>
    </Link>
   </div>
  </div>
 );
}
