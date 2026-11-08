"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const teacherPosts=["DfPIUSjjVZf","DdjYZh5DVIB"] as const;
const communityPosts=["DWQ3XM8DQ9W","DYSRMMnNZbh","DXo7xBDDScL","DeRGioptTPN","DW8aF4-DZDd","DYSOVxCoMrJ"] as const;
const highlightUrl="https://www.instagram.com/stories/highlights/18107167411644336/";

function PhotoCard({id,title}: {id:string;title:string}){
 const {language}=useLanguage(),sk=language==="sk";
 return <article className="group relative h-[300px] min-w-0 overflow-hidden rounded-[1.6rem] bg-[#E9EAF1] shadow-[0_12px_32px_rgba(23,26,43,.07)] sm:h-[370px]">
  <Image src={`/images/mundus/${id}.webp`} alt={sk?`Fotografia zo skutočného príspevku Mundus: ${title}`:`Photo from an actual Mundus post: ${title}`} fill sizes="(max-width:640px) 90vw,(max-width:1024px) 44vw,33vw" className="object-cover transition duration-700 group-hover:scale-105"/>
  <div className="absolute inset-0 bg-gradient-to-t from-[#101629]/80 via-transparent to-transparent"/>
  <p className="absolute bottom-5 left-5 right-5 text-lg font-semibold !text-white">{title}</p>
 </article>;
}

export function InstagramTeachersSection(){
 const {language}=useLanguage(),sk=language==="sk";
 return <section id="teachers" className="bg-white px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl">
  <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Naši lektori":"Our teachers"}</p>
   <h2 className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-semibold tracking-[-.04em]">{sk?"Spoznajte ľudí z Mundus.":"Meet the people of Mundus."}</h2>
   <p className="mt-3 text-base leading-7 text-gray-600">{sk?"Skutočné fotografie z predstavení našich lektorov. Bez fotografií modelov.":"Real photos from our teacher introductions. No stock portraits."}</p></div>
  <div className="mt-8 grid gap-4 sm:grid-cols-2">{teacherPosts.map((id,index)=><PhotoCard key={id} id={id} title={sk?`Predstavenie lektora ${index+1}`:`Teacher introduction ${index+1}`}/>)}</div>
  <div className="mt-7 flex flex-wrap items-center gap-4"><Link href={`/${language}/pricing`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white">{sk?"Vybrať jazyk a balíček":"Choose a language and package"}<ArrowRight size={17}/></Link></div>
 </div></section>;
}

export function InstagramTestimonialsSection(){
 const {language}=useLanguage(),sk=language==="sk";
 return <section id="testimonials" className="scroll-mt-24 bg-[#F8F9FF] px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl">
  <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Skúsenosti":"Experiences"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Príbehy našej komunity.":"Stories from our community."}</h2></div>
  <div className="mt-7 max-w-[540px]"><PhotoCard id="DYUFE0ijV_3" title={sk?"Príspevok z komunity Mundus":"Post from the Mundus community"}/></div>
 </div></section>;
}

export function InstagramCommunitySection(){
 const {language}=useLanguage(),sk=language==="sk";
 return <section id="instagram-community" className="bg-[#F1F3FC] px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl">
  <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Život v Mundus":"Life at Mundus"}</p>
   <h2 className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-semibold tracking-[-.04em]">{sk?"Naše momenty. Naša komunita.":"Our moments. Our community."}</h2>
   <p className="mt-3 leading-7 text-gray-600">{sk?"Fotografie sú uložené priamo na webe. Nemusíte otvárať Instagram, aby ste si ich pozreli.":"These photos are saved on our website. No Instagram account needed to view them."}</p></div>
  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{communityPosts.map((id,index)=><PhotoCard key={id} id={id} title={sk?`Mundus moment ${index+1}`:`Mundus moment ${index+1}`}/>)}</div>
  <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><Link href={`/${language}/teachers`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{sk?"Spoznať našich lektorov":"Meet our teachers"}<ArrowRight size={17}/></Link><a href={highlightUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#4652B6] hover:underline"><Instagram size={17}/>{sk?"Jeden odkaz na naše Stories":"Our Story Highlights"}</a></div>
 </div></section>;
}
