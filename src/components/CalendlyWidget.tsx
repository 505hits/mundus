"use client";

import { CalendarDays, Instagram, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CalendlyWidget() {
  const { language } = useLanguage();
  const sk = language === "sk";

  return (
    <section id="booking" className="bg-[#F7F8FC] py-14">
      <div className="container">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[#E5E7F0] bg-white p-6 shadow-[0_14px_40px_rgba(23,26,43,0.04)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3AA2]">
                <MessageCircle size={14} />
                {sk ? "Nie ste si istí?" : "Still not sure?"}
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {sk ? "Najprv nám môžete jednoducho napísať" : "You can simply message us first"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {sk
                  ? "Online nákup je najrýchlejší spôsob, ako začať. Ak máte otázku, napíšte nám cez web alebo Instagram. Krátky informačný hovor je len doplnková možnosť."
                  : "Online purchase is the fastest way to start. If you have a question, message us through the website or Instagram. A short information call is only an optional extra."}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252E82]">
                <MessageCircle size={17} />
                {sk ? "Napísať cez web" : "Message through website"}
              </a>
              <a href="https://www.instagram.com/mundus.languages/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2F3AA2]/20 bg-white px-5 py-3 text-sm font-semibold text-[#2F3AA2] transition hover:bg-[#F3F5FB]">
                <Instagram size={17} />
                Instagram
              </a>
              <a href="https://calendly.com/mundus-languages/30-mins-meeting-q-a" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700">
                <CalendarDays size={16} />
                {sk ? "Krátky hovor" : "Short call"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
