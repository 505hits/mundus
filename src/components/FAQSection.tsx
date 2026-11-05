"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function FAQSection() {
  const { language } = useLanguage();
  const sk = language === "sk";
  const items = sk ? [
    ["Sú hodiny individuálne?", "Áno. Balíčky na stránke sú určené pre individuálne online hodiny 1:1 v dĺžke 60 minút."],
    ["Musím mať každý týždeň rovnaký termín?", "Nie. Pri onboardingu nám poviete preferované dni a časy. Konkrétne termíny sa dohadujú podľa vašej a lektorovej dostupnosti."],
    ["Môžem začať ako úplný začiatočník?", "Áno. Stačí zvoliť „Úplný začiatočník“. Ak si úrovňou nie ste istí, môžete zvoliť „Neviem posúdiť“ a lektor vám ju pomôže potvrdiť."],
    ["Môžem si vybrať lektora?", "Mundus vám odporučí vhodných lektorov podľa jazyka, úrovne, cieľov, frekvencie a dostupnosti. Finálne priradenie schvaľuje Mundus."],
    ["Ako funguje zľava 10 %?", "Zľava platí na prvý oprávnený balíček iba raz na osobu. Systém overí váš účet pred platbou."],
    ["Môže hodiny zaplatiť firma?", "Áno. Ak potrebujete faktúru na firmu alebo zamestnávateľa, kontaktujte nás pred platbou."],
    ["Čo sa stane po platbe?", "Po potvrdení platby doplníte jazyk, úroveň, cieľ, požadovanú frekvenciu a preferované dni/časy. Následne vám Mundus odporučí vhodného lektora a pripraví prvú hodinu."],
    ["Čo vidím v portáli?", "Rozvrh, zostávajúce hodiny, materiály, domácu úlohu, spätnú väzbu, pokrok a možnosť kúpiť ďalší balíček."],
  ] : [
    ["Are lessons individual?", "Yes. The packages on the website are for individual 1:1 online lessons lasting 60 minutes."],
    ["Do I need the same lesson time every week?", "No. During onboarding you tell us your preferred days and times. Specific lessons are arranged around your and your teacher’s availability."],
    ["Can I start as a complete beginner?", "Yes. Choose “Complete beginner”. If you are unsure, choose “Not sure” and your teacher can help confirm your level."],
    ["Can I choose my teacher?", "Mundus recommends suitable teachers based on language, level, goals, frequency and availability. Mundus makes the final assignment."],
    ["How does the 10% discount work?", "It applies to the first eligible package once per person. Your account is checked before payment."],
    ["Can my company pay?", "Yes. If you need a company or employer invoice, contact us before payment."],
    ["What happens after payment?", "After payment is confirmed, you complete your language, level, goal, preferred frequency, days and times. Mundus then recommends a suitable teacher and prepares your first lesson."],
    ["What can I see in the portal?", "Your schedule, remaining lessons, materials, homework, feedback, progress and the option to buy another package."],
  ];

  return <section id="faq" className="bg-white py-24">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Časté otázky" : "FAQ"}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Všetko dôležité pred prvou hodinou" : "Everything important before your first lesson"}</h2>
        <p className="mt-4 text-gray-600">{sk ? "Ak tu nenájdete odpoveď, napíšte nám na Instagram alebo cez kontaktný formulár." : "If your question is not here, message us on Instagram or use the contact form."}</p>
      </div>
      <div className="mx-auto mt-10 max-w-4xl divide-y divide-[#E5E7F0] rounded-3xl border border-[#E5E7F0] bg-[#FAFAF9] px-5 sm:px-7">
        {items.map(([q,a]) => <details key={q} className="group py-5">
          <summary className="cursor-pointer list-none pr-8 font-semibold text-[#171A2B]">{q}</summary>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">{a}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
