"use client";

import { CalendarDays, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CalendlyWidget() {
    const { language } = useLanguage();
    const sk = language === "sk";

    return (
        <section id="booking" className="section bg-[#F7F8FC]">
            <div className="container">
                <div className="mx-auto max-w-4xl rounded-[28px] border border-[#E5E7F0] bg-white p-7 shadow-[0_14px_40px_rgba(23,26,43,0.05)] sm:p-9">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                                <MessageCircle size={14} />
                                {sk ? "Pomoc s výberom" : "Need help choosing?"}
                            </span>
                            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                                {sk ? "Nie ste si istí balíčkom alebo jazykom?" : "Not sure which package or language path fits?"}
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                                {sk
                                    ? "Napíšte nám alebo si rezervujte krátky informačný hovor. Pomôžeme vám vybrať vhodný začiatok bez záväzku."
                                    : "Message us or book a short information call. We will help you choose a suitable starting point without obligation."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                            <a href="https://calendly.com/mundus-languages/30-mins-meeting-q-a" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]">
                                <CalendarDays size={17} />
                                {sk ? "Rezervovať krátky hovor" : "Book a short call"}
                            </a>
                            <a href="/contact" className="inline-flex items-center justify-center rounded-xl border border-[#D8DCEC] bg-white px-5 py-3 text-sm font-semibold text-[#2F3AA2] transition hover:bg-[#F3F5FB]">
                                {sk ? "Napísať Mundus" : "Contact Mundus"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
