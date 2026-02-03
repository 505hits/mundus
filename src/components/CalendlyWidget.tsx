"use client";

import { useEffect } from "react";


import { useLanguage } from "@/context/LanguageContext";

export default function CalendlyWidget() {
    const { t } = useLanguage();
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
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

                <div
                    className="calendly-inline-widget w-full h-[700px] border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm"
                    data-url="https://calendly.com/mundus-languages/30min?hide_gdpr_banner=1"
                />
            </div>
        </section>
    );
}
