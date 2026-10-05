import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LanguageSelector from "@/components/LanguageSelector";
import HowItWorks from "@/components/HowItWorks";
import TeacherSection from "@/components/TeacherSection";
import FeaturesBento from "@/components/FeaturesBento";
import CalendlyWidget from "@/components/CalendlyWidget";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { paymentEnabled } from "@/lib/payments";
import { publicTeachers } from "@/lib/public-teachers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teachers = await publicTeachers();
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <LanguageSelector />
      <HowItWorks />
      <TeacherSection teachers={teachers} />
      <FeaturesBento />
      <PricingSection paymentsAvailable={paymentEnabled()} signupAvailable={process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true"} />
      <CalendlyWidget />
      <Footer />
    </main>
  );
}
