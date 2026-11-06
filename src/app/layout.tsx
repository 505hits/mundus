import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";
import NewsletterPopup from "@/components/NewsletterPopup";
import { currentLanguage } from "@/lib/i18n";
import AnalyticsManager from "@/components/AnalyticsManager";
import AnalyticsConsentBanner from "@/components/AnalyticsConsentBanner";
import { localizedPath } from "@/lib/seo-locales";

export async function generateMetadata(): Promise<Metadata> {
  const language = await currentLanguage();
  const sk = language === "sk";

  return {
    metadataBase: new URL("https://munduslanguages.com"),
    title: sk
      ? "Online jazykové kurzy a individuálne hodiny | Mundus Languages"
      : "Online language lessons & courses | Mundus Languages",
    description: sk
      ? "Online jazykové kurzy: individuálne hodiny 1:1, súkromné skupiny a firemná výučba. 45 alebo 60 minút, flexibilné termíny, skúsení aj native lektori."
      : "Online language lessons for individuals, private groups and companies. Choose 45 or 60 minutes, flexible scheduling, native speakers and experienced teachers.",
    keywords: sk
      ? ["online jazykové kurzy", "online jazykové hodiny", "individuálne hodiny", "skupinové jazykové kurzy", "firemné jazykové kurzy", "angličtina online", "nemčina online", "španielčina online", "taliančina online", "francúzština online"]
      : ["online language lessons", "online language courses", "private language lessons", "group language lessons", "corporate language training", "English lessons online", "German lessons online", "Spanish lessons online"],
    openGraph: {
      title: sk
        ? "Online jazykové kurzy | Mundus Languages"
        : "Online language lessons | Mundus Languages",
      description: sk
        ? "Individuálne 1:1, súkromné skupiny aj firemná výučba. Flexibilné online hodiny a moderný študentský portál."
        : "1:1 lessons, private groups and company training with flexible online scheduling and a modern student portal.",
      url: `https://munduslanguages.com${localizedPath("/",language)}`,
      type: "website",
      locale: sk ? "sk_SK" : "en_GB",
      images: [{ url: "/logo-removebg-preview.png", width: 1200, height: 630, alt: "Mundus Languages — online language lessons" }],
    },
    twitter: {
      card: "summary_large_image",
      title: sk ? "Online jazykové kurzy | Mundus Languages" : "Online language lessons | Mundus Languages",
      description: sk ? "1:1 hodiny, súkromné skupiny a firemná výučba online." : "1:1 lessons, private groups and company training online.",
      images: ["/logo-removebg-preview.png"],
    },
    robots: { index: true, follow: true },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || "E8jeITeM86HOhcoQCXpdxzqra-O-Xy-2CsS3JH7QLFk",
      other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
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
          <AnalyticsManager />
          <AnalyticsConsentBanner />
        </ClientProviders>
      </body>
    </html>
  );
}
