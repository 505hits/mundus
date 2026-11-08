"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const featured=[
 {id:"DfPIUSjjVZf",sk:"Spoznajte lektorov",en:"Meet the teachers",descSk:"Ľudia, s ktorými sa budete učiť",descEn:"The people you'll learn with",route:"teachers"},
 {id:"DWQ3XM8DQ9W",sk:"Život v Mundus",en:"Life at Mundus",descSk:"Nahliadnite do našej komunity",descEn:"A look inside our community",route:"community"},
 {id:"DYUFE0ijV_3",sk:"Skúsenosti študentov",en:"Student experiences",descSk:"Príbehy z našej komunity",descEn:"Stories from our community",route:"community#testimonials"},
];
export default function InstagramHomepageSpotlight(){
 const {language}=useLanguage(),sk=language==="sk";
 return <section id="teachers" className="bg-white px-4 py-14 sm:px-6 sm:py-20">
  <div className="mx-auto max-w-6xl"><span id="instagram-community" className="block scroll-mt-24" aria-hidden="true"/><span id="testimonials" className="block scroll-mt-24" aria-hidden="true"/>
   <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk?"Naša komunita":"Our community"}</p>
     <h2 className="mt-3 text-[clamp(1.85rem,6.2vw,3.1rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Skutočné tváre Mundus.":"The real faces of Mundus."}</h2>
     <p className="mt-3 text-base leading-7 text-[#62697C]">{sk?"Fotografie z nášho Instagramu – lektori, komunita a skúsenosti študentov.":"Photos from our Instagram – teachers, community and student experiences."}</p>
    </div>
    <Link href={`/${language}/teachers`} className="inline-flex min-h-12 items-center gap-2 self-start rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white hover:bg-[#252E82]">{sk?"Spoznať lektorov":"Meet our teachers"}<ArrowRight size={17}/></Link>
   </div>
   <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
    {featured.map(item=><Link key={item.id} href={`/${language}/${item.route}`} className="group relative flex h-[270px] overflow-hidden rounded-[1.5rem] bg-[#E5E6ED] shadow-[0_14px_40px_rgba(23,26,43,.06)] transition hover:-translate-y-1 hover:shadow-xl sm:h-[330px]">
      <Image src={`/images/mundus/${item.id}.webp`} fill sizes="(max-width:640px) 92vw,33vw" alt={sk?`Fotografia z Mundus Instagramu: ${item.sk}`:`Mundus Instagram photo: ${item.en}`} className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#11162B]/90 via-transparent to-transparent"/>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6"><h3 className="text-2xl font-semibold !text-white">{sk?item.sk:item.en}</h3><p className="mt-2 text-sm text-[#E3E7F6]">{sk?item.descSk:item.descEn}</p><p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/90">{sk?"Zistiť viac":"Explore"}<ArrowRight size={15}/></p></div>
    </Link>)}
   </div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
    <Link href={`/${language}/community`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2F3AA2] hover:underline">{sk?"Viac fotografií Mundus":"More Mundus photos"}<ArrowRight size={16}/></Link>
    <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#5361AD] hover:underline"><Instagram size={16}/>{sk?"Náš Instagram":"Our Instagram"}</a>
   </div>
  </div>
 </section>;
}
