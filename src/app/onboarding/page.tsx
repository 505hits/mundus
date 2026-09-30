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
  const { data } = await supabase.from("student_onboarding").select("student_id").eq("student_id", user.id).maybeSingle();
  if (data) redirect(next ?? "/dashboard");
  return <AccountShell title="Povedzte nám o svojich cieľoch" description="Stačia tri krátke odpovede. Úroveň nemusíte vedieť presne — pomôžeme vám ju určiť."><OnboardingForm next={next} /></AccountShell>;
}
