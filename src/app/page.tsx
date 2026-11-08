import type { Metadata } from "next";
import MundusGuideLinks from "@/components/MundusGuideLinks";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LanguageSelector from "@/components/LanguageSelector";
import LearningFormatsSection from "@/components/LearningFormatsSection";
import TeacherProfiles from "@/components/TeacherProfiles";
import StudentStories from "@/components/StudentStories";
import SeoDiscoverySection from "@/components/SeoDiscoverySection";
import { publicTeachers } from "@/lib/public-teachers";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import MundusStructuredData from "@/components/MundusStructuredData";
import { paymentEnabled } from "@/lib/payments";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";

export const dynamic = "force-dynamic";

export async function generateMetadata():Promise<Metadata>{
  const language=await currentLanguage();
  return {alternates:localizedAlternates("/",language)};
}

export default async function Home() {
  const approved=await publicTeachers();
  return (
    <main className="min-h-screen">
      <MundusStructuredData />
      <Navbar />
      <Hero paymentsAvailable={paymentEnabled()}/>
      <LearningFormatsSection />
      <LanguageSelector compact />
      <TeacherProfiles compact approved={approved}/>
      <StudentStories/>
      <PricingSection paymentsAvailable={paymentEnabled()} />
      <SeoDiscoverySection />
      <MundusGuideLinks />
      <FAQSection />
      <Footer />
    </main>
  );
}
