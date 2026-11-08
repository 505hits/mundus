"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const posts=[
 {id:"DYUFE0ijV_3", sk:"Skúsenosti z našej komunity",en:"From our community"},
 {id:"DYSRMMnNZbh", sk:"Zo života Mundus",en:"Life at Mundus"}
];
export default function StudentStories(){
 const {language}=useLanguage();const sk=language==="sk";
 return <section id="reviews" className="scroll-mt-24 bg-[#F3F5FB] px-4 py-12 sm:px-6 sm:py-18">
  <div className="mx-auto max-w-6xl">
   <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
     <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#3846A7]"><MessageCircleHeart size={17}/>{sk?"Naša komunita":"Our community"}</p>
     <h2 className="mt-2 text-[clamp(1.9rem,5vw,3rem)] font-semibold tracking-[-.04em] text-[#171A2B]">{sk?"Skutoční ľudia. Skutočné skúsenosti.":"Real people. Real experiences."}</h2>
     <p className="mt-3 text-sm leading-6 text-[#626B7E] sm:text-base">{sk?"Z nášho Instagramu. Originálne príspevky si môžete pozrieť priamo na profile Mundus.":"From our Instagram. Open the original posts on Mundus to explore more."}</p>
    </div>
    <Link href={`/${language}/community`} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#3747A4]">{sk?"Viac z komunity":"More from our community"}<ArrowUpRight size={17}/></Link>
   </div>
   <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-3xl sm:gap-4">
    {posts.map(post=><a key={post.id} href={`https://www.instagram.com/p/${post.id}/`} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-[1.3rem] border border-[#E0E5F0] bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative h-[150px] bg-[#E9ECF7] sm:h-[230px]"><Image src={`/images/mundus/${post.id}.webp`} fill sizes="(max-width:640px) 44vw,330px" alt={sk?post.sk:post.en} className="object-contain p-2"/></div>
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
       <div><p className="text-xs font-semibold leading-5 text-[#20263D] sm:text-sm">{sk?post.sk:post.en}</p><p className="mt-1 text-[11px] text-[#667089]">{sk?"Pozrieť originál na Instagrame":"View original on Instagram"}</p></div>
       <Instagram size={17} className="shrink-0 text-[#4959B0]"/>
      </div>
    </a>)}
   </div>
   <p className="mt-4 text-xs text-[#69738C]">{sk?"Príspevky prezentujeme bez vymyslených recenzií alebo hodnotení.":"No invented testimonials or ratings are used."}</p>
  </div>
 </section>;
}
