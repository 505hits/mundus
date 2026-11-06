import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageSelector from "@/components/LanguageSelector";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";

export async function generateMetadata():Promise<Metadata>{
 const language=await currentLanguage(); const sk=language==="sk";
 return {
  title:sk?"Online jazykové kurzy podľa jazyka | Mundus Languages":"Online language lessons by language | Mundus Languages",
  description:sk?"Vyberte si angličtinu, nemčinu, španielčinu, taliančinu, francúzštinu, slovenčinu pre cudzincov a ďalšie jazyky. Potom pokračujte priamo k balíčku a platbe.":"Choose English, German, Spanish, Italian, French, Slovak for foreigners and more. Then continue directly to package selection and payment.",
  alternates:localizedAlternates("/languages",language),
 };
}
export default async function LanguagesPage(){
 const sk=(await currentLanguage())==="sk";
 return <main className="min-h-screen bg-white"><Navbar/><section className="bg-[#171A2B] px-6 pb-12 pt-32 text-white"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#C7D2FE]">{sk?"Jazyky":"Languages"}</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-.04em] !text-white sm:text-6xl">{sk?"Najprv si vyberte jazyk.":"Start by choosing your language."}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#D8DBE8]">{sk?"Potom si vyberiete balíček a môžete pokračovať k online platbe.":"Then choose a package and continue to secure online payment."}</p></div></section><LanguageSelector/><Footer/></main>;
}
