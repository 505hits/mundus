import Link from "next/link";
import { hasCompletedOnboarding } from "@/lib/account-policy";
import { redirect } from "next/navigation";
import AccountShell from "@/components/AccountShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";
import { purchaseReturnPath } from "@/lib/purchase-intent";
import { currentLanguage } from "@/lib/i18n";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = purchaseReturnPath((await searchParams).next);
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("student_onboarding").select("completed_at").eq("student_id", user.id).maybeSingle();
  if (error) return <AccountShell title={sk ? "Nastavenie účtu sa nepodarilo načítať" : "We could not load your account setup"} description={sk ? "Skúste obnoviť stránku. Vaše predchádzajúce údaje zostávajú zachované." : "Refresh the page and try again. Your previous data remains saved."}><Link href={next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding"} className="inline-block rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">{sk ? "Skúsiť znova" : "Try again"}</Link><Link href="/contact" className="ml-4 inline-block font-semibold text-[#2F3AA2] underline">{sk ? "Kontaktovať Mundus" : "Contact Mundus"}</Link></AccountShell>;
  if (hasCompletedOnboarding(data)) redirect(next ?? "/dashboard");
  return <AccountShell title={sk ? "Povedzte nám o svojich cieľoch" : "Tell us about your goals"} description={sk ? "Vyberte jazyk, približnú úroveň, cieľ a voliteľne aj dni a časy, ktoré vám najviac vyhovujú. Pomôže nám to odporučiť vhodného lektora." : "Choose your language, approximate level, goal and optionally the days and times that suit you best. This helps us recommend a suitable teacher."}><OnboardingForm next={next} /></AccountShell>;
}
