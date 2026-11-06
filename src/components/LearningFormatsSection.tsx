"use client";
import Link from "next/link";
import { Building2, UserRound, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LearningFormatsSection(){
 const {language}=useLanguage();const sk=language==="sk";
 const cards=[
  {icon:UserRound,title:sk?"Individuálne 1:1":"Individual 1:1",text:sk?"Najviac osobný formát. Vyberiete si 45 alebo 60 minút a balíček zaplatíte online.":"The most personal format. Choose 45 or 60 minutes and pay for your package online.",href:"/#buy-packages",cta:sk?"Pozrieť cenník":"View pricing"},
  {icon:Users,title:sk?"Súkromné skupiny":"Private groups",text:sk?"Pre 2–5 priateľov alebo kolegov s podobnou úrovňou. Cena sa pripraví podľa veľkosti skupiny a formátu.":"For 2–5 friends or colleagues at a similar level. Pricing is based on group size and format.",href:"/group-lessons",cta:sk?"Skupinové hodiny":"Group lessons"},
  {icon:Building2,title:sk?"Pre firmy":"For companies",text:sk?"Individuálne aj skupinové hodiny pre zamestnancov, cenová ponuka na mieru a obmedzený firemný portál na sledovanie výučby.":"Individual and group training for employees, custom pricing and a limited company portal for learning oversight.",href:"/companies",cta:sk?"Firemná výučba":"Company training"},
 ];
 return <section className="bg-[#FAFAF9] px-6 py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Formáty výučby":"Learning formats"}</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{sk?"Vyberte si spôsob, ktorý vám vyhovuje":"Choose the format that fits you"}</h2><div className="mt-9 grid gap-5 lg:grid-cols-3">{cards.map(card=>{const Icon=card.icon;return <article key={card.href} className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]"><Icon size={22}/></span><h3 className="mt-5 text-xl font-semibold">{card.title}</h3><p className="mt-2 flex-1 leading-7 text-gray-600">{card.text}</p><Link href={card.href} className="mt-6 font-semibold text-[#2F3AA2] underline underline-offset-4">{card.cta}</Link></article>})}</div></div></section>;
}
