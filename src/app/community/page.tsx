import type { Metadata } from "next";
import CommunityPageBody from "@/components/CommunityPageBody";
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
  return <CommunityPageBody language={language}/>;
}
