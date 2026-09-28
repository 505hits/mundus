import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Mundus | Learn Languages with Native Speakers",
  description: "Experience immersive 1-on-1 language sessions with native experts. Learn English, Spanish, Italian, and Portuguese with personalized tutoring.",
  keywords: ["language learning", "online tutoring", "native speakers", "English", "Spanish", "Italian", "Portuguese"],
  openGraph: {
    title: "Mundus | Learn Languages with Native Speakers",
    description: "Experience immersive 1-on-1 language sessions with native experts.",
    type: "website",
  },
  verification: {
    google: "E8jeITeM86HOhcoQCXpdxzqra-O-Xy-2CsS3JH7QLFk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          {children}
          <FloatingCTA />
        </ClientProviders>
      </body>
    </html>
  );
}
