import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Users, CalendarDays, MessageCircle, Sparkles } from "lucide-react";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates, localizedPath } from "@/lib/seo-locales";


export async function generateMetadata(): Promise<Metadata> {
 const language=await currentLanguage(); const sk=language==="sk";
 return { title: sk ? "Skupinové jazykové kurzy online | Mundus Languages" : "Private group language lessons online | Mundus Languages", description: sk ? "Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru." : "Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.", alternates:localizedAlternates("/group-lessons",language), openGraph:{title:sk?"Skupinové jazykové kurzy online | Mundus Languages":"Private group language lessons online | Mundus Languages",description:sk?"Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru.":"Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.",url:`https://munduslanguages.com${localizedPath("/group-lessons",language)}`,type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630}]}, twitter:{card:"summary_large_image",title:sk?"Skupinové jazykové kurzy online | Mundus Languages":"Private group language lessons online | Mundus Languages",description:sk?"Súkromné online jazykové hodiny pre 2–5 priateľov alebo kolegov. Flexibilné termíny, spoločný cieľ a cena na mieru.":"Private online language lessons for 2–5 friends or colleagues with flexible scheduling, a shared goal and custom pricing.",images:["/logo-removebg-preview.png"]} };
}
export default async function GroupLessonsPage(){
 const language=await currentLanguage(); const sk=language==="sk"; const prefix=`/${language}`;
 const cases=sk?[
  ["S priateľmi", "Pripravujete sa na spoločnú cestu alebo sa chcete posunúť v jazyku spolu?"],
  ["S kolegami", "Precvičte si situácie z práce a komunikáciu, ktorú skutočne využijete."],
  ["S rodinou", "Učte sa vo svojom tempe s ľuďmi, s ktorými sa cítite prirodzene."]
 ]:[
  ["With friends", "Getting ready for a trip or simply learning together?"],
  ["With colleagues", "Practice the conversations and workplace situations you actually need."],
  ["With family", "Learn at your own pace with people you already feel comfortable with."]
 ];
 return <main className="min-h-screen overflow-x-clip bg-[#F8F9FD]"><Navbar/>
  <section className="relative overflow-hidden bg-[#171A2B] px-4 pb-14 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-36">
   <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-0 h-[480px] w-[480px] rounded-full bg-[#5967CE]/35 blur-[100px]"/>
   <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
    <div>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.15em] text-[#DBE0FF]"><Users size={17}/>{sk?"Súkromné skupiny 2–5 osôb":"Private groups of 2–5 people"}</span>
      <h1 className="mt-6 text-[clamp(2.4rem,8vw,4.65rem)] font-semibold leading-[1.07] tracking-[-.05em] !text-white">{sk?"Učte sa jazyk ":"Learn a language "} <span className="text-[#C7D2FE]">{sk?"spolu.":"together."}</span> {sk?"Je to zábavnejšie.":"It's more fun."}</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-[#DDE1F3] sm:text-lg">{sk?"Vytvorte si vlastnú skupinu priateľov, rodiny alebo kolegov. Spoločné ciele, flexibilné online hodiny a lektor len pre vás.":"Create your own group of friends, family or colleagues. Shared goals, flexible online lessons and a teacher dedicated to your group."}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
       <Link href={`/${language}/contact?type=group`} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#DDE2FF] px-6 py-3 font-semibold text-[#25348F] transition hover:bg-white">{sk?"Požiadať o ponuku":"Request group pricing"}<ArrowRight size={18}/></Link>
       <a href="#how-groups-work" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">{sk?"Ako to funguje":"How it works"}</a>
      </div>
      <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-white/90">{[sk?"2–5 ľudí":"2–5 people",sk?"Online odkiaľkoľvek":"Online from anywhere",sk?"Termín podľa vás":"Your schedule"].map(t=><span key={t} className="rounded-full border border-white/15 bg-white/10 px-3 py-2">{t}</span>)}</div>
    </div>
    <div className="relative h-[340px] overflow-hidden rounded-[2rem] border border-white/15 bg-[#BFC8DF] shadow-[0_35px_70px_rgba(5,10,40,.3)] sm:h-[430px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8EAFF] via-[#D3DEF4] to-[#C7D5EA]"/>
      <div className="relative mx-auto flex h-full max-w-md items-center justify-center p-5 sm:p-7">
        <div className="relative h-full w-[min(76%,290px)] overflow-hidden rounded-[1.65rem] border-[8px] border-white bg-white shadow-[0_20px_50px_rgba(23,26,43,.2)]">
          <Image src="/images/mundus/DW8aF4-DZDd.webp" alt={sk?"Fotografia zo skutočného príspevku Mundus":"Photo from a real Mundus post"} fill sizes="290px" className="object-contain"/>
        </div>
      </div>
      <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#2F3AA2] shadow-sm">{sk?"Vaša partia. Váš kurz.":"Your people. Your course."}</span>
    </div>
   </div>
  </section>
  <section id="how-groups-work" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl">
   <p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk?"Jednoduché od začiatku":"Simple from the start"}</p>
   <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Ako začať v troch krokoch":"Start in three easy steps"}</h2>
   <div className="mt-8 grid gap-4 md:grid-cols-3">{(sk?[
    ["01","Dajte dokopy skupinu","Pozvite 1–4 ďalších ľudí s podobnou úrovňou alebo cieľom."],
    ["02","Povedzte nám, čo potrebujete","Jazyk, počet ľudí, frekvencia a termíny – všetko nastavíme spolu."],
    ["03","Začnite sa rozprávať","Vyberieme vhodného lektora a dohodneme spoločné online hodiny."]
   ]:[
    ["01","Bring your group together","Invite 1–4 others with a similar level or learning goal."],
    ["02","Tell us what you need","Language, group size, frequency and availability – we'll plan it with you."],
    ["03","Start speaking","We match your group with a teacher and agree on your online sessions."]
   ]).map(([n,title,desc])=><article key={n} className="rounded-[1.6rem] border border-[#E1E5F0] bg-white p-6 shadow-[0_10px_30px_rgba(23,26,43,.04)]"><span className="text-3xl font-semibold text-[#6674D2]">{n}</span><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#626A80]">{desc}</p></article>)}</div>
  </div></section>
  <section className="bg-white px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl">
    <div className="mb-8 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk?"Pre koho sú určené":"Who they're for"}</p><h2 className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-semibold tracking-tight">{sk?"Dohodnite sa, kto sa učí s vami.":"Choose who learns with you."}</h2></div>
    <div className="grid gap-4 md:grid-cols-3">{cases.map(([title,desc],i)=><article key={title} className={`rounded-[1.7rem] p-6 sm:p-8 ${["bg-[#E8E9FF]","bg-[#FBE9DB]","bg-[#DEF0E8]"][i]}`}><div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75 text-[#2F3AA2]">{i===0?<Users size={23}/>:i===1?<MessageCircle size={23}/>:<Sparkles size={23}/>}</div><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#51586A]">{desc}</p></article>)}</div>
  </div></section>
  <section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#171A2B] p-6 text-white sm:p-10">
   <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
     <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#C7D2FE]">{sk?"Cena na mieru":"Custom quote"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight !text-white sm:text-4xl">{sk?"Vaša skupina. Jedna cenová ponuka.":"Your group. One tailored quote."}</h2><p className="mt-4 max-w-2xl leading-7 text-[#D8DBE8]">{sk?"Cena závisí od počtu ľudí, dĺžky a frekvencie hodín. Pošlite nám pár detailov a navrhneme vhodné riešenie bez záväzkov.":"Pricing depends on group size, lesson length and frequency. Send us a few details for a no-obligation proposal."}</p></div>
     <Link href={`/${language}/contact?type=group`} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#DDE2FF] px-5 font-bold text-[#25348F] hover:bg-white">{sk?"Získať ponuku pre skupinu":"Get a group quote"}<ArrowRight size={18}/></Link>
   </div>
  </div></section><Footer/></main>;
}
