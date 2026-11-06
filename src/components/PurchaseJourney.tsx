"use client";
import { CreditCard, Languages, PackageCheck, UserRoundCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PurchaseJourney(){
 const {language}=useLanguage();const sk=language==="sk";
 const steps=[
  [Languages,sk?"1. Jazyk":"1. Language",sk?"Vyberte si jazyk, ktorý sa chcete učiť.":"Choose the language you want to learn."],
  [PackageCheck,sk?"2. Balíček":"2. Package",sk?"Vyberte 45 alebo 60 minút a počet hodín.":"Choose 45 or 60 minutes and package size."],
  [CreditCard,sk?"3. Platba":"3. Payment",sk?"Vytvorte účet a zaplaťte bezpečne online.":"Create your account and pay securely online."],
  [UserRoundCheck,sk?"4. Lektor":"4. Teacher",sk?"Po platbe doplníte preferencie a Mundus vyberie vhodného lektora.":"After payment, add preferences and Mundus matches a suitable teacher."],
 ];
 return <section className="rounded-[2rem] border border-[#DDE2FB] bg-[#171A2B] p-5 text-white shadow-[0_20px_60px_rgba(23,26,43,.16)] sm:p-7">
   <div className="grid gap-3 md:grid-cols-4">
     {steps.map(([Icon,title,text],index)=>{const C=Icon as typeof Languages;return <div key={String(title)} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.06] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[.1]">
       <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#5361D4]/30 blur-2xl"/>
       <div className="relative flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#C7D2FE]"><C size={19}/></span><p className="font-semibold !text-white">{String(title)}</p></div>
       <p className="relative mt-3 text-sm leading-6 text-[#D8DBE8]">{String(text)}</p>
       {index<steps.length-1&&<span className="absolute right-[-10px] top-1/2 hidden h-px w-5 bg-white/15 md:block"/>}
     </div>})}
   </div>
 </section>;
}
