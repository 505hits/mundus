"use client";

import { useEffect } from "react";


export default function CalendlyWidget() {
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
        <section id="calendly" className="section bg-white">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Book now</span>
                    <h2 className="section-title">Schedule your <span className="accent-word">first lesson</span></h2>
                    <p className="section-subtitle">Select a time that works for you and start speaking immediately.</p>
                </div>

                <div
                    className="calendly-inline-widget w-full h-[700px] border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm"
                    data-url="https://calendly.com/apollinairechemla/30min?hide_gdpr_banner=1"
                />
            </div>
        </section>
    );
}
