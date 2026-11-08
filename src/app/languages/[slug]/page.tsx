import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { flagForLanguage } from "@/lib/language-flags";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, MessageCircle, ShieldCheck, UserRoundCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { LANGUAGE_SEO_PAGES, languageSeoPage } from "@/data/language-seo-pages";
import { localizedAlternates, localizedPath } from "@/lib/seo-locales";

export const dynamic="force-dynamic";

export function generateStaticParams(){
 return LANGUAGE_SEO_PAGES.map(page=>({slug:page.slug}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const config=languageSeoPage(slug);if(!config)return {};
 const language=await currentLanguage();const copy=language==="sk"?config.sk:config.en;
 const canonical="/languages/"+config.slug;
 return {
  title:copy.seoTitle,
  description:copy.description,
  alternates:localizedAlternates(canonical,language),
  openGraph:{title:copy.seoTitle,description:copy.description,url:`https://munduslanguages.com${localizedPath(canonical,language)}`,type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630,alt:"Mundus Languages"}]},
  twitter:{card:"summary_large_image",title:copy.seoTitle,description:copy.description,images:["/logo-removebg-preview.png"]},
 };
}

export default async function LanguageLandingPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const config=languageSeoPage(slug);if(!config)notFound();
 const language=await currentLanguage();const sk=language==="sk";const copy=sk?config.sk:config.en;const prefix=`/${language}`;
 const related=config.slug==="english"
  ? [
      ["anglictina-pre-zaciatocnikov",sk?"Angličtina pre začiatočníkov":"English for beginners"],
      ["business-english","Business English"],
      ["konverzacna-anglictina",sk?"Konverzačná angličtina":"Conversational English"],
      ["anglictina-na-cestovanie",sk?"Angličtina na cestovanie":"English for travel"],
    ]
  : config.slug==="slovak-for-foreigners"
    ? [["slovencina-pre-cudzincov-a1",sk?"Slovenčina pre cudzincov A1":"Slovak for foreigners A1"]]
    : [];
 const structured={
  "@context":"https://schema.org",
  "@graph":[
   {
    "@type":"Service",
    name:copy.name,
    serviceType:sk?`Individuálne online hodiny – ${copy.name}`:`Private online lessons – ${copy.name}`,
    provider:{"@type":"EducationalOrganization","@id":"https://munduslanguages.com/#organization","name":"Mundus Languages","url":"https://munduslanguages.com"},
    url:`https://munduslanguages.com${localizedPath(`/languages/${config.slug}`,language)}`,
    description:copy.description,
    areaServed:[{"@type":"Country","name":"Slovakia"},{"@type":"Country","name":"Czechia"}],
    availableChannel:{"@type":"ServiceChannel","serviceUrl":"https://munduslanguages.com","serviceLocation":{"@type":"VirtualLocation","url":"https://munduslanguages.com"}}
   },
   {
    "@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"Mundus Languages",item:"https://munduslanguages.com"},
      {"@type":"ListItem",position:2,name:sk?"Jazyky":"Languages",item:`https://munduslanguages.com${localizedPath("/languages",language)}`},
      {"@type":"ListItem",position:3,name:copy.name,item:`https://munduslanguages.com${localizedPath(`/languages/${config.slug}`,language)}`}
    ]
   }
  ]
 };

 return <main className="min-h-screen bg-[#F7F8FC]">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/>
  <Navbar/>
  <section className="relative overflow-hidden bg-[#171A2B] px-6 pb-20 pt-32 text-white sm:pt-36">
   <div className="pointer-events-none absolute left-1/2 top-[-55%] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#5361D4]/35 blur-[135px]"/>
   <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.72fr] lg:items-end">
    <div>
     <nav aria-label={sk?"Navigácia":"Breadcrumb"} className="text-sm text-[#BFC5E7]"><Link href={prefix} className="hover:text-white">Mundus</Link><span className="mx-2">/</span><Link href={`${prefix}/languages`} className="hover:text-white">{sk?"Jazyky":"Languages"}</Link><span className="mx-2">/</span><span>{copy.name}</span></nav>
     <p className="mt-7 text-sm font-semibold uppercase tracking-[.16em] text-[#C7D2FE]">{sk?"Individuálne online hodiny":"Private online lessons"}</p>
     <h1 className="mt-4 max-w-4xl text-[clamp(2.6rem,6vw,4.9rem)] font-semibold leading-[1.01] tracking-[-.045em] !text-white">{copy.hero}</h1>
     <p className="mt-6 max-w-3xl text-lg leading-8 text-[#D8DBE8]">{copy.intro}</p>
     <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href={`${prefix}/pricing?language=${encodeURIComponent(config.value)}`} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#5361D4] px-6 py-4 font-semibold text-white shadow-[0_14px_35px_rgba(70,82,194,.35)] transition hover:-translate-y-0.5 hover:bg-[#6572DF]">{sk?"Vybrať balíček":"Choose a package"}<ArrowRight size={18}/></Link>
      <Link href={`${prefix}/contact`} className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[.06] px-6 py-4 font-semibold text-white transition hover:bg-white/[.1]">{sk?"Najprv sa opýtať":"Ask us first"}</Link>
     </div>
    </div>
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.07] p-5 backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
        <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#C7D2FE]">{sk?"Váš jazyk":"Your language"}</p><p className="mt-1 text-2xl font-semibold text-white">{copy.name}</p></div>
        <Image unoptimized src={`https://flagcdn.com/w160/${flagForLanguage(config.value).code}.png`} alt={`${copy.name} flag`} width={100} height={70} className="h-16 w-24 rounded-xl border border-white/20 object-cover shadow-xl" />
      </div>
      <p className="text-sm font-semibold text-[#C7D2FE]">{sk?"Ako hodiny fungujú":"Lesson format"}</p>
      <div className="mt-4 space-y-3">
       {copy.focus.map((item,index)=>{const icons=[UserRoundCheck,Clock3,MessageCircle,ShieldCheck];const Icon=icons[index]??CheckCircle2;return <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-3.5"><Icon size={18} className="shrink-0 text-[#C7D2FE]"/><span className="text-sm text-[#F1F2F8]">{item}</span></div>})}
      </div>
    </div>
   </div>
  </section>

  <section className="px-6 py-20 sm:py-24"><div className="mx-auto max-w-6xl">
   <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
    <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Na čo sa môžeme zamerať":"What we can focus on"}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{sk?`${copy.name} podľa toho, kde ju chcete používať`:`${copy.name} for where you actually need it`}</h2></div>
    <div className="grid gap-4 sm:grid-cols-2">{copy.goals.map(goal=><article key={goal} className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(23,26,43,.04)]"><CheckCircle2 size={20} className="text-[#2F3AA2]"/><p className="mt-4 leading-7 text-gray-700">{goal}</p></article>)}</div>
   </div>
  </div></section>

  {related.length>0&&<section className="px-6 pb-4 pt-4 sm:pb-8"><div className="mx-auto max-w-6xl rounded-[2rem] border border-[#DDE2FB] bg-[#F3F5FF] p-6 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Vyberte si konkrétny cieľ":"Choose a specific goal"}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">{sk?"Praktické programy podľa toho, čo potrebujete":"Practical lesson paths for what you need"}</h2><div className="mt-5 flex flex-wrap gap-3">{related.map(([slug,label])=><Link key={slug} href={`${prefix}/learn/${slug}`} className="inline-flex items-center gap-2 rounded-full border border-[#C7CDF6] bg-white px-4 py-2.5 text-sm font-semibold text-[#2F3AA2] transition hover:-translate-y-0.5 hover:border-[#2F3AA2]">{label}<ArrowRight size={15}/></Link>)}</div></div></section>}

  <section className="bg-white px-6 py-20 sm:py-24"><div className="mx-auto max-w-5xl">
   <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Časté otázky":"Common questions"}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{sk?`Pred prvou hodinou ${copy.name.toLowerCase()}`:`Before your first ${copy.name} lesson`}</h2></div>
   <div className="mt-8 divide-y divide-[#E5E7F0] rounded-[1.75rem] border border-[#E5E7F0] bg-[#FAFAF9] px-5 sm:px-7">{copy.faq.map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-[#171A2B]">{q}</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">{a}</p></details>)}</div>
  </div></section>

  <section className="px-6 py-20"><div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#171A2B] p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#C7D2FE]">Mundus Languages</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.035em] !text-white sm:text-4xl">{sk?`Začnite s ${copy.name.toLowerCase()} tempom, ktoré vám vyhovuje.`:`Start ${copy.name} at a pace that fits your life.`}</h2><p className="mt-4 max-w-2xl leading-7 text-[#D8DBE8]">{sk?"Najprv platba. Potom doplníte úroveň, frekvenciu, dni, časy a cieľ. Mundus následne vyberie vhodného lektora.":"Payment comes first. Then add your level, frequency, days, times and goal. Mundus then matches you with a suitable teacher."}</p></div><Link href={`${prefix}/pricing?language=${encodeURIComponent(config.value)}`} className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-[#2F3AA2] lg:mt-0">{sk?"Pozrieť ceny":"View pricing"}<ArrowRight size={18}/></Link></div></section>
  <Footer/>
 </main>;
}
