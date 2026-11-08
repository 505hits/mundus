"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, UserRound, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LearningFormatsSection() {
 const {language}=useLanguage();
 const sk=language==="sk";
 const prefix=`/${language}`;
 const cards=[
  {icon:UserRound,number:"01",eyebrow:sk?"Pre vás":"Just for you",title:sk?"Individuálne 1:1":"One-to-one lessons",text:sk?"Sústredíme sa na vaše ciele, tempo aj čas.":"Your goals, your pace, your schedule.",href:`${prefix}/pricing`,cta:sk?"Vybrať balíček":"Find your package",img:"https://images.unsplash.com/photo-1758874385197-07d99c183a6f?auto=format&fit=crop&w=900&q=84",background:"bg-[#E9E8FF]",ink:"text-[#282B71]",details:sk?"45 alebo 60 min · Flexibilne":"45 or 60 min · Flexible"},
  {icon:Users,number:"02",eyebrow:sk?"Učte sa spolu":"Learn together",title:sk?"Súkromné skupiny":"Private groups",text:sk?"Hodiny pre 2–5 priateľov alebo kolegov.":"Lessons for 2–5 friends or colleagues.",href:`${prefix}/group-lessons`,cta:sk?"Skupinové hodiny":"Group lessons",img:"https://images.unsplash.com/photo-1758270705518-b61b40527e76?auto=format&fit=crop&w=900&q=84",background:"bg-[#E2EFE7]",ink:"text-[#1B5A49]",details:sk?"Vlastná skupina · Na mieru":"Your own group · Tailored"},
  {icon:Building2,number:"03",eyebrow:sk?"Pre váš tím":"For your team",title:sk?"Pre firmy":"For companies",text:sk?"Praktická komunikácia, ktorú využijete v práci.":"Practical communication that works at work.",href:`${prefix}/companies`,cta:sk?"Firemná výučba":"Corporate training",img:"https://images.unsplash.com/photo-1758876020491-9560594ec362?auto=format&fit=crop&w=900&q=84",background:"bg-[#F5E7DF]",ink:"text-[#7F453C]",details:sk?"Flexibilne · Pre HR":"Flexible · Built for HR"}
 ];
 return <section id="learning-formats" className="relative overflow-hidden bg-[#F7F8FC] px-4 py-16 sm:px-6 sm:py-24">
  <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[45rem] -translate-x-1/2 rounded-full bg-[#DDE2FB]/55 blur-3xl"/>
  <div className="relative mx-auto max-w-6xl">
   <div className="max-w-3xl">
    <p className="text-xs font-bold uppercase tracking-[.17em] text-[#2F3AA2]">{sk?"Vyberte si svoju cestu":"Find your way"}</p>
    <h2 className="mt-3 text-[clamp(2rem,5.4vw,3.1rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Jazyky do skutočného života.":"Languages for real life."}</h2>
    <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">{sk?"Sami, s priateľmi alebo cez firmu. Vyberte si formát, ktorý vám sedí.":"On your own, with friends, or through work. Find the format that fits."}</p>
   </div>
   <div className="mt-8 grid gap-4 lg:grid-cols-3">
    {cards.map(card=>{const Icon=card.icon;return <article key={card.href} className={`group flex min-w-0 flex-col overflow-hidden rounded-[1.8rem] p-5 shadow-[0_12px_35px_rgba(23,26,43,.06)] transition hover:-translate-y-1 hover:shadow-xl sm:p-6 ${card.background}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-2 text-xs font-bold ${card.ink}`}><Icon size={16}/>{card.eyebrow}</span>
        <span className={`text-xs font-bold ${card.ink}`}>{card.number}</span>
      </div>
      <div className="relative mt-5 flex h-[190px] items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/45 p-0 sm:h-[225px]">
        <div className="relative h-full w-full max-w-[270px] overflow-hidden rounded-[1.1rem] bg-white/60">
          <Image unoptimized src={card.img} fill sizes="(max-width:640px) 80vw,360px" alt={sk?"Fotografia online výučby":"Online learning photograph"} className="object-cover transition duration-500 group-hover:scale-[1.035]"/>
        </div>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${card.ink}`}>{card.details}</p>
        <h3 className="text-[clamp(1.55rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{card.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#51596C]">{card.text}</p>
        <Link href={card.href} className={`mt-5 inline-flex min-h-12 items-center justify-between gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm transition group-hover:gap-3 ${card.ink}`}>{card.cta}<ArrowUpRight size={18}/></Link>
      </div>
     </article>})}
   </div>
  </div>
 </section>;
}
