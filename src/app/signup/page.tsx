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
  return <AccountShell title={sk ? "Začnite sa učiť s Mundus" : "Start learning with Mundus"} description={sk ? "Vytvorte si študentský účet a potvrďte e-mail. Potom si vyberiete balíček; po platbe doplníte jazyk, úroveň, frekvenciu a preferované termíny." : "Create your student account and confirm your email. Then choose a package; after payment you’ll add your language, level, preferred frequency and availability."}>
    {process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true" ? <SignupForm next={next} /> : <p className="text-sm leading-6">{sk ? "Registráciu pripravujeme. " : "Registration is being prepared. "}<Link href="/contact" className="underline">{sk ? "Kontaktujte nás" : "Contact us"}</Link>{sk ? " a pomôžeme vám začať. Už máte účet? " : " and we’ll help you get started. Already have an account? "}<Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline">{sk ? "Prihláste sa." : "Sign in."}</Link></p>}
  </AccountShell>;
}
