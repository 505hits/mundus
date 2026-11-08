"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Play, X, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Illustrative images, not representations of actual Mundus clients or teachers.
// All Instagram posts below come from the Mundus profile.
const features = [
  { id:"DfPIUSjjVZf", img:"https://images.unsplash.com/photo-1758876020491-9560594ec362?auto=format&fit=crop&w=900&q=82", sk:"Spoznajte lektorov", en:"Meet the teachers", subSk:"Predstavenie z nášho Instagramu", subEn:"An introduction from our Instagram" },
  { id:"DWQ3XM8DQ9W", img:"https://images.unsplash.com/photo-1758874385197-07d99c183a6f?auto=format&fit=crop&w=900&q=82", sk:"Život v Mundus", en:"Life at Mundus", subSk:"Príspevok z našej komunity", subEn:"A post from our community" },
  { id:"DYUFE0ijV_3", img:"https://images.unsplash.com/photo-1758270705518-b61b40527e76?auto=format&fit=crop&w=900&q=82", sk:"Príbehy študentov", en:"Student stories", subSk:"Pozrite si reálne skúsenosti", subEn:"See real experiences" },
] as const;

export default function InstagramHomepageSpotlight() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const [active, setActive] = useState<(typeof features)[number] | null>(null);
  return <section id="teachers" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <span id="instagram-community" className="block scroll-mt-24" aria-hidden="true" />
      <span id="testimonials" className="block scroll-mt-24" aria-hidden="true" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk ? "Ľudia a príbehy Mundus" : "Mundus people & stories"}</p>
          <h2 className="mt-3 text-[clamp(1.85rem,6.2vw,3.1rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{sk ? "Jazyk sa učí najlepšie spolu." : "Learning is better together."}</h2>
          <p className="mt-3 text-base leading-7 text-[#62697C]">{sk ? "Spoznajte našich lektorov a komunitu prostredníctvom skutočných príspevkov Mundus." : "Meet our teachers and community through real posts from Mundus."}</p>
        </div>
        <Link href={`/${language}/teachers`} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white hover:bg-[#252E82]">
          {sk ? "Spoznať lektorov" : "Meet our teachers"} <ArrowRight size={17}/>
        </Link>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {features.map((item,i)=><button key={item.id} type="button" onClick={()=>setActive(item)} aria-label={sk ? `Zobraziť príspevok: ${item.sk}` : `Watch post: ${item.en}`} className="group relative min-h-[250px] overflow-hidden rounded-[1.5rem] bg-[#E5E6ED] text-left shadow-[0_14px_40px_rgba(23,26,43,.06)] transition hover:-translate-y-1 hover:shadow-xl sm:min-h-[310px]">
          <Image unoptimized src={item.img} alt={sk ? "Ilustračná fotografia online štúdia jazykov" : "Illustrative language learning photo"} fill sizes="(max-width: 640px) 92vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#11162B]/85 via-[#11162B]/15 to-transparent"/>
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#11162B]/50 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur"><Instagram size={14}/> Mundus Instagram</div>
          <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#2F3AA2] shadow-lg transition group-hover:scale-110"><Play size={19} fill="currentColor"/></span>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
            <h3 className="text-2xl font-semibold leading-tight !text-white">{sk?item.sk:item.en}</h3>
            <p className="mt-2 text-sm text-[#E3E7F6]">{sk?item.subSk:item.subEn}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/90">{sk?"Pozrieť príspevok":"View post"} <ArrowRight size={15}/></p>
          </div>
        </button>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-xs text-[#687086]">{sk?"Fotografie sú ilustračné. Príspevky sú z Mundus Instagramu.":"Photos are illustrative. Posts are from the Mundus Instagram."}</span>
        <Link href={`/${language}/community`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#2F3AA2] hover:underline">{sk?"Celá galéria":"Full gallery"} <ArrowRight size={16}/></Link>
      </div>
    </div>
    {active && typeof document !== "undefined" && createPortal(<div role="dialog" aria-modal="true" aria-label={sk?"Príspevok Mundus":"Mundus post"} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0D1120]/90 p-3 sm:p-6" onClick={()=>setActive(null)}>
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-3 sm:p-5" onClick={e=>e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between gap-3 px-1"><p className="font-semibold text-[#171A2B]">{sk?active.sk:active.en}</p><button type="button" onClick={()=>setActive(null)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3FA]" aria-label={sk?"Zavrieť":"Close"}><X size={20}/></button></div>
        <iframe title={sk?active.sk:active.en} src={`https://www.instagram.com/p/${active.id}/embed/`} loading="lazy" allow="encrypted-media; picture-in-picture; web-share" className="h-[min(66dvh,560px)] w-full rounded-xl border-0 bg-white"/>
        <a href={`https://www.instagram.com/p/${active.id}/`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2F3AA2]">{sk?"Otvoriť na Instagrame":"Open on Instagram"}<ExternalLink size={15}/></a>
      </div>
    </div>,document.body)}
  </section>;
}
