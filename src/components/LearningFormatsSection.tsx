"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, UserRound, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LearningFormatsSection(){
  const {language}=useLanguage();const sk=language==="sk";const prefix=`/${language}`;
  const cards=[
    {icon:UserRound,eyebrow:sk?"Najobľúbenejšie":"Most popular",title:sk?"Individuálne 1:1":"Individual 1:1",text:sk?"45- alebo 60-minútové hodiny podľa vašich potrieb a času.":"45- or 60-minute lessons, tailored to your goals and schedule.",href:`${prefix}/pricing`,cta:sk?"Vybrať balíček":"Choose a package",img:"/images/mundus/DdjYZh5DVIB.webp"},
    {icon:Users,eyebrow:sk?"2–5 osôb":"2–5 people",title:sk?"Súkromné skupiny":"Private groups",text:sk?"Priatelia alebo kolegovia, jeden spoločný cieľ a vlastné tempo.":"Friends or colleagues, a shared goal and your own pace.",href:`${prefix}/group-lessons`,cta:sk?"Skupinové hodiny":"Group lessons",img:"/images/mundus/DWQ3XM8DQ9W.webp"},
    {icon:Building2,eyebrow:"B2B",title:sk?"Pre firmy":"For companies",text:sk?"Jazykové vzdelávanie pre zamestnancov a prehľad pre HR.":"Language training for employees, with a practical overview for HR.",href:`${prefix}/companies`,cta:sk?"Firemná výučba":"Corporate training",img:"/images/mundus/DYSRMMnNZbh.webp"},
  ];
  return <section id="learning-formats" className="relative overflow-hidden bg-[#F7F8FC] px-4 py-16 sm:px-6 sm:py-24">
    <div className="absolute left-1/2 top-0 h-64 w-[46rem] -translate-x-1/2 rounded-full bg-[#DDE2FB]/55 blur-3xl"/>
    <div className="relative mx-auto max-w-6xl">
      <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.17em] text-[#2F3AA2]">{sk?"Vyberte si svoju cestu":"Find your way"}</p>
        <h2 className="mt-3 text-[clamp(2rem,5.4vw,3.1rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Jazyky do skutočného života." : "Languages for real life."}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">{sk?"Sami, s priateľmi alebo cez firmu. Vyberte si formát, ktorý sedí vám.":"On your own, with friends, or through work. Choose what suits you."}</p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {cards.map((card,i)=>{const Icon=card.icon;return <article key={card.href} className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-[#E5E7F0] bg-white shadow-[0_12px_36px_rgba(23,26,43,.06)] transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative h-48 overflow-hidden bg-[#DDE2FB] sm:h-56">
            <Image unoptimized src={card.img} alt={sk?"Fotografia z Mundus Instagramu":"Photo from Mundus Instagram"} fill sizes="(max-width: 1024px) 95vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#151A32]/40 to-transparent"/>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-[#27368E]"><Icon size={17}/>{card.eyebrow}</span>
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="text-2xl font-semibold tracking-tight text-[#171A2B]">{card.title}</h3><p className="mt-3 text-sm leading-7 text-[#646B80]">{card.text}</p>
            <Link href={card.href} className="mt-auto inline-flex min-h-12 items-center justify-between gap-2 border-t border-[#E9EAF1] pt-4 font-semibold text-[#2F3AA2] sm:mt-6">{card.cta}<ArrowUpRight size={18} className="transition group-hover:translate-x-1 group-hover:-translate-y-1"/></Link>
          </div>
        </article>})}
      </div>
      
    </div>
  </section>;
}