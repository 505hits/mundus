import Link from "next/link";
import { ArrowRight, CreditCard, Globe, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { currentLanguage } from "@/lib/i18n";
import { submitContactRequest } from "./actions";

type PageProps = { searchParams: Promise<{ sent?: string; problem?: string; type?: string }> };

export default async function ContactPage({ searchParams }: PageProps) {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { sent, problem, type } = await searchParams;
  const initialType = type === "group" ? "group" : "individual";

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <section className="flex-grow bg-[#FAFAF9] px-6 pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2F3AA2]">Mundus Languages</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{sk ? "Ako chcete začať?" : "How would you like to start?"}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-600">
            {sk
              ? "Ak chcete začať individuálne hodiny, najrýchlejšia cesta je vybrať si jazyk a balíček a zaplatiť online. Tento formulár použite iba vtedy, ak sa chcete najprv niečo opýtať."
              : "For individual lessons, the fastest path is to choose a language and package and pay online. Use this form only if you want to ask something first."}
          </p>

          <div className="mt-10">
            <div className="rounded-3xl border border-indigo-100 bg-white p-7 shadow-sm">
              <CreditCard className="text-[#2F3AA2]" size={32} aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-semibold">{sk ? "Zaplatiť online" : "Pay online"}</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                {sk ? "Vyberte si balíček, vytvorte si alebo otvorte študentský účet a pokračujte k bezpečnej platbe." : "Choose a package, create or open your student account, and continue to secure online payment."}
              </p>
              <Link href="/languages" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white hover:bg-[#252E82]">
                {sk ? "Vybrať balíček" : "Choose a package"}<ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>

          </div>

          <section className="mt-8 rounded-3xl border border-[#E5E7F0] bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2F3AA2]">{sk ? "Žiadosť cez web" : "Website request"}</p>
              <h2 className="mt-2 text-2xl font-semibold">{sk ? "Pošlite nám krátku žiadosť" : "Send us a short lesson request"}</h2>
              <p className="mt-2 text-gray-600">{sk ? "Po odoslaní sa žiadosť uloží v Mundus administrácii a dostaneme o nej upozornenie." : "After submission, the request is saved in Mundus administration and we receive a notification."}</p>
            </div>

            {sent === "1" && <div role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{sk ? "Ďakujeme. Vašu žiadosť sme prijali a ozveme sa vám." : "Thank you. We received your request and will contact you."}</div>}
            {problem && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {problem === "rate" ? (sk ? "Dostali sme už viac žiadostí z tohto e-mailu. Skúste to prosím neskôr." : "We already received several requests from this email. Please try again later.")
                : problem === "invalid" ? (sk ? "Skontrolujte prosím vyplnené údaje." : "Please check the information you entered.")
                : (sk ? "Žiadosť sa teraz nepodarilo odoslať. Skúste to prosím neskôr." : "The request could not be sent right now. Please try again later.")}
            </div>}

            <form action={submitContactRequest} className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">{sk ? "Typ výučby" : "Lesson format"}</span>
                <select name="request_type" defaultValue={initialType} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#2F3AA2]">
                  <option value="individual">{sk ? "Individuálne hodiny 1:1" : "Individual 1:1 lessons"}</option>
                  <option value="group">{sk ? "Súkromná skupina" : "Private group"}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{sk ? "Meno a priezvisko" : "Full name"}</span>
                <input name="full_name" required maxLength={120} autoComplete="name" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">E-mail</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{sk ? "Jazyk" : "Language"}</span>
                <input name="language" required maxLength={80} placeholder={sk ? "napr. angličtina" : "e.g. English"} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{sk ? "Počet hodín (voliteľné)" : "Number of lessons (optional)"}</span>
                <select name="package_lessons" defaultValue="" className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#2F3AA2]">
                  <option value="">{sk ? "Ešte neviem" : "Not sure yet"}</option>
                  {[1,5,10,20,30].map(n => <option key={n} value={n}>{n} {sk ? (n === 1 ? "hodina" : "hodín") : (n === 1 ? "lesson" : "lessons")}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{sk ? "Veľkosť skupiny (iba pre skupiny)" : "Group size (groups only)"}</span>
                <input name="group_size" type="number" min={2} max={5} defaultValue={initialType === "group" ? 2 : undefined} placeholder="2–5" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10" />
              </label>
              <div className="hidden sm:block" aria-hidden="true" />
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">{sk ? "Čo potrebujete?" : "What do you need?"}</span>
                <textarea name="message" maxLength={2000} rows={4} placeholder={sk ? "Napr. som začiatočník a chcem sa zlepšiť kvôli práci..." : "For example: I am a beginner and want to improve for work..."} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F3AA2] focus:ring-4 focus:ring-[#2F3AA2]/10" />
              </label>
              <div className="hidden" aria-hidden="true">
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <div className="sm:col-span-2">
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#2F3AA2] px-6 py-4 font-semibold text-white hover:bg-[#252E82]">
                  <Send size={18} aria-hidden="true" />{sk ? "Odoslať žiadosť" : "Send request"}
                </button>
              </div>
            </form>
          </section>

          <p className="mt-6 flex items-center gap-3 text-gray-600"><Globe size={22} className="shrink-0 text-[#2F3AA2]" aria-hidden="true" />{sk ? "Výučba prebieha online. Ponúkame individuálne hodiny aj malé súkromné skupiny." : "All lessons take place online. We offer individual lessons and small private groups."}</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
