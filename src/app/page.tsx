import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LanguageSelector from "@/components/LanguageSelector";
import HowItWorks from "@/components/HowItWorks";
import TeacherSection from "@/components/TeacherSection";
import FeaturesBento from "@/components/FeaturesBento";
import CalendlyWidget from "@/components/CalendlyWidget";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <LanguageSelector />
      <HowItWorks />
      <TeacherSection />
      <FeaturesBento />
      <CalendlyWidget />
      <Footer />
    </main>
  );
}
