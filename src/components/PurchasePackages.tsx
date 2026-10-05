"use client";

import Link from "next/link";
import { ArrowRight, Check, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PACKAGE_PRICES } from "@/lib/package-catalog";

export default function PurchasePackages({ paymentsAvailable, signupAvailable }: { paymentsAvailable: boolean; signupAvailable: boolean }) {
  const { language, t } = useLanguage();
  const sk = language === "sk";
  const money = (cents: number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
  return <div id="buy-packages" className="mb-16 scroll-mt-32">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#2F3AA2]">{sk ? "Individuálne online hodiny" : "Individual online lessons"}</p>
        <h3 className="text-3xl font-semibold">{sk ? "Vyberte si svoj balíček" : "Choose your lesson package"}</h3>
        <p className="mt-3 text-gray-500">{sk ? "60 minút pre vás. Rozvrh podľa dohody s lektorom." : "60 minutes just for you. Schedule lessons with your teacher."}</p></div>
      <span className="inline-flex items-center gap-2 text-sm text-gray-500"><CreditCard size={18} />{sk ? "Jednorazová platba v EUR" : "One-time payment in EUR"}</span>
    </div>
    <div className="mb-6 rounded-2xl border border-[#2F3AA2]/20 bg-[#f0f2ff] p-5">
      <p className="font-semibold text-[#2F3AA2]">{sk ? "Prvý balíček −10 %. Iba raz na osobu." : "10% off your first package. Once per person only."}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{sk ? "Kontrolujeme meno a overený e-mail. Vytvorenie ďalšieho účtu nezakladá nový nárok na zľavu. Pri zhode mena nás kontaktujte na overenie." : "We check your name and verified email. Creating another account does not give you another discount. Contact us if your name matches another customer."}</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {PACKAGE_PRICES.map(({ lessons, amountCents }) => <article key={lessons} className={`relative flex flex-col rounded-3xl border p-6 ${lessons === 5 ? "border-[#2F3AA2] bg-[#f0f2ff] shadow-lg shadow-indigo-100/50" : "border-gray-200 bg-white"}`}>
        {lessons === 5 && <span className="mb-4 self-start rounded-full bg-[#2F3AA2] px-3 py-1 text-xs font-semibold text-white">{sk ? "Na dobrý začiatok" : "A great start"}</span>}
        <h4 className="text-xl font-semibold">{lessons} × 60 min</h4>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{sk ? "Bežná cena" : "Regular price"}</p>
        <p className="mt-1 text-lg font-medium text-gray-400 line-through">{money(amountCents)}</p>
        <div className="mt-3 rounded-xl border border-[#2F3AA2]/10 bg-white/70 p-3"><p className="text-sm font-semibold text-[#2F3AA2]">{sk ? "Prvý balíček −10 %" : "First package −10%"}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-[#181818]">{money(amountCents * 9 / 10)}</p><p className="mt-1 text-xs text-gray-500">{sk ? "Pre oprávnené študentské účty." : "For eligible student accounts."}</p></div>
        <p className="my-5 flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="shrink-0 text-[#2F3AA2]" />{sk ? "Individuálna výučba" : "One-to-one teaching"}</p>
        <Link href={paymentsAvailable ? signupAvailable ? `/signup?next=${encodeURIComponent(`/packages?selected=${lessons}`)}` : `/login?next=${encodeURIComponent(`/packages?selected=${lessons}`)}` : "/contact"} className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#252E82] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F3AA2]">{paymentsAvailable ? signupAvailable ? sk ? "Vytvoriť účet a kúpiť" : "Create account & buy" : sk ? "Prihlásiť sa a kúpiť" : "Log in & buy" : t.pricing.individual.contactLabel}<ArrowRight size={16} /></Link>
      </article>)}
    </div>
    <p className="mt-6 max-w-3xl text-sm leading-6 text-gray-500">{paymentsAvailable ? signupAvailable ? t.pricing.individual.paymentNote : t.pricing.individual.existingAccountNote : t.pricing.individual.offlineNote} {sk ? "Konečnú cenu a zľavu potvrdíme podľa vášho účtu pred platbou. Balíčky sa automaticky neobnovujú." : "Your account determines the final price and discount before payment. Packages do not renew automatically."}</p>
  </div>;
}
