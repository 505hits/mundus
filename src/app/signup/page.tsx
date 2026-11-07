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
    <SignupForm next={next} />
  </AccountShell>;
}
