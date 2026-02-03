"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Star, Gift, Zap } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection() {
    const { t } = useLanguage();

    return (
        <section id="pricing" className="section bg-white py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-64 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="section-header text-center mb-16"
                >
                    <span className="section-label inline-block px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 font-semibold text-sm mb-4">
                        {t.pricing.label}
                    </span>
                    <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
                        {t.pricing.titleStart} <span className="accent-word relative inline-block text-lime-600">
                            {t.pricing.titleEnd}
                            <svg className="absolute w-full h-3 bottom-0 left-0 text-yellow-300 -z-10 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="section-subtitle text-lg text-gray-600 max-w-2xl mx-auto">
                        {t.pricing.subtitle}
                    </p>
                </motion.div>

                {/* Group Courses */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="mb-16 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-lime-100/50 overflow-hidden"
                >
                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600">
                                <UsersIcon />
                            </div>
                            <h3 className="text-2xl font-bold uppercase tracking-tight">{t.pricing.group.title}</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4 font-semibold text-gray-500 w-1/3">{t.pricing.group.headers.language}</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-500">{t.pricing.group.headers.format}</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-500">{t.pricing.group.headers.price}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {t.pricing.group.rows.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4 font-medium text-gray-900">{row.language}</td>
                                            <td className="py-4 px-4 text-gray-600">{row.format}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-bold ${row.launchPrice ? "text-gray-400 line-through text-sm" : "text-gray-900 text-lg"}`}>
                                                        {row.originalPrice}
                                                    </span>
                                                    {row.launchPrice && (
                                                        <span className="font-bold text-lg text-lime-600 flex items-center gap-1">
                                                            {row.launchPrice}
                                                            <Zap size={16} fill="currentColor" />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                            <Gift size={18} className="text-lime-500" />
                            {t.pricing.group.note}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Individual Lessons */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeInUp}
                        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-lime-100/50 overflow-hidden flex flex-col"
                    >
                        <div className="p-8 md:p-10 flex-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <UserIcon />
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight">{t.pricing.individual.title}</h3>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 font-semibold text-gray-500">{t.pricing.individual.headers.package}</th>
                                        <th className="text-right py-4 font-semibold text-gray-500">{t.pricing.individual.headers.originalPrice}</th>
                                        <th className="text-right py-4 font-semibold text-lime-600">{t.pricing.individual.headers.launchPrice}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {t.pricing.individual.rows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="py-4 font-medium text-gray-900">{row.package}</td>
                                            <td className="py-4 text-right text-gray-400 line-through">{row.originalPrice}</td>
                                            <td className="py-4 text-right font-bold text-lime-600 text-lg">{row.launchPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                                <Star size={18} className="text-purple-500" fill="currentColor" />
                                {t.pricing.individual.note}
                            </div>
                        </div>
                    </motion.div>

                    {/* Discounts */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl overflow-hidden text-white flex flex-col"
                    >
                        <div className="p-8 md:p-10 flex-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lime-400">
                                    <HeartIcon />
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t.pricing.discounts.title}</h3>
                            </div>

                            <table className="w-full text-sm md:text-base">
                                <tbody className="divide-y divide-white/10">
                                    {t.pricing.discounts.rows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="py-4 pr-4 font-bold text-lime-400 whitespace-nowrap">{row.type}</td>
                                            <td className="py-4 px-2 text-gray-300 text-sm hidden sm:table-cell">{row.description}</td>
                                            <td className="py-4 pl-4 text-right font-bold text-white">{row.discount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    );
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    );
}

function HeartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-2.34 4.63-2.75a8.91 8.91 0 0 1-1.63-4.3 3.39 3.39 0 0 1 .52-2.31 3.5 3.5 0 0 1 4.78-.56 5.5 5.5 0 0 1 1 1 5.5 5.5 0 0 1 1-1 3.5 3.5 0 0 1 4.78.56 3.39 3.39 0 0 1 .52 2.31 8.91 8.91 0 0 1-1.63 4.3c1.03.41 3.14 1.47 4.63 2.75.05.04.1.08.13.12l-5.63 7.5a1.5 1.5 0 0 1-2.4 0l-5.63-7.5a.8.8 0 0 1 .13-.12" /></svg>
    );
}
