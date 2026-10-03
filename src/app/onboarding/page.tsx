import Link from "next/link";
import { hasCompletedOnboarding } from "@/lib/account-policy";
import { redirect } from "next/navigation";
import AccountShell from "@/components/AccountShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";
import { purchaseReturnPath } from "@/lib/purchase-intent";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = purchaseReturnPath((await searchParams).next);
  const { user } = await requireRole("student");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("student_onboarding").select("completed_at").eq("student_id", user.id).maybeSingle();
  if (error) return <AccountShell title="Nastavenie účtu sa nepodarilo načítať" description="Skúste obnoviť stránku. Vaše predchádzajúce údaje zostávajú zachované."><Link href={next ? `/onboarding?next=${encodeURIComponent(next)}` : "/onboarding"} className="inline-block rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">Skúsiť znova</Link><Link href="/contact" className="ml-4 inline-block font-semibold text-[#2F3AA2] underline">Kontaktovať Mundus</Link></AccountShell>;
  if (hasCompletedOnboarding(data)) redirect(next ?? "/dashboard");
  return <AccountShell title="Povedzte nám o svojich cieľoch" description="Stačia tri krátke odpovede. Úroveň nemusíte vedieť presne — pomôžeme vám ju určiť."><OnboardingForm next={next} /></AccountShell>;
}
