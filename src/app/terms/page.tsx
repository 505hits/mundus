import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";


export async function generateMetadata():Promise<Metadata>{
 const language=await currentLanguage(); const sk=language==="sk";
 return {title:sk?"Podmienky | Mundus Languages":"Terms | Mundus Languages",description:sk?"Podmienky používania, nákupu a online jazykovej výučby Mundus Languages.":"Terms for using, purchasing and taking online lessons with Mundus Languages.",alternates:localizedAlternates("/terms",language)};
}
export default async function TermsPage() {
  const sk=(await currentLanguage())==="sk";
  return <main className="min-h-screen bg-[#FAFAF9]"><Navbar/><section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">Mundus Languages</p>
    <h1 className="mt-3 text-4xl font-semibold">{sk?"Podmienky používania a nákupu":"Terms of use and purchase"}</h1>
    <p className="mt-3 text-sm text-gray-500">{sk?"Aktualizované: 6. novembra 2026":"Updated: November 6, 2026"}</p>
    <div className="mt-8 space-y-7 leading-7 text-gray-700">
      <section><h2 className="text-xl font-semibold">{sk?"Služba":"Service"}</h2><p className="mt-2">{sk?"Mundus poskytuje individuálne online jazykové hodiny a súvisiaci študentský portál. Verejné ceny sa vzťahujú na 45- alebo 60-minútové individuálne hodiny podľa zvoleného balíčka.":"Mundus provides individual online language lessons and a related student portal. Public prices apply to 45- or 60-minute individual lessons according to the selected package."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Nákup a platba":"Purchase and payment"}</h2><p className="mt-2">{sk?"Balíček sa aktivuje po potvrdení platby. Detailné študijné preferencie sa vypĺňajú až po platbe. Zľava 10 % sa automaticky vypočíta iba na prvý oprávnený balíček a môže sa použiť iba raz na študenta/osobu. Balíčky sa automaticky neobnovujú.":"A package is activated after payment is confirmed. Detailed learning preferences are completed only after payment. The 10% discount is calculated automatically for the first eligible package and can be used only once per student/person. Packages do not renew automatically."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Lektor a termíny":"Teacher and scheduling"}</h2><p className="mt-2">{sk?"Mundus odporúča a schvaľuje lektora podľa jazyka, úrovne, cieľov, dostupnosti a kapacity. Konkrétne termíny hodín závisia od spoločnej dostupnosti. Rodený hovoriaci ani konkrétny lektor nie sú garantovaní pri každom jazyku a termíne.":"Mundus recommends and approves a teacher based on language, level, goals, availability and capacity. Specific lesson times depend on shared availability. A native speaker or specific teacher is not guaranteed for every language or time."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Zmeny, zrušenia a vrátenie platieb":"Changes, cancellations and refunds"}</h2><p className="mt-2">{sk?"Žiadosti o zmenu naplánovanej hodiny sa riešia cez portál alebo dohodnutý komunikačný kanál. Otázky k zrušeniu nákupu, refundácii alebo firemnej fakturácii riešte s Mundus individuálne cez kontaktnú stránku.":"Requests to change a scheduled lesson are handled through the portal or agreed communication channel. Questions about purchase cancellation, refunds or company invoicing should be handled individually with Mundus through the contact page."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Účet":"Account"}</h2><p className="mt-2">{sk?"Používateľ je zodpovedný za bezpečnosť prihlasovacích údajov a za pravdivosť údajov potrebných na poskytovanie služby.":"You are responsible for keeping login credentials secure and for providing accurate information needed to deliver the service."}</p></section>
    </div>
  </section><Footer/></main>;
}
