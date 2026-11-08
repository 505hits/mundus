import type { Metadata } from "next";
import CommunityPageBody from "@/components/CommunityPageBody";
import { LanguageProvider } from "@/context/LanguageContext";
import { localizedAlternates } from "@/lib/seo-locales";

export const dynamic="force-dynamic";
export const metadata: Metadata={
  title:"Life at Mundus | Mundus Languages",
  description:"Real updates and stories from the Mundus Languages community.",
  alternates:localizedAlternates("/community","en"),
};

export default function LocalizedCommunityPage(){
  // This route is explicit. Render its own locale even if a previous visitor
  // language cookie belongs to the other language.
  return <LanguageProvider initialLanguage="en"><CommunityPageBody language="en"/></LanguageProvider>;
}
