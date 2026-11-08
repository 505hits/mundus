import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findGuide } from "@/data/mundus-guides";
import { currentLanguage } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo-locales";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return {};
  const language = await currentLanguage();
  const [title, description] = guide[language];
  return { title: `${title} | Mundus Languages`, description, alternates: localizedAlternates(`/blog/${slug}`, language), openGraph: { type: "article", title, description } };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();
  const language = await currentLanguage();
  const sk = language === "sk";
  const [title, description, sections] = guide[language];
  const url = `https://munduslanguages.com/${language}/blog/${slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: title, description, inLanguage: language, url, mainEntityOfPage: url, author: { "@type": "Organization", name: "Mundus Languages", url: "https://munduslanguages.com" } };
  return (
    <main>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-3xl px-5 pb-16 pt-32">
        <p className="text-sm font-semibold text-[#3846A7]">Mundus Languages</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-gray-700">{description}</p>
        {sections.map(([heading, body]) => (
          <section key={heading} className="mt-8">
            <h2 className="text-2xl font-semibold">{heading}</h2>
            <p className="mt-3 leading-7 text-gray-700">{body}</p>
          </section>
        ))}
        <Link href={`/${language}/languages/${guide.course}`} className="mt-8 inline-flex rounded-xl bg-[#3846A7] px-4 py-3 font-semibold text-white">{sk ? "Pozrieť online hodiny" : "Explore online lessons"}</Link>
      </article>
      <Footer />
    </main>
  );
}
