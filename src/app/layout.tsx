import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mundus | Learn Languages with Native Speakers",
  description: "Experience immersive 1-on-1 language sessions with native experts. Learn English, Spanish, Italian, and Portuguese with personalized tutoring.",
  keywords: ["language learning", "online tutoring", "native speakers", "English", "Spanish", "Italian", "Portuguese"],
  openGraph: {
    title: "Mundus | Learn Languages with Native Speakers",
    description: "Experience immersive 1-on-1 language sessions with native experts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientProviders>
          {children}
          <FloatingCTA />
        </ClientProviders>
      </body>
    </html>
  );
}
