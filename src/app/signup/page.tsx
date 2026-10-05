import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import SignupForm from "./SignupForm";
import { purchaseReturnPath } from "@/lib/purchase-intent";
import { currentLanguage } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = purchaseReturnPath((await searchParams).next);
  const language = await currentLanguage();
  const sk = language === "sk";
  return <AccountShell title={sk ? "Začnite sa učiť s Mundus" : "Start learning with Mundus"} description={sk ? "Vytvorte si študentský účet. Po overení e-mailu nám poviete, aký jazyk sa chcete učiť a čo chcete dosiahnuť." : "Create your student account. After email verification, tell us which language you want to learn and what you want to achieve."}>
    {process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true" ? <SignupForm next={next} /> : <p className="text-sm leading-6">{sk ? "Registráciu pripravujeme. " : "Registration is being prepared. "}<Link href="/contact" className="underline">{sk ? "Kontaktujte nás" : "Contact us"}</Link>{sk ? " a pomôžeme vám začať. Už máte účet? " : " and we’ll help you get started. Already have an account? "}<Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline">{sk ? "Prihláste sa." : "Sign in."}</Link></p>}
  </AccountShell>;
}
