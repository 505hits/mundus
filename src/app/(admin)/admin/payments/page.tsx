import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { euro, paymentEnabled } from "@/lib/payments";
import { setFirstPackageDiscount } from "./actions";
import {currentLanguage,localeFor} from "@/lib/i18n";

const paymentLabel=(status:string,sk:boolean)=>({
  pending: sk?"Čaká na platbu":"Payment pending", paid:sk?"Zaplatené":"Paid", failed:sk?"Neúspešné":"Failed",
  expired:sk?"Vypršalo":"Expired", refund_review:sk?"Vrátenie platby: preveriť":"Refund: review",
} as Record<string,string>)[status]??status;

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ problem?: string }> }) {
  const language=await currentLanguage(); const sk=language==="sk";
  await requireRole("admin");
  const { problem } = await searchParams;
  if (!paymentEnabled()) return <main className="p-8">{sk?"Online platby zatiaľ nie sú zapnuté.":"Online payments are not enabled yet."}</main>;
  const supabase = await createSupabaseServerClient();
  const { data: orders, error } = await supabase.from("payment_orders")
    .select("id,student_id,package_lessons,amount_cents,status,created_at,paid_at,lesson_package_id")
    .order("created_at", { ascending: false }).limit(100);
  if (error) return <main className="p-8" role="alert">{sk?"Platby sa nepodarilo načítať. Skontrolujte migráciu a prístupové práva.":"Payments could not be loaded. Check the migration and access permissions."}</main>;
  const studentIds = [...new Set((orders ?? []).map(order => order.student_id))];
  const { data: profiles } = studentIds.length ? await supabase.from("profiles")
    .select("id,full_name,email").in("id", studentIds) : { data: [] };
  const names = new Map((profiles ?? []).map(profile => [profile.id, profile]));
  const { data: refunds, count: reviewCount, error: refundError } = await supabase.from("payment_orders")
    .select("id,student_id,package_lessons,amount_cents,lesson_package_id,stripe_payment_intent_id", { count: "exact" })
    .eq("status", "refund_review").order("created_at", { ascending: true }).limit(100);
  const packageIds = (refunds ?? []).map(order => order.lesson_package_id).filter(Boolean);
  const { data: refundPackages } = packageIds.length ? await supabase.from("lesson_packages")
    .select("id,used_lessons,remaining_lessons,status").in("id", packageIds) : { data: [] };
  const refundBalances = new Map((refundPackages ?? []).map(pkg => [pkg.id, pkg]));
  const { data: students } = await supabase.from("profiles").select("id,full_name,email")
    .eq("role", "student").order("full_name").limit(200);
  type AccountState = { student_id: string; has_paid: boolean; has_package: boolean; has_pending: boolean; allowed: boolean | null };
  const { data: accountStates, error: stateError } = students?.length
    ? await supabase.rpc("mundus_payment_account_state", { account_ids: students.map(student => student.id) })
    : { data: [], error: null };
  const states = new Map<string, AccountState>(((accountStates ?? []) as AccountState[]).map(row => [row.student_id, row]));
  return <main className="mx-auto max-w-6xl px-5 py-8 text-[#0a0a0f] sm:px-8 lg:py-10">
    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2F3AA2]">{sk?"Admin portál":"Admin portal"}</p>
    <h1 className="mt-2 text-3xl font-semibold">{sk?"Platby":"Payments"}</h1>
    <p className="mt-3 text-gray-600">{sk?"Posledných 100 objednávok. Hodiny sa pripisujú po potvrdení platby od poskytovateľa.":"The latest 100 orders. Lessons are added after payment confirmation from the provider."}</p>
    {problem && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{sk?"Zľavu sa nepodarilo zmeniť. Pri otvorenej alebo už zaplatenej objednávke ju nemožno meniť. Obnovte údaje a skontrolujte stav študenta.":"The discount could not be changed. It cannot be changed for an open or already-paid order. Refresh the data and check the student status."}</p>}
    {refundError && <p role="alert" className="mt-6 text-red-700">{sk?"Prehľad vrátených platieb sa nepodarilo načítať.":"Refund review could not be loaded."}</p>}
    {!!reviewCount && <section className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-900">
      <h2 className="font-semibold">{sk?"Vrátené platby na preverenie:":"Refunds to review:"} {reviewCount}</h2>
      <p className="mt-2 text-sm">{sk?"Najstarších 100 prípadov. Pred úpravou balíčka skontrolujte vrátenú sumu v Stripe, využité hodiny a naplánované lekcie.":"The oldest 100 cases. Before adjusting a package, check the refunded amount in Stripe, used lessons and scheduled lessons."}</p>
      <ul className="mt-4 divide-y divide-amber-200">{(refunds ?? []).map(order => {
        const balance = refundBalances.get(order.lesson_package_id);
        return <li key={order.id} className="py-3 text-sm"><p className="font-semibold">{sk?"Objednávka":"Order"} {order.id} · {sk?"pôvodne":"originally"} {euro(order.amount_cents)} · {order.package_lessons} {sk?"hodín":"lessons"}</p>
          <p>{sk?"Účet:":"Account:"} {order.student_id}</p><p>{balance ? `${sk?"Využité":"Used"}: ${balance.used_lessons ?? 0} · ${sk?"Zostáva":"Remaining"}: ${balance.remaining_lessons ?? 0}` : (sk?"Stav hodín sa nepodarilo načítať.":"Lesson balance could not be loaded.")}</p>
          <p className="break-all">{sk?"Stripe referencia:":"Stripe reference:"} {order.stripe_payment_intent_id}</p>
        </li>;
      })}</ul>
    </section>}
    <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b bg-[#FAFAF9] text-gray-500"><tr>
        <th className="px-5 py-4">{sk?"Dátum":"Date"}</th><th className="px-5 py-4">{sk?"Študent":"Student"}</th><th className="px-5 py-4">{sk?"Balíček":"Package"}</th><th className="px-5 py-4">{sk?"Suma":"Amount"}</th><th className="px-5 py-4">{sk?"Stav":"Status"}</th>
      </tr></thead><tbody className="divide-y divide-black/5">{(orders ?? []).map(order => {
        const profile = names.get(order.student_id);
        return <tr key={order.id} className={order.status === "refund_review" ? "bg-amber-50" : ""}>
          <td className="px-5 py-4">{new Intl.DateTimeFormat(localeFor(language), { timeZone: "Europe/Bratislava", dateStyle: "medium" }).format(new Date(order.created_at))}</td>
          <td className="px-5 py-4">{profile?.full_name || profile?.email || order.student_id}</td>
          <td className="px-5 py-4">{order.package_lessons} {sk?"hodín":"lessons"}</td>
          <td className="px-5 py-4">{euro(order.amount_cents)}</td>
          <td className="px-5 py-4 font-medium">{paymentLabel(order.status,sk)}</td>
        </tr>;
      })}</tbody></table>
      {!orders?.length && <p className="p-6 text-gray-500">{sk?"Zatiaľ žiadne platby.":"No payments yet."}</p>}
    </div>
    <section className="mt-10 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{sk?"Zľava na prvý balíček podľa účtu":"First-package discount by account"}</h2>
      <p className="mt-2 text-sm text-gray-600">{sk?"Nový účet bez priradeného balíčka má zľavu automaticky. Pri existujúcom študentovi ju môžete povoliť alebo zakázať. Po zaplatení sa táto zľava už nedá použiť znova.":"A new account without an assigned package receives the discount automatically. For an existing student you can allow or disable it. Once paid, the discount cannot be used again."}</p>
      <div className="mt-5 divide-y">{(students ?? []).map(student => {
        const state = states.get(student.id);
        const choice = state?.allowed;
        const used = state?.has_paid ?? false;
        const pending = state?.has_pending ?? false;
        const unavailable = !!stateError || !state;
        const eligible = !unavailable && !used && (choice ?? !state?.has_package);
        return <div key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
          <div><p className="font-semibold">{student.full_name || student.email}</p><p className="text-gray-500">{unavailable ? (sk?"Stav zľavy sa nepodarilo overiť":"Discount status could not be verified") : used ? (sk?"Prvý nákup už bol zaplatený":"First purchase already paid") : pending ? (sk?"Prebieha platba":"Payment in progress") : eligible ? (sk?"Zľava povolená":"Discount allowed") : (sk?"Bez zľavy":"No discount")}{choice != null && !used ? (sk?" · nastavené správcom":" · set by administrator") : ""}</p></div>
          <div className="flex gap-2">
            <form action={setFirstPackageDiscount}><input type="hidden" name="student_id" value={student.id} /><input type="hidden" name="allowed" value="true" /><button disabled={unavailable || used || pending || eligible} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">{sk?"Povoliť 10 %":"Allow 10%"}</button></form>
            <form action={setFirstPackageDiscount}><input type="hidden" name="student_id" value={student.id} /><input type="hidden" name="allowed" value="false" /><button disabled={unavailable || used || pending || !eligible} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">{sk?"Zakázať zľavu":"Disable discount"}</button></form>
          </div>
        </div>;
      })}</div>
    </section>
  </main>;
}
