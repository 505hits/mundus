import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";
import { currentLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://munduslanguages.com"),
  title: "Mundus Languages | Individuálne online jazykové hodiny",
  description: "Individuálne online jazykové hodiny 1:1 v dĺžke 45 alebo 60 minút. Vyberte si balíček, zaplaťte online, doplňte preferencie a Mundus vám odporučí vhodného lektora.",
  keywords: ["online jazykové hodiny", "angličtina", "nemčina", "španielčina", "taliančina", "francúzština", "portugalčina", "ruština", "slovenčina", "ukrajinčina"],
  openGraph: {
    title: "Mundus Languages | Individuálne online jazykové hodiny",
    description: "1:1 online jazykové hodiny na 45 alebo 60 minút, flexibilné termíny, online platba a študentský portál.",
    url: "https://munduslanguages.com",
    type: "website",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  verification: {
    google: "E8jeITeM86HOhcoQCXpdxzqra-O-Xy-2CsS3JH7QLFk",
  },
};

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
        </ClientProviders>
      </body>
    </html>
  );
}
