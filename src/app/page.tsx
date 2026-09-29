import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import LanguageSelector from "@/components/LanguageSelector";
import HowItWorks from "@/components/HowItWorks";
import TeacherSection from "@/components/TeacherSection";
import FeaturesBento from "@/components/FeaturesBento";
import CalendlyWidget from "@/components/CalendlyWidget";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { paymentEnabled } from "@/lib/payments";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ReviewsMarquee />
      <LanguageSelector />
      <HowItWorks />
      <TeacherSection />
      <FeaturesBento />
      <PricingSection paymentsAvailable={paymentEnabled()} signupAvailable={process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true"} />
      <CalendlyWidget />
      <Footer />
    </main>
  );
}
