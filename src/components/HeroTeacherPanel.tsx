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
    <div className="relative col-span-2 h-[290px] overflow-hidden rounded-[1.6rem] bg-[#E4E2EF] sm:h-[410px]">
     <Image src="/images/mundus/DWQ3XM8DQ9W.webp" fill priority sizes="(max-width:640px) 92vw,570px" alt={sk?"Moment z Mundus Instagramu":"A real Mundus Instagram moment"} className="object-cover object-center"/>
     <div className="absolute inset-0 bg-gradient-to-t from-[#141B30]/80 via-transparent to-transparent"/>
     <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"><MessageCircle size={14}/>{sk?"Jazyk v každodennom živote":"Language for real life"}</div>
      <p className="max-w-sm text-2xl font-semibold leading-[1.09] tracking-tight !text-white sm:text-[2rem]">{sk?"Rozprávajte prirodzene.":"Find your voice."}</p>
     </div>
    </div>
    <div className="relative min-h-[188px] overflow-hidden rounded-[1.4rem] bg-[#DCE4F7] sm:min-h-[230px]">
     <Image src="/images/mundus/DYSRMMnNZbh.webp" fill sizes="(max-width:640px) 54vw,325px" alt={sk?"Moment z komunity Mundus":"A Mundus community moment"} className="object-cover object-center"/>
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
