import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";
import AnalyticsConsentSettings from "@/components/AnalyticsConsentSettings";


export async function generateMetadata():Promise<Metadata>{
 const language=await currentLanguage(); const sk=language==="sk";
 return {title:sk?"Cookies | Mundus Languages":"Cookies | Mundus Languages",description:sk?"Informácie o nevyhnutných a analytických cookies vrátane Google Analytics a Microsoft Clarity.":"Information about necessary and analytics cookies including Google Analytics and Microsoft Clarity.",alternates:localizedAlternates("/cookies",language)};
}
export default async function CookiesPage() {
  const sk=(await currentLanguage())==="sk";
  return <main className="min-h-screen bg-[#FAFAF9]"><Navbar/><section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">Mundus Languages</p>
    <h1 className="mt-3 text-4xl font-semibold">Cookies</h1>
    <p className="mt-3 text-sm text-gray-500">{sk?"Aktualizované: 6. novembra 2026":"Updated: November 6, 2026"}</p>
    <div className="mt-8 space-y-7 leading-7 text-gray-700">
      <section><h2 className="text-xl font-semibold">{sk?"Nevyhnutné cookies":"Necessary cookies"}</h2><p className="mt-2">{sk?"Mundus môže používať nevyhnutné cookies alebo podobné technológie potrebné na prihlásenie, bezpečnosť účtu, jazykové nastavenie a fungovanie študentského portálu.":"Mundus may use necessary cookies or similar technologies required for sign-in, account security, language preference and operation of the student portal."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Externé služby":"External services"}</h2><p className="mt-2">{sk?"Ak otvoríte externú službu, napríklad Stripe, Instagram alebo Calendly, táto služba môže používať vlastné cookies podľa svojich pravidiel.":"If you open an external service such as Stripe, Instagram or Calendly, that service may use its own cookies under its own policies."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Analytika":"Analytics"}</h2><p className="mt-2">{sk?"Ak súhlasíte, používame Google Tag Manager (Google Analytics 4) na meranie návštevnosti, zdrojov návštev, stránok a konverzných krokov a Microsoft Clarity na anonymizované behaviorálne prehľady, napríklad kliky, scrollovanie a nahrávky relácií. Tieto nástroje sa nenačítajú, kým analytiku nepovolíte.":"If you consent, we use Google Tag Manager (Google Analytics 4) to measure traffic, acquisition sources, page usage and conversion steps, and Microsoft Clarity for behavioural insights such as clicks, scrolling and session recordings. These tools are not loaded until you allow analytics."}</p></section>
      <AnalyticsConsentSettings sk={sk}/>
    </div>
  </section><Footer/></main>;
}
