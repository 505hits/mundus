"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroTeacherPanel() {
 const {language}=useLanguage(); const sk=language==="sk";
 return <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
  <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[#7381D7]/25 blur-3xl"/>
  <div className="relative h-[305px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#C9D5EE] shadow-[0_30px_75px_rgba(0,0,0,.2)] sm:h-[475px] sm:rounded-[2.25rem]">
   <Image unoptimized src="https://images.unsplash.com/photo-1758876020491-9560594ec362?auto=format&fit=crop&w=1200&q=85" fill priority sizes="(max-width:1024px) 96vw,590px" alt={sk?"Online výučba jazykov – atmosférická fotografia":"Online language learning – editorial photograph"} className="object-cover object-center"/>
   <div className="absolute inset-0 bg-gradient-to-t from-[#10152A]/80 via-[#10152A]/5 to-transparent"/>
   <div className="absolute bottom-4 left-4 right-[135px] sm:bottom-8 sm:left-8 sm:right-52">
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur"><MessageCircle size={13}/>{sk?"Učte sa prirodzene":"Learn naturally"}</span>
    <p className="mt-3 text-xl font-semibold leading-tight tracking-[-.03em] !text-white sm:text-[2rem]">{sk?"Jazyk, ktorý naozaj využijete.":"Languages you'll actually use."}</p>
   </div>
   <Link href={`/${language}/teachers`} className="absolute bottom-4 right-4 w-[110px] overflow-hidden rounded-[1.1rem] border-[3px] border-white bg-white shadow-2xl transition hover:-translate-y-1 sm:bottom-7 sm:right-7 sm:w-[155px]">
    <div className="relative h-[118px] bg-[#DDE2F0] sm:h-[178px]"><Image src="/images/mundus/teacher-veronika.webp" fill sizes="155px" alt={sk?"Veronika, lektorka Mundus":"Veronika, Mundus teacher"} className="object-cover"/></div>
    <div className="flex items-center justify-between gap-1 p-2 text-[#1D2958] sm:p-3"><div className="min-w-0"><p className="truncate text-xs font-semibold sm:text-sm">{sk?"Spoznajte lektorov":"Meet our teachers"}</p><p className="mt-0.5 hidden text-[11px] text-[#657086] sm:block">Mundus people</p></div><ArrowUpRight size={16} className="shrink-0"/></div>
   </Link>
  </div>
 </div>;
}
