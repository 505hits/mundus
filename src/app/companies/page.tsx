import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, CalendarCheck2, Globe2 } from "lucide-react";
import CorporatePreview from "@/components/CorporatePreview";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates, localizedPath } from "@/lib/seo-locales";
import { submitCompanyQuote } from "./actions";

type Props={searchParams:Promise<{sent?:string;problem?:string}>};

export async function generateMetadata(): Promise<Metadata> {
 const language=await currentLanguage(); const sk=language==="sk";
 return { title: sk ? "Firemné jazykové kurzy online | Mundus Languages" : "Corporate language training online | Mundus Languages", description: sk ? "Firemné jazykové vzdelávanie online: individuálne aj skupinové hodiny, cena na mieru a firemný portál pre prehľad výučby." : "Online corporate language training with individual and group lessons, custom pricing and a company portal for learning oversight.", alternates:localizedAlternates("/companies",language), openGraph:{title:sk?"Firemné jazykové kurzy online | Mundus Languages":"Corporate language training online | Mundus Languages",description:sk?"Firemné jazykové vzdelávanie online: individuálne aj skupinové hodiny, cena na mieru a firemný portál pre prehľad výučby.":"Online corporate language training with individual and group lessons, custom pricing and a company portal for learning oversight.",url:`https://munduslanguages.com${localizedPath("/companies",language)}`,type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630}]}, twitter:{card:"summary_large_image",title:sk?"Firemné jazykové kurzy online | Mundus Languages":"Corporate language training online | Mundus Languages",description:sk?"Firemné jazykové vzdelávanie online: individuálne aj skupinové hodiny, cena na mieru a firemný portál pre prehľad výučby.":"Online corporate language training with individual and group lessons, custom pricing and a company portal for learning oversight.",images:["/logo-removebg-preview.png"]} };
}
export default async function CompaniesPage({searchParams}:Props) {
 const language=await currentLanguage(); const sk=language==="sk"; const {sent,problem}=await searchParams;
 const benefits=sk?[
  ["Výučba, ktorá sa prispôsobí práci","Jazyky a témy podľa pracovných situácií vášho tímu."],
  ["Menej práce pre HR","Lektorov, rozvrhy aj priebeh hodín koordinuje Mundus."],
  ["Prehľad bez zásahu do súkromia","Firma vidí využitie hodín, nie osobné študijné materiály."],
 ]:[
  ["Learning that works at work","Languages and real scenarios tailored to your team."],
  ["Less work for HR","Mundus coordinates teachers, scheduling and lessons."],
  ["Clarity with privacy","Your company sees lesson usage, not private study content."],
 ];
 return <main className="min-h-screen overflow-x-clip bg-[#F8F9FC]"><Navbar/>
   <section className="relative overflow-hidden bg-[#171A2B] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-24 sm:pt-36">
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[540px] w-[540px] rounded-full bg-[#5967CE]/45 blur-[110px]"/>
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-12">
     <div className="max-w-xl">
       <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.15em] text-[#E3E8FF]"><Building2 size={16}/>{sk?"Mundus pre firmy":"Mundus for business"}</span>
       <h1 className="mt-6 text-[clamp(2.3rem,8vw,4.8rem)] font-semibold leading-[1.06] tracking-[-.055em] !text-white">{sk?"Silnejší tím začína":"A stronger team starts"} <span className="text-[#C3CDFF]">{sk?"lepšou komunikáciou.":"with better communication."}</span></h1>
       <p className="mt-5 max-w-xl text-base leading-7 text-[#DDE1F3] sm:text-lg">{sk?"Praktické online jazykové hodiny pre zamestnancov — individuálne aj v malých skupinách. Jednoduchá organizácia, flexibilné termíny, cena na mieru.":"Practical online language lessons for your employees — one-to-one or in small groups. Flexible schedules, simple administration and custom pricing."}</p>
       <div className="mt-7 flex flex-col gap-3 sm:flex-row">
         <a href="#quote" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#DDE2FF] px-6 py-3.5 font-bold text-[#202D84] transition hover:bg-white">{sk?"Získať cenovú ponuku":"Get a custom quote"}<ArrowRight size={18}/></a>
         <a href="#benefits" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">{sk?"Ako to funguje":"How it works"}</a>
       </div>
       <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-[#EBEFFF]">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{sk?"1:1 aj skupiny":"1:1 & groups"}</span>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{sk?"Online · flexibilne":"Online · flexible"}</span>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{sk?"Firemný prehľad":"Company overview"}</span>
       </div>
     </div>
     <CorporatePreview sk={sk}/>
    </div>
   </section>

   <section className="bg-[#171A2B] px-4 pb-10 sm:px-6 sm:pb-16" aria-label={sk?"Mundus komunita":"Mundus community"}>
     <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#E5ECF2] md:grid-cols-[1fr_.85fr]">
       <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
         <p className="text-xs font-bold uppercase tracking-[.16em] text-[#4652A3]">{sk?"Lepšia komunikácia v tíme":"Better team communication"}</p>
         <h2 className="mt-3 max-w-xl text-[clamp(1.9rem,5vw,3.15rem)] font-semibold leading-tight tracking-[-.04em] text-[#171A2B]">{sk?"Sebavedomí ľudia. Silnejšie tímy.":"Confident people. Stronger teams."}</h2>
         <p className="mt-4 max-w-lg text-sm leading-7 text-[#60697B]">{sk?"Výučba je postavená na reálnych pracovných situáciách vášho tímu.":"Learning designed around your team's real workplace situations."}</p>
       </div>
       <div className="relative flex min-h-[250px] items-center justify-center bg-[#CFD8ED] p-5 sm:min-h-[340px]">
         <div className="relative h-[235px] w-full max-w-[260px] overflow-hidden rounded-[1.5rem] border-[7px] border-white bg-[#F3F5FA] shadow-2xl sm:h-[300px]">
           <Image unoptimized src="https://images.unsplash.com/photo-1704440452002-d14e303fec20?auto=format&fit=crop&w=900&q=84" alt={sk?"Ilustračná fotografia pracovného tímu pri stretnutí":"Editorial photograph of colleagues in a meeting"} fill sizes="260px" className="object-cover"/>
         </div>
       </div>
     </div>
   </section>

   <section id="benefits" className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl">
      <div className="max-w-3xl"><span className="text-xs font-bold uppercase tracking-[.16em] text-[#4652B6]">{sk?"Navrhnuté pre tímy":"Built for teams"}</span><h2 className="mt-3 text-[clamp(1.9rem,5vw,3.25rem)] font-semibold leading-tight tracking-[-.04em]">{sk?"Výsledky v komunikácii. Nie ďalšia administratíva." : "Better communication. Not more administration."}</h2></div>
      <div className="mt-9 grid gap-4 md:grid-cols-3">{benefits.map(([title,description],i)=>{const Icon=[Globe2,CalendarCheck2,ShieldCheck][i];return <article key={title} className="rounded-[1.7rem] border border-[#E1E5F0] bg-white p-6 shadow-[0_12px_40px_rgba(23,26,43,.04)] sm:p-7"><span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${i===0?"bg-[#E7E9FF] text-[#3443A2]":i===1?"bg-[#F8E5D6] text-[#835230]":"bg-[#DDEFE6] text-[#285D48]"}`}><Icon size={23}/></span><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#646A7E]">{description}</p></article>})}</div>
   </div></section>

   <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#E8ECFF] p-6 sm:p-10 lg:p-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div><span className="text-xs font-bold uppercase tracking-[.17em] text-[#4652B6]">{sk?"Od prvého dňa prehľad":"Clarity from day one"}</span><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Každý vie, čo má robiť." : "Everyone knows what comes next."}</h2><p className="mt-4 max-w-xl leading-7 text-gray-600">{sk?"Mundus organizuje výučbu. Študenti majú prístup k svojim materiálom. Firemný správca má len potrebný prehľad, nie súkromné údaje zamestnancov.":"Mundus organizes the learning. Students access their own materials. Managers get the high-level overview they need, without accessing employees' private study records."}</p></div>
        <div className="grid gap-3">{(sk?["Spoločne nastavíme ciele a formát výučby","Priradíme vhodných lektorov a termíny","Priebeh hodín uvidíte vo firemnom prehľade"]:["We agree on goals and training format","We coordinate teachers and schedules","You track lesson activity in the company overview"]).map((line,i)=><div key={line} className="flex items-center gap-3 rounded-2xl bg-white p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2F3AA2] font-semibold text-white">{i+1}</span><p className="text-sm font-semibold text-[#252A3E]">{line}</p></div>)}</div>
      </div>
   </div></section>

   <section id="quote" className="scroll-mt-24 bg-[#F1F3FA] px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-14">
      <div><span className="text-xs font-bold uppercase tracking-[.17em] text-[#4652B6]">{sk?"Nezáväzná ponuka":"No-obligation quote"}</span><h2 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight tracking-[-.045em]">{sk?"Povedzte nám o svojom tíme." : "Tell us about your team."}</h2><p className="mt-4 max-w-md leading-7 text-gray-600">{sk?"Stačí pár údajov. Pripravíme možnosti individuálnej alebo skupinovej výučby na mieru vašej firme.":"Just a few details. We'll prepare individual or group learning options tailored to your business."}</p><p className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#4652B6]"><CheckCircle2 size={18}/>{sk?"Bezplatná a nezáväzná konzultácia":"Free, no-obligation consultation"}</p></div>
      <div className="rounded-[1.75rem] border border-[#DDE2EF] bg-white p-5 shadow-[0_16px_48px_rgba(23,26,43,.06)] sm:p-8">
       {sent==="1"&&<p role="status" className="mb-5 rounded-2xl bg-green-50 p-4 text-sm text-green-800">{sk?"Ďakujeme. Dopyt sme prijali a ozveme sa vám.":"Thank you. We received your request and will contact you."}</p>}
       {problem&&<p role="alert" className="mb-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{problem==="rate"?(sk?"Dostali sme už viac dopytov z tohto e-mailu. Skúste to neskôr.":"We already received several requests from this email. Try again later."):problem==="invalid"?(sk?"Skontrolujte vyplnené údaje.":"Please check the information entered."):(sk?"Dopyt sa nepodarilo odoslať. Skúste to neskôr.":"The request could not be sent. Try again later.")}</p>}
       <form action={submitCompanyQuote} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="ui_language" value={language}/>
        <label className="text-sm font-semibold text-[#31384E] sm:col-span-2">{sk?"Názov firmy":"Company name"}<input name="company_name" required maxLength={160} autoComplete="organization" className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-[#FAFBFF] p-3 text-base font-normal outline-none focus:border-[#4652B6] focus:ring-4 focus:ring-[#4652B6]/10"/></label>
        <label className="text-sm font-semibold text-[#31384E]">{sk?"Vaše meno":"Your name"}<input name="contact_name" required maxLength={120} autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-[#FAFBFF] p-3 text-base font-normal outline-none focus:border-[#4652B6] focus:ring-4 focus:ring-[#4652B6]/10"/></label>
        <label className="text-sm font-semibold text-[#31384E]">E-mail<input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-[#FAFBFF] p-3 text-base font-normal outline-none focus:border-[#4652B6] focus:ring-4 focus:ring-[#4652B6]/10"/></label>
        <details className="rounded-xl border border-[#E3E6EF] bg-[#F8F9FE] p-4 sm:col-span-2"><summary className="cursor-pointer text-sm font-semibold text-[#2F3AA2]">{sk?"+ Doplniť podrobnosti (voliteľné)" : "+ Add details (optional)"}</summary>
         <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">{sk?"Počet zamestnancov":"Employees to train"}<input name="employee_count" type="number" min={1} max={100000} className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-white p-3"/></label>
          <label className="text-sm">{sk?"Jazyky":"Languages"}<input name="languages" maxLength={500} placeholder={sk?"napr. angličtina, nemčina":"e.g. English, German"} className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-white p-3"/></label>
          <label className="text-sm sm:col-span-2">{sk?"Vaše potreby":"Your needs"}<textarea name="message" rows={3} maxLength={3000} className="mt-2 w-full rounded-xl border border-[#D3D9EC] bg-white p-3"/></label>
          <label className="text-sm sm:col-span-2">{sk?"Telefón (voliteľné)":"Phone (optional)"}<input name="phone" maxLength={80} type="tel" className="mt-2 min-h-12 w-full rounded-xl border border-[#D3D9EC] bg-white p-3"/></label>
         </div>
        </details>
        <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <button type="submit" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3.5 font-bold text-white transition hover:bg-[#252E82] sm:col-span-2">{sk?"Požiadať o ponuku":"Request my quote"}<ArrowRight size={18}/></button>
       </form>
      </div>
   </div></section><Footer/>
 </main>;
}
