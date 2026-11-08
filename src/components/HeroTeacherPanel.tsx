"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroTeacherPanel() {
 const {language}=useLanguage(); const sk=language==="sk";
 return <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
  <div aria-hidden="true" className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#6D78EC]/35 via-[#5361D4]/10 to-transparent blur-2xl"/>
  <div className="relative grid grid-cols-[1.2fr_.8fr] gap-3 rounded-[2rem] border border-white/15 bg-white/[.09] p-3 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-4">
   <div className="relative col-span-2 h-[250px] overflow-hidden rounded-[1.4rem] bg-[#E6E3F1] sm:h-[315px]">
    <Image src="/images/mundus/DfPIUSjjVZf.webp" alt={sk?"Fotografia z predstavenia lektora na Mundus Instagrame":"Photo from a Mundus teacher introduction"} fill sizes="(max-width:640px) 92vw,550px" className="object-cover" priority/>
    <div className="absolute inset-0 bg-gradient-to-t from-[#10182E]/85 via-transparent to-transparent"/>
    <div className="absolute bottom-5 left-5 right-5 text-white"><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#DCE1FF]">Mundus people</p><p className="mt-1 max-w-sm text-2xl font-semibold leading-tight !text-white sm:text-3xl">{sk?"Spoznajte ľudí, ktorí vás rozrozprávajú.":"Meet the people who help you speak."}</p></div>
   </div>
   <div className="relative min-h-[185px] overflow-hidden rounded-[1.3rem] bg-[#D5DEF1] sm:min-h-[235px]">
    <Image src="/images/mundus/DdjYZh5DVIB.webp" alt={sk?"Ďalšia skutočná fotografia z Mundus Instagramu":"Another real photo from Mundus Instagram"} fill sizes="(max-width:640px) 50vw,270px" className="object-cover"/>
   </div>
   <div className="flex min-w-0 flex-col justify-between rounded-[1.3rem] bg-[#DDE8E5] p-3.5 text-[#17473D] sm:p-5">
    <Sparkles size={22}/>
    <div><p className="text-lg font-semibold leading-tight tracking-tight sm:text-2xl">{sk?"Skutoční lektori.":"Real teachers."}</p><p className="mt-2 text-xs leading-5">{sk?"Individuálny prístup a hodiny podľa vašich cieľov.":"Personal attention and lessons built around your goals."}</p></div>
    <Link href={`/${language}/teachers`} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17473D] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#245E50] sm:text-sm"><GraduationCap size={17}/>{sk?"Spoznať lektorov":"Meet the teachers"}<ArrowRight size={15}/></Link>
   </div>
  </div>
 </div>;
}
