import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";
import NewsletterPopup from "@/components/NewsletterPopup";
import { currentLanguage } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const language = await currentLanguage();
  const sk = language === "sk";

  return {
    metadataBase: new URL("https://munduslanguages.com"),
    title: sk
      ? "Mundus Languages | Individuálne online jazykové hodiny"
      : "Mundus Languages | Personal online language lessons",
    description: sk
      ? "Individuálne online jazykové hodiny v dĺžke 45 alebo 60 minút s native aj skúsenými lektormi. Vyberte si balíček, zaplaťte online a nastavte si svoje študijné preferencie."
      : "Personal 45- or 60-minute online language lessons with native speakers and experienced teachers. Choose a package, pay securely online and set your learning preferences.",
    keywords: sk
      ? ["online jazykové hodiny", "native lektori", "angličtina", "nemčina", "španielčina", "taliančina", "francúzština", "portugalčina", "ruština", "slovenčina", "ukrajinčina"]
      : ["online language lessons", "native speakers", "English lessons", "German lessons", "Spanish lessons", "Italian lessons", "French lessons", "Portuguese lessons", "Slovak lessons"],
    openGraph: {
      title: sk
        ? "Mundus Languages | Individuálne online jazykové hodiny"
        : "Mundus Languages | Personal online language lessons",
      description: sk
        ? "Individuálne online jazykové hodiny na 45 alebo 60 minút, flexibilné termíny, native aj skúsení lektori a študentský portál."
        : "Personal 45- or 60-minute online language lessons, flexible scheduling, native speakers and experienced teachers, plus your own student portal.",
      url: "https://munduslanguages.com",
      type: "website",
      locale: sk ? "sk_SK" : "en_GB",
    },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    verification: {
      google: "E8jeITeM86HOhcoQCXpdxzqra-O-Xy-2CsS3JH7QLFk",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await currentLanguage();
  return (
    <html lang={language}>
      <body className="antialiased">
        <ClientProviders initialLanguage={language}>
          {children}
          <FloatingCTA />
          <NewsletterPopup />
        </ClientProviders>
      </body>
    </html>
  );
}
