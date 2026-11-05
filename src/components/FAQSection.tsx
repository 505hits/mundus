"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function FAQSection() {
  const { language } = useLanguage();
  const sk = language === "sk";

  const items = sk ? [
    ["Sú hodiny individuálne?", "Áno. Balíčky na stránke sú určené pre individuálne online hodiny 1:1 v dĺžke 60 minút."],
    ["Sú všetky hodiny 60-minútové?", "Áno. Ceny na stránke sú za 60-minútové individuálne hodiny. Ak by ste potrebovali iný formát, kontaktujte nás pred nákupom."],
    ["Musím mať každý týždeň rovnaký termín?", "Nie. Po platbe uvediete preferované dni a časové okno. Konkrétne hodiny sa dohadujú podľa spoločnej dostupnosti študenta a lektora."],
    ["Môžem meniť deň alebo čas hodiny?", "Áno, termíny sú flexibilné. Už naplánovanú hodinu je však potrebné meniť cez dohodnutý proces v portáli a podľa dostupnosti lektora."],
    ["Môžem začať ako úplný začiatočník?", "Áno. Po platbe môžete zvoliť „Úplný začiatočník“. Ak si úrovňou nie ste istí, zvoľte „Neviem posúdiť“."],
    ["Musím vedieť svoju úroveň pred nákupom?", "Nie. Balíček si môžete kúpiť bez presného určenia úrovne. Úroveň doplníte až po platbe a lektor vám ju môže pomôcť potvrdiť."],
    ["Môžem si vybrať rodeného hovoriaceho?", "Ak je vhodný rodený hovoriaci pre daný jazyk dostupný, môžeme ho zahrnúť medzi odporúčané možnosti. Negarantujeme však rodeného hovoriaceho pri každom jazyku a termíne."],
    ["Môžem si vybrať konkrétneho lektora?", "Mundus odporučí vhodných lektorov podľa jazyka, úrovne, cieľa, frekvencie, termínov a kapacity. Finálne priradenie schvaľuje Mundus."],
    ["Čo sa stane po nákupe?", "Najprv sa potvrdí platba a balíček sa pripíše do účtu. Až potom doplníte jazyk, úroveň, požadovanú frekvenciu, cieľ a preferované dni a časy. Následne pripravíme odporúčanie lektora."],
    ["Ako funguje zľava 10 %?", "Zľava sa uplatní na prvý oprávnený balíček iba raz na osobu. Systém overí oprávnenosť pred vytvorením platby."],
    ["Môže hodiny zaplatiť firma alebo zamestnávateľ?", "Áno. Ak potrebujete faktúru na firmu alebo úhradu cez zamestnávateľa, kontaktujte nás pred online platbou."],
    ["Dostanem faktúru?", "Áno, pri firemnej fakturácii nám pošlite fakturačné údaje pred platbou. Pri otázkach nás kontaktujte cez web alebo Instagram."],
    ["Môžem si neskôr kúpiť ďalší balíček?", "Áno. Ďalší balíček si môžete kúpiť zo študentského portálu. Nie je tu automatické predplatné."],
    ["Čo vidím v študentskom portáli?", "Rozvrh, zostávajúce hodiny, materiály, domácu úlohu, spätnú väzbu, pokrok a možnosť kúpiť ďalší balíček."],
  ] : [
    ["Are lessons individual?", "Yes. Website packages are for individual 1:1 online lessons lasting 60 minutes."],
    ["Are all lessons 60 minutes?", "Yes. The public package prices are for 60-minute individual lessons. If you need a different format, contact us before purchase."],
    ["Do I need the same time every week?", "No. After payment you enter preferred days and a time window. Specific lessons are arranged around the shared availability of student and teacher."],
    ["Can I change the day or time?", "Yes, scheduling is flexible. A lesson that is already scheduled should be changed through the portal process and remains subject to teacher availability."],
    ["Can I start as a complete beginner?", "Yes. After payment choose “Complete beginner”. If you are unsure, choose “Not sure”."],
    ["Do I need to know my level before buying?", "No. You can buy a package without knowing your exact level. You add it only after payment, and your teacher can help confirm it."],
    ["Can I choose a native speaker?", "If a suitable native speaker is available for your language and schedule, we can include them among the recommended options. A native speaker is not guaranteed for every language or time."],
    ["Can I choose a specific teacher?", "Mundus recommends suitable teachers based on language, level, goal, frequency, schedule and capacity. Mundus approves the final assignment."],
    ["What happens after I buy?", "Payment is confirmed and the package is added to your account first. Only then do you enter language, level, preferred frequency, goal, days and times. Mundus then prepares teacher recommendations."],
    ["How does the 10% discount work?", "It applies to the first eligible package once per person. Eligibility is checked before payment is created."],
    ["Can my company or employer pay?", "Yes. If you need company invoicing or employer payment, contact us before paying online."],
    ["Can I get an invoice?", "Yes. For company invoicing, send us the billing details before payment. Contact us through the website or Instagram if needed."],
    ["Can I buy another package later?", "Yes. You can buy another package from the student portal. There is no automatic subscription."],
    ["What can I see in the student portal?", "Your schedule, remaining lessons, materials, homework, feedback, progress and the option to buy another package."],
  ];

  return <section id="faq" className="bg-white py-24">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Časté otázky" : "FAQ"}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Všetko dôležité pred nákupom" : "Everything important before you buy"}</h2>
        <p className="mt-4 text-gray-600">{sk ? "Detailný onboarding vypĺňate až po úspešnej platbe." : "Detailed onboarding is completed only after successful payment."}</p>
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
