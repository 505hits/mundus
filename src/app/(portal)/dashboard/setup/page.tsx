import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasCompletedOnboarding } from "@/lib/account-policy";
import { redirect } from "next/navigation";
import { currentLanguage } from "@/lib/i18n";
import OnboardingForm from "@/app/onboarding/OnboardingForm";

export default async function DashboardSetupPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const language=await currentLanguage();
  const sk=language==="sk";
  const { user }=await requireRole("student");
  const paymentSuccess=(await searchParams).payment==="success";
  const supabase=await createSupabaseServerClient();

  const [{data:onboarding,error:onboardingError},{data:packages,error:packagesError}] = await Promise.all([
    supabase.from("student_onboarding").select("completed_at").eq("student_id",user.id).maybeSingle(),
    supabase.from("lesson_packages").select("id").eq("student_id",user.id).eq("status","active").gt("remaining_lessons",0).limit(1),
  ]);

  if (!onboardingError && hasCompletedOnboarding(onboarding)) redirect("/dashboard");
  if (onboardingError || packagesError) {
    return <main className="min-h-screen bg-[#FAFAF9]"><div className="mx-auto max-w-2xl px-5 py-16"><p role="alert" className="rounded-2xl bg-red-50 p-4 text-red-700">{sk?"Nastavenie štúdia sa nepodarilo načítať. Skúste to znova.":"We could not load your learning setup. Please try again."}</p><Link href="/packages" className="mt-5 inline-block font-semibold text-[#2F3AA2] underline">{sk?"Späť na balíčky":"Back to packages"}</Link></div></main>;
  }
  if (!(packages?.length)) redirect("/packages");

  return <main className="min-h-screen bg-[#FAFAF9] text-[#171A2B]">
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <BrandLogo compact />
        <div className="text-right">
          <p className="text-sm font-semibold">{sk?"Nastavenie štúdia":"Learning setup"}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <section>
        {paymentSuccess && <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">{sk?"Platba bola potvrdená ✓":"Payment confirmed ✓"}</p>
          <p className="mt-1 text-sm leading-6 text-emerald-900/75">{sk?"Balíček je už vo vašom účte. Teraz už len doplňte údaje, aby sme vám vedeli odporučiť vhodného lektora.":"Your package is already in your account. Now add the details we need to recommend a suitable teacher."}</p>
        </div>}

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Krok 2 z 2":"Step 2 of 2"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Povedzte nám, ako sa chcete učiť":"Tell us how you want to learn"}</h1>
        <p className="mt-4 leading-7 text-gray-600">{sk?"Platbu už máte za sebou. Tieto údaje nemenia cenu ani nákup — používame ich iba na matching a nastavenie výučby.":"Your payment is already complete. These details do not change the price or purchase — we use them only for matching and lesson setup."}</p>

        <div className="mt-6 space-y-3 text-sm text-gray-600">
          <p>✓ {sk?"jazyk a približná úroveň":"language and approximate level"}</p>
          <p>✓ {sk?"koľkokrát týždenne chcete hodiny":"how many lessons per week you want"}</p>
          <p>✓ {sk?"preferované dni a čas":"preferred days and time"}</p>
          <p>✓ {sk?"váš hlavný cieľ":"your main goal"}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5E7F0] bg-white p-6 shadow-sm sm:p-8">
        <OnboardingForm next="/dashboard?payment=success" />
      </section>
    </div>
  </main>;
}
