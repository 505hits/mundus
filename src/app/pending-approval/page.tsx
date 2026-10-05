import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import LanguageToggle from "@/components/LanguageToggle";
import { currentLanguage } from "@/lib/i18n";

export default async function PendingApprovalPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f7f8f5] px-6">
      <div className="absolute right-5 top-5"><LanguageToggle /></div>
      <div className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#163f3a]/10 text-2xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7445]">
          {sk ? "Portál lektora Mundus" : "Mundus teacher portal"}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#163f3a]">
          {sk ? "Váš účet čaká na schválenie" : "Your account is awaiting approval"}
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          {sk ? "Váš lektorský účet bol úspešne vytvorený. Pred vstupom do portálu ho ešte musí schváliť Mundus Languages." : "Your teacher account was created successfully. Mundus Languages must approve it before you can enter the portal."}
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {sk ? "Po schválení účtu získate prístup k svojim študentom, hodinám a nástrojom pre výučbu." : "Once approved, you will get access to your students, lessons and teaching tools."}
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-[#163f3a] px-6 py-3.5 font-semibold text-white transition hover:bg-[#12342f]"
        >
          {sk ? "Späť na Mundus Languages" : "Back to Mundus Languages"}
        </Link>

        <div className="mx-auto mt-4 max-w-[220px]">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
