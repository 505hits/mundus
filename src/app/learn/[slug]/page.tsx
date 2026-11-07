import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { INTENT_SEO_PAGES,intentSeoPage } from "@/data/intent-seo-pages";
import { localizedAlternates,localizedPath } from "@/lib/seo-locales";

export const dynamic="force-dynamic";
export function generateStaticParams(){return INTENT_SEO_PAGES.map(page=>({slug:page.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const config=intentSeoPage(slug);if(!config)return {};
 const language=await currentLanguage();const copy=language==="sk"?config.sk:config.en;const path="/learn/"+config.slug;
 return {title:copy.seoTitle,description:copy.description,alternates:localizedAlternates(path,language),openGraph:{title:copy.seoTitle,description:copy.description,url:`https://munduslanguages.com${localizedPath(path,language)}`,type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630}]}};
}

export default async function IntentPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const config=intentSeoPage(slug);if(!config)notFound();
 const language=await currentLanguage();const sk=language==="sk";const copy=sk?config.sk:config.en;const prefix=`/${language}`;
 const languageSlug=config.languageValue==="Slovak"?"slovak-for-foreigners":"english";
 const structured={"@context":"https://schema.org","@type":"Service",name:copy.title,description:copy.description,provider:{"@type":"EducationalOrganization","name":"Mundus Languages","url":"https://munduslanguages.com"},url:`https://munduslanguages.com${localizedPath(`/learn/${config.slug}`,language)}`};
 return <main className="min-h-screen bg-[#F7F8FC]"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/><Navbar/>
  <section className="relative overflow-hidden bg-[#171A2B] px-6 pb-20 pt-32 text-white"><div className="absolute left-1/2 top-[-70%] h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-[#5361D4]/35 blur-[140px]"/><div className="relative mx-auto max-w-5xl">
   <nav className="text-sm text-[#C7D2FE]"><Link href={prefix}>Mundus</Link><span className="mx-2">/</span><Link href={`${prefix}/languages/${languageSlug}`}>{config.languageValue}</Link></nav>
   <h1 className="mt-7 max-w-4xl text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[1] tracking-[-.045em] !text-white">{copy.title}</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-[#D8DBE8]">{copy.intro}</p>
   <Link href={`${prefix}/?language=${encodeURIComponent(config.languageValue)}#pricing`} className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#5361D4] px-6 py-4 font-semibold text-white">{sk?"Vybrať balíček":"Choose a package"}<ArrowRight size={18}/></Link>
  </div></section>
  <section className="px-6 py-20"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-semibold tracking-[-.035em]">{sk?"Na čo sa zameriame":"What we can focus on"}</h2><div className="mt-7 grid gap-4 sm:grid-cols-2">{copy.points.map(x=><div key={x} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><CheckCircle2 size={19} className="text-[#2F3AA2]"/><p className="mt-3 leading-7 text-gray-700">{x}</p></div>)}</div></div></section>
  <section className="bg-white px-6 py-20"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-semibold tracking-[-.035em]">{sk?"Časté otázky":"Common questions"}</h2><div className="mt-7 divide-y divide-[#E5E7F0] rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] px-6">{copy.faq.map(([q,a])=><details key={q} className="py-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">{a}</p></details>)}</div></div></section>
  <section className="px-6 py-20"><div className="mx-auto max-w-5xl rounded-[2rem] bg-[#171A2B] p-8 text-white sm:p-10"><h2 className="text-3xl font-semibold !text-white">{sk?"Chcete začať?":"Ready to start?"}</h2><p className="mt-3 max-w-2xl leading-7 text-[#D8DBE8]">{sk?"Vyberte si 45 alebo 60 minút a balíček. Prvý oprávnený balíček má automaticky 10 % zľavu.":"Choose 45 or 60 minutes and your package. The first eligible package is automatically 10% off."}</p><Link href={`${prefix}/?language=${encodeURIComponent(config.languageValue)}#pricing`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#2F3AA2]">{sk?"Cenník a platba":"Pricing & payment"}<ArrowRight size={17}/></Link></div></section>
  <Footer/>
 </main>;
}
