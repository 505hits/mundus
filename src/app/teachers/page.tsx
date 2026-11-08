import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
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

export default async function TeachersPage() {
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
      <Footer />
    </main>
  );
}
