import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { PACKAGE_PRICES, firstPackageAmountCents, type PackageDuration } from "@/lib/package-catalog";
import { MUNDUS_LANGUAGE_OPTIONS, MUNDUS_LANGUAGE_VALUES } from "@/lib/language-offer";
import { paymentEnabled } from "@/lib/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment | Mundus Languages",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ selected?: string; duration?: string; language?: string }>;
};

export default async function PaymentPage({ searchParams }: PageProps) {
  const uiLanguage = await currentLanguage();
  const sk = uiLanguage === "sk";
  const prefix = `/${uiLanguage}`;
  const params = await searchParams;
  const lessons = Number(params.selected);
  const duration = Number(params.duration) as PackageDuration;
  const selectedLanguage = params.language && MUNDUS_LANGUAGE_VALUES.includes(params.language as (typeof MUNDUS_LANGUAGE_VALUES)[number])
    ? params.language
    : "";
  const pkg = PACKAGE_PRICES.find(item => item.lessons === lessons && item.durationMinutes === duration);

  if (!pkg || !selectedLanguage) {
    return (
      <main className="min-h-screen bg-[#F7F8FC]">
        <Navbar />
        <section className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#DDE2FB] bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Platba" : "Payment"}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{sk ? "Najprv vyberte jazyk a balíček." : "Choose a language and package first."}</h1>
            <p className="mt-4 leading-7 text-gray-600">{sk ? "Vráťte sa do cenníka, vyberte jazyk, dĺžku hodiny a počet hodín." : "Return to pricing and choose your language, lesson length and package size."}</p>
            <Link href={`${prefix}/pricing`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white">
              <ArrowLeft size={17}/>{sk ? "Späť na cenník" : "Back to pricing"}
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const languageLabel = sk
    ? (MUNDUS_LANGUAGE_OPTIONS.find(item => item.value === selectedLanguage)?.label ?? selectedLanguage)
    : selectedLanguage;
  const money = (cents:number) => new Intl.NumberFormat(sk ? "sk-SK" : "en-IE", { style:"currency", currency:"EUR" }).format(cents/100);
  const firstPrice = firstPackageAmountCents(pkg.amountCents);
  const nextPath = `/packages?selected=${pkg.lessons}&duration=${pkg.durationMinutes}&language=${encodeURIComponent(selectedLanguage)}`;
  const signupHref = `/signup?next=${encodeURIComponent(nextPath)}`;
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;
  const enabled = paymentEnabled();
  const contactFallback = `${prefix}/contact?language=${encodeURIComponent(selectedLanguage)}&lessons=${pkg.lessons}&duration=${pkg.durationMinutes}`;

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <Navbar />
      <section className="px-5 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk ? "Platba" : "Payment"}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em] text-[#171A2B] sm:text-5xl">
              {sk ? "Skontrolujte výber a pokračujte k bezpečnej platbe." : "Review your selection and continue to secure payment."}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              {sk ? "Platba prebieha cez Stripe. Pred otvorením platobnej brány potrebujeme študentský účet, aby sme správne priradili balíček, zľavu a hodiny." : "Payment is processed by Stripe. Before opening checkout, we need a student account so we can correctly assign your package, discount and lesson credits."}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-[#DDE2FB] bg-white p-5 shadow-sm sm:p-7">
              <div className="grid gap-5 sm:grid-cols-3">
                <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-gray-400">{sk ? "Jazyk" : "Language"}</p><p className="mt-2 text-lg font-semibold">{languageLabel}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-gray-400">{sk ? "Balíček" : "Package"}</p><p className="mt-2 text-lg font-semibold">{pkg.lessons} × {pkg.durationMinutes} min</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-gray-400">{sk ? "Bežná cena" : "Regular price"}</p><p className="mt-2 text-lg font-semibold">{money(pkg.amountCents)}</p></div>
              </div>
              <div className="mt-5 rounded-2xl border border-[#DDE2FB] bg-[#F5F6FF] p-4">
                <p className="font-semibold text-[#2F3AA2]">{sk ? `Prvý oprávnený balíček: ${money(firstPrice)} (−10 %)` : `First eligible package: ${money(firstPrice)} (−10%)`}</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">{sk ? "Nárok na zľavu overíme podľa účtu. Zľavu je možné použiť iba raz na osobu." : "Discount eligibility is verified against your account. The discount can be used only once per person."}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2"><LockKeyhole size={16} className="text-[#2F3AA2]"/>{sk ? "Bezpečná platba cez Stripe" : "Secure Stripe payment"}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2"><ShieldCheck size={16} className="text-[#2F3AA2]"/>{sk ? "Hodiny sa pripíšu až po potvrdení platby" : "Credits are added only after payment confirmation"}</span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#C7CDF6] bg-white p-6 shadow-[0_18px_50px_rgba(47,58,162,.10)] sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F3AA2]"><CreditCard size={22}/></div>
            <h2 className="mt-5 text-2xl font-semibold">{sk ? "Pokračovať k platbe" : "Continue to payment"}</h2>
            {enabled ? (
              <>
                <p className="mt-3 text-sm leading-6 text-gray-600">{sk ? "Ak ste nový študent, vytvorte si účet. Ak účet už máte, prihláste sa. Po overení účtu pokračujete priamo k Stripe platbe." : "New student? Create an account. Already registered? Sign in. After account verification you continue directly to Stripe checkout."}</p>
                <div className="mt-6 grid gap-3">
                  <Link href={signupHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3.5 font-semibold text-white">
                    {sk ? "Vytvoriť účet a pokračovať" : "Create account & continue"}<ArrowRight size={17}/>
                  </Link>
                  <Link href={loginHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE2FB] bg-white px-5 py-3.5 font-semibold text-[#2F3AA2]">
                    {sk ? "Prihlásiť sa a pokračovať" : "Sign in & continue"}<ArrowRight size={17}/>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">{sk ? "Online platba zatiaľ nie je aktívna. Vybraný jazyk, počet hodín a dĺžku lekcie môžete odoslať ako nezáväznú žiadosť." : "Online payment is not active yet. You can send your selected language, package and lesson length as a no-obligation request."}</p>
                <Link href={contactFallback} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{sk ? "Poslať žiadosť o vybraný balíček" : "Request your selected package"}<ArrowRight size={16}/></Link>
              </>
            )}
            <Link href={`${prefix}/pricing?language=${encodeURIComponent(selectedLanguage)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 underline underline-offset-4">
              <ArrowLeft size={15}/>{sk ? "Zmeniť balíček" : "Change package"}
            </Link>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
