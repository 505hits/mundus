import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";
import { currentLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Mundus Languages | Online jazykové hodiny",
  description: "Individuálne online jazykové hodiny. Vyberte si jazyk a balíček 60-minútových hodín, učte sa s lektorom a sledujte svoj pokrok.",
  keywords: ["online jazykové hodiny", "angličtina", "nemčina", "španielčina", "taliančina", "francúzština", "portugalčina", "ruština", "turečtina"],
  openGraph: {
    title: "Mundus Languages | Online jazykové hodiny",
    description: "Individuálne online jazykové hodiny s lektorom a prehľadom o vašom pokroku.",
    type: "website",
  },
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
