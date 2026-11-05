import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasCompletedOnboarding } from "@/lib/account-policy";
import PaymentStatusRefresh from "./PaymentStatusRefresh";
import { currentLanguage } from "@/lib/i18n";

type PageProps = { searchParams: Promise<{ session_id?: string }> };

export default async function PaymentReturnPage({ searchParams }: PageProps) {
  const language = await currentLanguage();
  const sk = language === "sk";
  const { user } = await requireRole("student");
  const { session_id } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const [{ data: order, error }, { data: onboarding, error: onboardingError }] = await Promise.all([
    session_id?.startsWith("cs_")
      ? supabase.from("payment_orders").select("status,package_lessons")
          .eq("student_id", user.id).eq("stripe_session_id", session_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase.from("student_onboarding").select("completed_at").eq("student_id", user.id).maybeSingle(),
  ]);

  if (!error && !onboardingError && order?.status === "paid") {
    if (!hasCompletedOnboarding(onboarding)) {
      redirect("/onboarding?next=%2Fdashboard%3Fpayment%3Dsuccess");
    }
    redirect("/dashboard?payment=success");
  }

  const pending = !error && order?.status === "pending";
  const title = error || onboardingError
    ? (sk ? "Stav platby sa nepodarilo načítať" : "Payment status could not be loaded")
    : !order
      ? (sk ? "Platbu sa nepodarilo nájsť" : "Payment could not be found")
      : pending
        ? (sk ? "Overujeme platbu" : "Verifying payment")
        : order.status === "refund_review"
          ? (sk ? "Vrátenie platby sa preveruje" : "Refund is under review")
          : (sk ? "Platba nebola dokončená" : "Payment was not completed");

  const description = error || onboardingError
    ? (sk ? "Skúste obnoviť stránku alebo skontrolujte platby v prehľade balíčkov." : "Refresh the page or check payments in your package overview.")
    : !order
      ? (sk ? "Táto platba nie je dostupná vo vašom účte. Skontrolujte svoj prehľad balíčkov." : "This payment is not available in your account. Check your package overview.")
      : pending
        ? (sk ? "Po potvrdení poskytovateľom vás automaticky posunieme na ďalší krok." : "Once the payment provider confirms the payment, we’ll automatically move you to the next step.")
        : order.status === "refund_review"
          ? (sk ? "Mundus preverí vrátenie platby a stav hodín vo vašom balíčku." : "Mundus will review the refund and the lesson balance in your package.")
          : (sk ? "Z tejto platby sa hodiny nepripísali. V prehľade balíčkov môžete začať novú platbu." : "No lessons were added from this payment. You can start a new payment from your package overview.");

  return <main className="mx-auto max-w-2xl px-5 py-16 text-[#0a0a0f]">
    <h1 className="text-3xl font-semibold">{title}</h1>
    <p className="mt-4 leading-7 text-gray-600">{description}</p>
    {pending && <PaymentStatusRefresh />}
    <Link href="/packages" className="mt-7 inline-block rounded-xl bg-[#2F3AA2] px-5 py-3 font-semibold text-white">
      {sk ? "Pozrieť moje balíčky" : "View my packages"}
    </Link>
  </main>;
}
