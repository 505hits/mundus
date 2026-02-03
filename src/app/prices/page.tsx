"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalendlyWidget from "@/components/CalendlyWidget";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const packs = [
    {
        name: "Starter",
        price: "$29",
        period: "per lesson",
        description: "Perfect for trying out Mundus or casual practice.",
        features: [
            "1-on-1 video lesson (50 min)",
            "Native speaker tutor",
            "Personalized feedback",
            "Basic learning materials",
        ],
        highlight: false,
    },
    {
        name: "Pro Pack",
        price: "$199",
        period: "for 10 lessons",
        description: "Our most popular choice for serious learners.",
        features: [
            "All Starter features",
            "Priority scheduling",
            "Custom learning plan",
            "Progress tracking report",
            "Recording of lessons",
        ],
        highlight: true,
    },
    {
        name: "Intensive",
        price: "$349",
        period: "for 20 lessons",
        description: "Accelerate your fluency with intensive coaching.",
        features: [
            "All Pro features",
            "Daily practice assignments",
            "Exam preparation support",
            "24/7 chat support with tutor",
            "Certificate of completion",
        ],
        highlight: false,
    },
];

export default function PricesPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="pt-32 pb-20 container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="section-label">Pricing</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-6">Simple, transparent pricing</h1>
                    <p className="section-subtitle">
                        No hidden fees. Choose the package that fits your goals and budget.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {packs.map((pack, index) => (
                        <motion.div
                            key={pack.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`card relative flex flex-col ${pack.highlight ? 'border-[#BFFF00] shadow-lg ring-1 ring-[#BFFF00]' : ''}`}
                        >
                            {pack.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#BFFF00] text-[#181818] px-4 py-1 rounded-full text-sm font-bold">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
                            <p className="text-[#525252] mb-6 h-12">{pack.description}</p>
                            <div className="mb-8">
                                <span className="text-4xl font-bold">{pack.price}</span>
                                <span className="text-[#525252] ml-2 text-sm">{pack.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {pack.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 text-[#BFFF00] bg-black rounded-full p-0.5">
                                            <Check size={12} />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#calendly"
                                className={`btn w-full justify-center ${pack.highlight ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                Choose {pack.name}
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Calendly Section */}
                <div id="calendly" className="mt-20">
                    <CalendlyWidget />
                </div>
            </div>

            <Footer />
        </main>
    );
}
