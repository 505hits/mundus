"use client";

import { ArrowUpRight, Globe, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { language } = useLanguage();
    const sk = language === "sk";
    return (
        <main className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <section className="flex-grow bg-[#FAFAF9] px-6 pb-20 pt-32">
                <div className="mx-auto max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#2F3AA2]">Mundus Languages</p>
                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{sk ? "Porozprávajme sa" : "Let’s talk"}</h1>
                    <p className="mt-5 text-lg leading-relaxed text-gray-600">{sk ? "Chcete začať s jazykom alebo potrebujete pomoc s účtom či platbou? Napíšte nám správu na Instagrame." : "Ready to start learning, or need help with your account or payment? Send us a message on Instagram."}</p>
                    <div className="mt-10 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-10">
                        <Instagram className="text-[#2F3AA2]" size={32} aria-hidden="true" />
                        <h2 className="mt-5 text-2xl font-semibold">@mundus.languages</h2>
                        <p className="mt-3 leading-relaxed text-gray-600">{sk ? "Pri záujme o výučbu nám napíšte jazyk, približnú úroveň a svoj cieľ. Pri probléme s platbou priložte číslo objednávky. Heslo ani údaje platobnej karty neposielajte." : "For lessons, tell us your language, approximate level and goal. For payment support, include your order number. Please do not send passwords or card details."}</p>
                        <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white hover:bg-[#252E82] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F3AA2]">{sk ? "Napísať na Instagrame" : "Message us on Instagram"}<ArrowUpRight size={20} aria-hidden="true" /></a>
                    </div>
                    <p className="mt-6 flex items-center gap-3 text-gray-600"><Globe size={22} className="shrink-0 text-[#2F3AA2]" aria-hidden="true" />{sk ? "Výučba prebieha online. Individuálne hodiny si dohodnete s lektorom." : "All lessons take place online. Arrange your individual lessons with your teacher."}</p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
