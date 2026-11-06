import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PurchasePackages from "@/components/PurchasePackages";
import PurchaseJourney from "@/components/PurchaseJourney";
import { paymentEnabled } from "@/lib/payments";
import { currentLanguage } from "@/lib/i18n";

export const dynamic="force-dynamic";

export async function generateMetadata():Promise<Metadata>{
 const sk=(await currentLanguage())==="sk";
 return {
  title:sk?"Cenník online jazykových hodín | Mundus Languages":"Online language lesson pricing | Mundus Languages",
  description:sk?"Vyberte si jazyk, 45- alebo 60-minútové individuálne hodiny a balíček. Prvý oprávnený balíček má automaticky 10 % zľavu. Bez predplatného.":"Choose your language, 45- or 60-minute private lessons and package. The first eligible package is automatically 10% off. No subscription.",
  alternates:{canonical:"/pricing"},
  openGraph:{title:sk?"Cenník | Mundus Languages":"Pricing | Mundus Languages",description:sk?"Jazyk → balíček → bezpečná online platba.":"Language → package → secure online payment.",url:"https://munduslanguages.com/pricing",type:"website",images:[{url:"/logo-removebg-preview.png",width:1200,height:630}]}
 };
}

export default async function PricingPage(){
 const sk=(await currentLanguage())==="sk";
 return <main className="min-h-screen bg-[#F7F8FC]"><Navbar/>
  <section className="px-6 pb-10 pt-32 sm:pt-36"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#2F3AA2]">{sk?"Cenník a platba":"Pricing & payment"}</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-.04em] text-[#171A2B] sm:text-6xl">{sk?"Vyberte jazyk. Vyberte balíček. Zaplaťte online.":"Choose a language. Choose a package. Pay online."}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{sk?"Žiadne telefonovanie ani objednávka cez správy nie sú potrebné. Pri individuálnych hodinách môžete celý nákup dokončiť online.":"No phone call or message is required. For individual lessons, you can complete the full purchase online."}</p><div className="mt-8"><PurchaseJourney/></div></div></section>
  <section className="px-6 pb-20 pt-8"><div className="mx-auto max-w-7xl"><PurchasePackages paymentsAvailable={paymentEnabled()} signupAvailable={process.env.MUNDUS_SELF_SIGNUP_ENABLED==="true"}/></div></section>
  <Footer/>
 </main>;
}
