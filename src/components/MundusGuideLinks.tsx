import Link from "next/link";
import { guides } from "@/data/mundus-guides";
import { currentLanguage } from "@/lib/i18n";

export default async function MundusGuideLinks() {
  const language = await currentLanguage();
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <h2 className="text-3xl font-semibold">{language === "sk" ? "Tipy na učenie jazykov" : "Language learning guides"}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {Object.entries(guides).map(([slug, guide]) => (
          <li key={slug}>
            <Link className="block rounded-xl border p-4 font-medium text-[#3846A7] hover:underline" href={`/${language}/blog/${slug}`}>{guide[language][0]}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
