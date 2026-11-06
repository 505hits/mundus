import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LanguageSelector from "@/components/LanguageSelector";
import HowItWorks from "@/components/HowItWorks";
import TeacherSection from "@/components/TeacherSection";
import PricingSection from "@/components/PricingSection";
import PortalPreviewSection from "@/components/PortalPreviewSection";
import FeaturesBento from "@/components/FeaturesBento";
import TrustSection from "@/components/TrustSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CalendlyWidget from "@/components/CalendlyWidget";
import Footer from "@/components/Footer";
import MundusStructuredData from "@/components/MundusStructuredData";
import { paymentEnabled } from "@/lib/payments";
import { publicTeachers } from "@/lib/public-teachers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teachers = await publicTeachers();

  return (
    <main className="min-h-screen">
      <MundusStructuredData />
      <Navbar />
      <Hero />
      <LanguageSelector />
      <HowItWorks />
      <TeacherSection teachers={teachers} />

      <PricingSection
        paymentsAvailable={paymentEnabled()}
        signupAvailable={process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true"}
      />

      <PortalPreviewSection />
      <FeaturesBento />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <CalendlyWidget />
      <Footer />
    </main>
  );
}
