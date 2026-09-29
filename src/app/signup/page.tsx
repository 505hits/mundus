import Link from "next/link";
import AccountShell from "@/components/AccountShell";
import SignupForm from "./SignupForm";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export const dynamic = "force-dynamic";
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = purchaseReturnPath((await searchParams).next);
  return <AccountShell title="Začnite sa učiť s Mundus" description="Vytvorte si študentský účet. Po overení e-mailu nám poviete, aký jazyk sa chcete učiť a čo chcete dosiahnuť.">
    {process.env.MUNDUS_SELF_SIGNUP_ENABLED === "true" ? <SignupForm next={next} /> : <p className="text-sm leading-6">Registráciu pripravujeme. <Link href="/contact" className="underline">Kontaktujte nás</Link> a pomôžeme vám začať. Už máte účet? <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline">Prihláste sa.</Link></p>}
  </AccountShell>;
}
