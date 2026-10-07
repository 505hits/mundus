import Link from "next/link";
import { currentLanguage } from "@/lib/i18n";

export default async function NotFound() {
  const language = await currentLanguage();
  const sk = language === "sk";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-5 py-12 text-[#0a0a0f]">
      <section className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {sk ? "Túto stránku sme nenašli" : "We couldn’t find this page"}
        </h1>
        <p className="mt-3 leading-7 text-gray-500">
          {sk
            ? "Odkaz môže byť neaktuálny alebo stránka už nie je dostupná."
            : "The link may be outdated or the page is no longer available."}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-2xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">
            {sk ? "Späť na hlavnú stránku" : "Back to home"}
          </Link>
          <Link href="/dashboard" className="rounded-2xl border border-black/10 px-5 py-3 font-semibold">
            {sk ? "Otvoriť portál" : "Open portal"}
          </Link>
        </div>
      </section>
    </main>
  );
}
