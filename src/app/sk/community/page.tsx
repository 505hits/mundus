import type { Metadata } from "next";
import CommunityPageBody from "@/components/CommunityPageBody";
import { LanguageProvider } from "@/context/LanguageContext";
import { localizedAlternates } from "@/lib/seo-locales";

export const dynamic="force-dynamic";
export const metadata: Metadata={
  title:"Život v Mundus | Mundus Languages",
  description:"Skutočné príspevky a príbehy komunity Mundus Languages.",
  alternates:localizedAlternates("/community","sk"),
};

export default function LocalizedCommunityPage(){
  // This route is explicit. Render its own locale even if a previous visitor
  // language cookie belongs to the other language.
  return <LanguageProvider initialLanguage="sk"><CommunityPageBody language="sk"/></LanguageProvider>;
}
