import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, CheckCircle2, Users, BarChart3, ShieldCheck } from "lucide-react";
import { currentLanguage } from "@/lib/i18n";
import { submitCompanyQuote } from "./actions";

type Props={searchParams:Promise<{sent?:string;problem?:string}>};
export default async function CompaniesPage({searchParams}:Props){
 const language=await currentLanguage();const sk=language==="sk";const {sent,problem}=await searchParams;
 const benefits=sk?[
  ["Výučba podľa pracovných potrieb","Individuálne alebo malé skupinové online hodiny podľa úrovne a cieľov zamestnancov."],
  ["Firemný prehľad","Firma vidí iba základný prehľad priradených zamestnancov: jazyk, dokončené hodiny, zostatok a ďalší termín."],
  ["Jednoduchá administratíva","Mundus rieši lektorov, rozvrhy a výučbu. Firemný správca nepotrebuje admin prístup."],
  ["Súkromie zamestnancov","Firma nevidí domáce úlohy, testové odpovede, súkromné poznámky, hodnotenia ani interné údaje Mundus."]
 ]:[
  ["Training built around work needs","Individual or small-group online lessons based on employees’ levels and goals."],
  ["Company overview","The company sees only a limited overview of assigned employees: language, completed lessons, balance and next lesson."],
  ["Simple administration","Mundus handles teachers, scheduling and delivery. Company managers do not need admin access."],
  ["Employee privacy","Companies do not see homework, test answers, private notes, ratings or Mundus internal data."]
 ];
 return <main className="min-h-screen bg-[#FAFAF9]"><Navbar/>
  <section className="px-6 pb-16 pt-32"><div className="mx-auto max-w-6xl">
   <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Pre firmy":"For companies"}</p>
   <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{sk?"Jazykové vzdelávanie pre zamestnancov bez zbytočnej administratívy":"Language training for employees without unnecessary administration"}</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">{sk?"Individuálne aj malé skupinové online hodiny. Cenu pripravíme podľa počtu zamestnancov, jazykov, frekvencie a formátu výučby.":"Individual and small-group online lessons. We prepare a custom quote based on employee count, languages, frequency and lesson format."}</p>
   <a href="#quote" className="mt-8 inline-flex rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white">{sk?"Požiadať o cenovú ponuku":"Request a quote"}</a>
  </div></section>
  <section className="px-6 py-12"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">{benefits.map(([title,text],i)=>{const icons=[Users,BarChart3,Building2,ShieldCheck];const Icon=icons[i];return <article key={title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><Icon size={25} className="text-[#2F3AA2]"/><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 leading-7 text-gray-600">{text}</p></article>})}</div></section>
  <section className="px-6 py-12"><div className="mx-auto max-w-6xl rounded-[2rem] bg-[#EEF2FF] p-7 sm:p-10"><h2 className="text-3xl font-semibold">{sk?"Čo firma vidí v portáli":"What the company sees in the portal"}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{(sk?["Priradení zamestnanci","Jazyk výučby","Počet dokončených hodín","Zostávajúce hodiny","Najbližší termín","Posledná absolvovaná hodina"]:["Assigned employees","Learning language","Completed lesson count","Lessons remaining","Next lesson","Last completed lesson"]).map(x=><p key={x} className="flex items-center gap-2 rounded-2xl bg-white p-4"><CheckCircle2 size={18} className="text-[#2F3AA2]"/>{x}</p>)}</div><p className="mt-5 text-sm text-gray-600">{sk?"Firemný portál je zámerne obmedzený. Detailné študijné údaje zostávajú medzi študentom, lektorom a Mundus." : "The company portal is intentionally limited. Detailed learning data remains between the student, teacher and Mundus."}</p></div></section>
  <section id="quote" className="px-6 py-16"><div className="mx-auto max-w-4xl rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm sm:p-10"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Cenová ponuka":"Quote request"}</p><h2 className="mt-2 text-3xl font-semibold">{sk?"Povedzte nám, čo vaša firma potrebuje":"Tell us what your company needs"}</h2><p className="mt-3 text-gray-600">{sk?"Firemné ceny sú individuálne. Pošlite základné údaje a pripravíme vám ponuku.":"Company pricing is customized. Send the basics and we’ll prepare a quote."}</p>
  {sent==="1"&&<p role="status" className="mt-5 rounded-2xl bg-green-50 p-4 text-green-800">{sk?"Ďakujeme. Dopyt sme prijali a ozveme sa vám.":"Thank you. We received your request and will contact you."}</p>}
  {problem&&<p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">{problem==="rate"?(sk?"Dostali sme už viac dopytov z tohto e-mailu. Skúste to neskôr.":"We already received several requests from this email. Try again later."):problem==="invalid"?(sk?"Skontrolujte vyplnené údaje.":"Please check the information entered."):(sk?"Dopyt sa nepodarilo odoslať. Skúste to neskôr.":"The request could not be sent. Try again later.")}</p>}
  <form action={submitCompanyQuote} className="mt-7 grid gap-5 sm:grid-cols-2">
   <label className="text-sm">{sk?"Názov firmy":"Company name"}<input name="company_name" required maxLength={160} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm">{sk?"Kontaktná osoba":"Contact person"}<input name="contact_name" required maxLength={120} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm">E-mail<input name="email" type="email" required maxLength={254} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm">{sk?"Telefón (voliteľné)":"Phone (optional)"}<input name="phone" maxLength={80} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm">{sk?"Počet zamestnancov na výučbu":"Employees to train"}<input name="employee_count" type="number" min={1} max={100000} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm">{sk?"Jazyky":"Languages"}<input name="languages" maxLength={500} placeholder={sk?"napr. angličtina, nemčina":"e.g. English, German"} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="text-sm sm:col-span-2">{sk?"Čo potrebujete?":"What do you need?"}<textarea name="message" rows={4} maxLength={3000} placeholder={sk?"Napr. 12 zamestnancov, 2× týždenne, kombinácia individuálnych a skupinových hodín...":"For example: 12 employees, twice weekly, mix of individual and group lessons..."} className="mt-2 w-full rounded-xl border p-3"/></label>
   <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   <button className="rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white sm:col-span-2">{sk?"Požiadať o cenovú ponuku":"Request a quote"}</button>
  </form></div></section><Footer/></main>;
}
