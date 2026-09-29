import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { euro, paymentEnabled } from "@/lib/payments";
import { setFirstPackageDiscount } from "./actions";

const labels: Record<string, string> = {
  pending: "Čaká na platbu", paid: "Zaplatené", failed: "Neúspešné",
  expired: "Vypršalo", refund_review: "Vrátenie platby: preveriť",
};

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ problem?: string }> }) {
  await requireRole("admin");
  const { problem } = await searchParams;
  if (!paymentEnabled()) return <main className="p-8">Online platby zatiaľ nie sú zapnuté.</main>;
  const supabase = await createSupabaseServerClient();
  const { data: orders, error } = await supabase.from("payment_orders")
    .select("id,student_id,package_lessons,amount_cents,status,created_at,paid_at,lesson_package_id")
    .order("created_at", { ascending: false }).limit(100);
  if (error) return <main className="p-8" role="alert">Platby sa nepodarilo načítať. Skontrolujte migráciu a prístupové práva.</main>;
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
  return <main className="mx-auto max-w-6xl px-5 py-8 text-[#183f38] sm:px-8 lg:py-10">
    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a8049]">Admin portál</p>
    <h1 className="mt-2 text-3xl font-semibold">Platby</h1>
    <p className="mt-3 text-gray-600">Posledných 100 objednávok. Hodiny sa pripisujú po potvrdení platby od poskytovateľa.</p>
    {problem && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">Zľavu sa nepodarilo zmeniť. Pri otvorenej alebo už zaplatenej objednávke ju nemožno meniť. Obnovte údaje a skontrolujte stav študenta.</p>}
    {refundError && <p role="alert" className="mt-6 text-red-700">Prehľad vrátených platieb sa nepodarilo načítať.</p>}
    {!!reviewCount && <section className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-900">
      <h2 className="font-semibold">Vrátené platby na preverenie: {reviewCount}</h2>
      <p className="mt-2 text-sm">Najstarších 100 prípadov. Pred úpravou balíčka skontrolujte vrátenú sumu v Stripe, využité hodiny a naplánované lekcie.</p>
      <ul className="mt-4 divide-y divide-amber-200">{(refunds ?? []).map(order => {
        const balance = refundBalances.get(order.lesson_package_id);
        return <li key={order.id} className="py-3 text-sm"><p className="font-semibold">Objednávka {order.id} · pôvodne {euro(order.amount_cents)} · {order.package_lessons} hodín</p>
          <p>Účet: {order.student_id}</p><p>{balance ? `Využité: ${balance.used_lessons ?? 0} · Zostáva: ${balance.remaining_lessons ?? 0}` : "Stav hodín sa nepodarilo načítať."}</p>
          <p className="break-all">Stripe referencia: {order.stripe_payment_intent_id}</p>
        </li>;
      })}</ul>
    </section>}
    <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b bg-[#f7f8f5] text-gray-500"><tr>
        <th className="px-5 py-4">Dátum</th><th className="px-5 py-4">Študent</th><th className="px-5 py-4">Balíček</th><th className="px-5 py-4">Suma</th><th className="px-5 py-4">Stav</th>
      </tr></thead><tbody className="divide-y divide-black/5">{(orders ?? []).map(order => {
        const profile = names.get(order.student_id);
        return <tr key={order.id} className={order.status === "refund_review" ? "bg-amber-50" : ""}>
          <td className="px-5 py-4">{new Intl.DateTimeFormat("sk-SK", { timeZone: "Europe/Bratislava", dateStyle: "medium" }).format(new Date(order.created_at))}</td>
          <td className="px-5 py-4">{profile?.full_name || profile?.email || order.student_id}</td>
          <td className="px-5 py-4">{order.package_lessons} hodín</td>
          <td className="px-5 py-4">{euro(order.amount_cents)}</td>
          <td className="px-5 py-4 font-medium">{labels[order.status] ?? order.status}</td>
        </tr>;
      })}</tbody></table>
      {!orders?.length && <p className="p-6 text-gray-500">Zatiaľ žiadne platby.</p>}
    </div>
    <section className="mt-10 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Zľava na prvý balíček podľa účtu</h2>
      <p className="mt-2 text-sm text-gray-600">Nový účet bez priradeného balíčka má zľavu automaticky. Pri existujúcom študentovi ju môžete povoliť alebo zakázať. Po zaplatení sa táto zľava už nedá použiť znova.</p>
      <div className="mt-5 divide-y">{(students ?? []).map(student => {
        const state = states.get(student.id);
        const choice = state?.allowed;
        const used = state?.has_paid ?? false;
        const pending = state?.has_pending ?? false;
        const unavailable = !!stateError || !state;
        const eligible = !unavailable && !used && (choice ?? !state?.has_package);
        return <div key={student.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
          <div><p className="font-semibold">{student.full_name || student.email}</p><p className="text-gray-500">{unavailable ? "Stav zľavy sa nepodarilo overiť" : used ? "Prvý nákup už bol zaplatený" : pending ? "Prebieha platba" : eligible ? "Zľava povolená" : "Bez zľavy"}{choice != null && !used ? " · nastavené správcom" : ""}</p></div>
          <div className="flex gap-2">
            <form action={setFirstPackageDiscount}><input type="hidden" name="student_id" value={student.id} /><input type="hidden" name="allowed" value="true" /><button disabled={unavailable || used || pending || eligible} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">Povoliť 10 %</button></form>
            <form action={setFirstPackageDiscount}><input type="hidden" name="student_id" value={student.id} /><input type="hidden" name="allowed" value="false" /><button disabled={unavailable || used || pending || !eligible} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">Zakázať zľavu</button></form>
          </div>
        </div>;
      })}</div>
    </section>
  </main>;
}
