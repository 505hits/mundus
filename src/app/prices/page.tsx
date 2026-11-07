import Navbar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { paymentEnabled } from "@/lib/payments";

export const dynamic = "force-dynamic";

export default function PricesPage() {
  return <main className="min-h-screen">
    <Navbar />
    <div className="pt-28"><PricingSection paymentsAvailable={paymentEnabled()} /></div>
    <Footer />
  </main>;
}
