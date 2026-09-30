import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PaymentStatusRefresh from "./PaymentStatusRefresh";

type PageProps = { searchParams: Promise<{ session_id?: string }> };
export default async function PaymentReturnPage({ searchParams }: PageProps) {
  const { user } = await requireRole("student");
  const { session_id } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: order, error } = session_id?.startsWith("cs_")
    ? await supabase.from("payment_orders").select("status,package_lessons")
        .eq("student_id", user.id).eq("stripe_session_id", session_id).maybeSingle()
    : { data: null, error: null };
  const pending = !error && order?.status === "pending";
  const title = error ? "Stav platby sa nepodarilo načítať" : !order ? "Platbu sa nepodarilo nájsť"
    : order.status === "paid" ? "Balíček je pripravený" : pending ? "Overujeme platbu"
    : order.status === "refund_review" ? "Vrátenie platby sa preveruje" : "Platba nebola dokončená";
  const description = error ? "Skúste obnoviť stránku alebo skontrolujte platby v prehľade balíčkov."
    : !order ? "Táto platba nie je dostupná vo vašom účte. Skontrolujte svoj prehľad balíčkov."
    : order.status === "paid" ? `Pripísali sme vám ${order.package_lessons} hodín. Môžete pokračovať v plánovaní výučby.`
    : pending ? "Po potvrdení poskytovateľom sa hodiny automaticky zobrazia vo vašom účte."
    : order.status === "refund_review" ? "Mundus preverí vrátenie platby a stav hodín vo vašom balíčku."
    : "Z tejto platby sa hodiny nepripísali. V prehľade balíčkov môžete začať novú platbu.";
  return <main className="mx-auto max-w-2xl px-5 py-16 text-[#183f38]">
    <h1 className="text-3xl font-semibold">{title}</h1>
    <p className="mt-4 leading-7 text-gray-600">{description}</p>
    {pending && <PaymentStatusRefresh />}
    <Link href="/packages" className="mt-7 inline-block rounded-xl bg-[#183f38] px-5 py-3 font-semibold text-white">Pozrieť moje balíčky</Link>
  </main>;
}
