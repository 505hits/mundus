import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";

export default async function CookiesPage() {
  const sk=(await currentLanguage())==="sk";
  return <main className="min-h-screen bg-[#FAFAF9]"><Navbar/><section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F3AA2]">Mundus Languages</p>
    <h1 className="mt-3 text-4xl font-semibold">Cookies</h1>
    <p className="mt-3 text-sm text-gray-500">{sk?"Aktualizované: 6. novembra 2026":"Updated: November 6, 2026"}</p>
    <div className="mt-8 space-y-7 leading-7 text-gray-700">
      <section><h2 className="text-xl font-semibold">{sk?"Nevyhnutné cookies":"Necessary cookies"}</h2><p className="mt-2">{sk?"Mundus môže používať nevyhnutné cookies alebo podobné technológie potrebné na prihlásenie, bezpečnosť účtu, jazykové nastavenie a fungovanie študentského portálu.":"Mundus may use necessary cookies or similar technologies required for sign-in, account security, language preference and operation of the student portal."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Externé služby":"External services"}</h2><p className="mt-2">{sk?"Ak otvoríte externú službu, napríklad Stripe, Instagram alebo Calendly, táto služba môže používať vlastné cookies podľa svojich pravidiel.":"If you open an external service such as Stripe, Instagram or Calendly, that service may use its own cookies under its own policies."}</p></section>
      <section><h2 className="text-xl font-semibold">{sk?"Marketing a analytika":"Marketing and analytics"}</h2><p className="mt-2">{sk?"Ak v budúcnosti pridáme nepovinné analytické alebo marketingové cookies, táto stránka a príslušné ovládanie súhlasu sa aktualizujú pred ich použitím.":"If optional analytics or marketing cookies are added in the future, this page and the relevant consent controls will be updated before they are used."}</p></section>
    </div>
  </section><Footer/></main>;
}
