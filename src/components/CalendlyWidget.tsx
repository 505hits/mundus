"use client";

import { useEffect, useState } from "react";


import { useLanguage } from "@/context/LanguageContext";

export default function CalendlyWidget() {
    const { t, language } = useLanguage();
    const [loadError, setLoadError] = useState(false);
    const sk = language === "sk";
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        const handleError = () => setLoadError(true);
        script.addEventListener("error", handleError);
        document.body.appendChild(script);

        return () => {
            script.removeEventListener("error", handleError);
            script.remove();
        };
    }, []);

    return (
        <section id="booking" className="section bg-white">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">{t.booking.label}</span>
                    <h2 className="section-title">{t.booking.titleStart} <span className="accent-word">{t.booking.titleEnd}</span></h2>
                    <p className="section-subtitle">{t.booking.subtitle}</p>
                </div>

                <div className="mb-6 text-center">
                    {loadError && <p role="status" className="mb-3 text-sm text-gray-600">{sk ? "Rezervačný kalendár sa nepodarilo načítať. Otvorte ho priamo alebo nás kontaktujte." : "The booking calendar could not load. Open it directly or contact us."}</p>}
                    <a href="https://calendly.com/mundus-languages/30-mins-meeting-q-a" target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-[#2F3AA2] px-6 py-3 font-semibold text-white hover:bg-[#252E82]">{sk ? "Otvoriť rezervačný kalendár" : "Open booking calendar"}</a>
                    <a href="/contact" className="ml-4 inline-block py-3 font-semibold text-[#2F3AA2] underline">{sk ? "Kontaktovať Mundus" : "Contact Mundus"}</a>
                </div>
                <div
                    className="calendly-inline-widget w-full h-[700px] border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm"
                    hidden={loadError}
                    data-url="https://calendly.com/mundus-languages/30-mins-meeting-q-a?hide_gdpr_banner=1"
                />
            </div>
        </section>
    );
}
