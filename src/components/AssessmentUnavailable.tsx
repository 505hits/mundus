"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AssessmentUnavailable() {
  const { language } = useLanguage();
  const sk = language === "sk";
  return <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><p>{sk ? "Test momentálne nie je dostupný. Skúste to neskôr. S určením úrovne alebo kontrolou pokroku vám zatiaľ pomôže lektor." : "The test is currently unavailable. Try again later. Your teacher can help confirm your level or progress in the meantime."}</p><Link href="/contact" className="mt-3 inline-block font-semibold underline">{sk ? "Kontaktovať Mundus" : "Contact Mundus"}</Link></div>;
}
