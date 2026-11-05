import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import { currentLanguage } from "@/lib/i18n";

export default async function AuthErrorPage() {
  const language = await currentLanguage();
  const sk = language === "sk";

  return (
    <AccountShell
      title={sk ? "Odkaz nie je platný alebo vypršal" : "This link is invalid or expired"}
      description={
        sk
          ? "Starý alebo už použitý odkaz sa nedá znova aktivovať. Vyberte si, čo chcete obnoviť, a pošleme vám nový odkaz."
          : "An old or already-used link cannot be reactivated. Choose what you want to recover and we’ll send a new link."
      }
    >
      <Link className="block rounded-xl bg-[#2F3AA2] p-3 text-center font-semibold text-white" href="/resend-confirmation">
        {sk ? "Poslať nový potvrdzovací odkaz" : "Send a new confirmation link"}
      </Link>
      <Link className="mt-3 block rounded-xl border border-[#2F3AA2]/20 p-3 text-center font-semibold text-[#2F3AA2]" href="/forgot-password">
        {sk ? "Obnoviť heslo" : "Reset password"}
      </Link>
      <Link className="mt-5 block text-center text-sm underline" href="/login">
        {sk ? "Prejsť na prihlásenie" : "Go to sign in"}
      </Link>
      <Link className="mt-3 block text-center text-sm text-gray-500 underline" href="/contact">
        {sk ? "Kontaktovať Mundus" : "Contact Mundus"}
      </Link>
    </AccountShell>
  );
}
