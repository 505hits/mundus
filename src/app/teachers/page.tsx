import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { submitContactRequest } from "@/app/contact/actions";
import Footer from "@/components/Footer";
import TeacherProfiles from "@/components/TeacherProfiles";
import { publicTeachers } from "@/lib/public-teachers";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";

export async function generateMetadata(): Promise<Metadata> {
  const language = await currentLanguage();
  const sk = language === "sk";
  return {
    title: sk ? "Lektori | Mundus Languages" : "Teachers | Mundus Languages",
    description: sk
      ? "Spoznajte lektorov Mundus Languages predstavených na našom Instagrame."
      : "Meet Mundus Languages teachers introduced on our Instagram.",
    alternates: localizedAlternates("/teachers", language),
  };
}

export default async function TeachersPage({ searchParams }: { searchParams: Promise<{ sent?: string; problem?: string }> }) {
  const { sent, problem } = await searchParams;
  const language = await currentLanguage();
  const sk = language === "sk";
  const approved = await publicTeachers();
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-[#171A2B] px-6 pb-14 pt-32 text-white sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C7D2FE]">{sk ? "Lektori" : "Teachers"}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-.04em] !text-white sm:text-6xl">
            {sk ? "Spoznajte ľudí, s ktorými sa budete učiť." : "Meet the people you can learn with."}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#D8DBE8]">
            {sk ? "Spoznajte zverejnených lektorov Mundus s menami, jazykmi a fotografiami." : "Meet published Mundus teachers through names, languages and portrait photos."}
          </p>
        </div>
      </section>
      <TeacherProfiles approved={approved} />
      <section id="apply" className="scroll-mt-24 bg-[#F3F5FB] px-5 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-5 sm:p-8">
          <h2 className="text-2xl font-semibold">{sk ? "Chcete učiť v Mundus?" : "Want to teach with Mundus?"}</h2>
          <p className="mt-2 text-sm text-gray-600">{sk ? "Napíšte nám, ktoré jazyky učíte a aké máte skúsenosti." : "Tell us which languages you teach and a little about your experience."}</p>
          {sent === "1" && <p role="status" className="mt-4 text-green-800">{sk ? "Ďakujeme, prihlášku sme prijali." : "Thank you. We received your application."}</p>}
          {problem && <p role="alert" className="mt-4 text-red-800">{problem === "invalid" ? (sk ? "Skontrolujte vyplnené údaje." : "Please check the information you entered.") : (sk ? "Prihlášku sa nepodarilo odoslať. Skúste to neskôr." : "We couldn't submit your application. Please try again later.")}</p>}
          <form action={submitContactRequest} className="mt-5 grid gap-4">
            <input type="hidden" name="source" value="teacher_application" />
            <input type="hidden" name="ui_language" value={language} />
            <input type="text" name="website" hidden tabIndex={-1} autoComplete="off" />
            <label className="grid gap-1 text-sm">{sk ? "Meno a priezvisko" : "Full name"}<input className="rounded-lg border p-2" name="full_name" autoComplete="name" required minLength={2} maxLength={120} /></label>
            <label className="grid gap-1 text-sm">Email<input className="rounded-lg border p-2" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label className="grid gap-1 text-sm">{sk ? "Jazyky, ktoré učíte" : "Languages you teach"}<input className="rounded-lg border p-2" name="language" required minLength={2} maxLength={80} /></label>
            <label className="grid gap-1 text-sm">{sk ? "Skúsenosti a dostupnosť" : "Experience and availability"}<textarea className="rounded-lg border p-2" name="message" rows={4} required minLength={10} maxLength={1960} /></label>
            <a href={`/${language}/privacy`} className="text-xs text-gray-600 underline">{sk ? "Ako spracúvame vaše údaje" : "How we handle your data"}</a>
            <button className="rounded-lg bg-[#2F3AA2] px-4 py-3 font-semibold text-white" type="submit">{sk ? "Odoslať prihlášku" : "Submit application"}</button>
          </form>
            <p className="mt-4 text-sm text-gray-600">{sk ? "Môžete nám napísať aj priamo na " : "You can also email us directly at "}<a className="font-medium underline" href="mailto:mundus.languages@gmail.com">mundus.languages@gmail.com</a>.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
