import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InstagramCommunitySection, InstagramTestimonialsSection } from "@/components/InstagramSocialProof";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";

export async function generateMetadata(): Promise<Metadata> {
  const language = await currentLanguage();
  return {
    title: language === "sk" ? "Život v Mundus | Mundus Languages" : "Life at Mundus | Mundus Languages",
    description: language === "sk" ? "Skutočné príspevky, príbehy a skúsenosti komunity Mundus Languages." : "Real posts, stories and experiences from the Mundus Languages community.",
    alternates: localizedAlternates("/community",language),
  };
}

export default async function CommunityPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  return <main className="min-h-screen bg-white">
    <Navbar/>
    <section className="bg-[#171A2B] px-4 pb-12 pt-28 text-white sm:px-6 sm:pb-16 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-bold uppercase tracking-[.16em] text-[#C7D2FE]">{sk ? "Mundus komunita" : "Mundus community"}</span>
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,7vw,4rem)] font-semibold leading-tight tracking-[-.04em] !text-white">{sk ? "Spoznajte život v Mundus." : "Explore life at Mundus."}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#D8DBE8]">{sk ? "Príspevky našej komunity a skúsenosti študentov priamo z Instagramu." : "Community updates and student experiences straight from our Instagram."}</p>
      </div>
    </section>
    <InstagramCommunitySection/>
    <InstagramTestimonialsSection/>
    <Footer/>
  </main>;
}
