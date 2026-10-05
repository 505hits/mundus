import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import { currentLanguage } from "@/lib/i18n";

export default async function AuthErrorPage() {
  const language = await currentLanguage();
  const sk = language === "sk";
  return <AccountShell
    title={sk ? "Odkaz alebo účet nie je dostupný" : "Link or account unavailable"}
    description={sk ? "Odkaz mohol vypršať alebo už bol použitý. Ak už máte overený účet, skúste sa prihlásiť. V prípade pozvánky požiadajte Mundus o pomoc." : "The link may have expired or already been used. If your account is already verified, try signing in. For invitation issues, contact Mundus."}
  >
    <Link className="block rounded-xl bg-[#2F3AA2] p-3 text-center font-semibold text-white" href="/login">{sk ? "Prejsť na prihlásenie" : "Go to sign in"}</Link>
    <Link className="mt-5 block text-center text-sm underline" href="/contact">{sk ? "Kontaktovať Mundus" : "Contact Mundus"}</Link>
  </AccountShell>;
}
