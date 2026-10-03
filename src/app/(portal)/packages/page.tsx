import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PACKAGE_PRICES, euro, paymentEnabled } from "@/lib/payments";
import { cancelPackageCheckout, resumePackageCheckout, startPackageCheckout } from "./actions";
import { PACKAGE_LESSONS } from "@/lib/purchase-intent";

type PageProps = { searchParams: Promise<{ problem?: string; cancelled?: string; selected?: string }> };
export default async function PackagesPage({ searchParams }: PageProps) {
  const { problem, cancelled, selected } = await searchParams;
  const selectedLessons = PACKAGE_LESSONS.find(item => String(item) === selected);
  const { user } = await requireRole("student", selectedLessons ? `/packages?selected=${selectedLessons}` : undefined);
  const enabled = paymentEnabled();
  const supabase = await createSupabaseServerClient();
  const [{ data: packages, error: packageError }, { data: orders, error: orderError }, { data: discountSetting, error: discountError }, { data: paidOrders, error: paidError }, { data: pendingOrder, error: pendingError }] = await Promise.all([
    supabase.from("lesson_packages").select("id,remaining_lessons,used_lessons,total_lessons,purchased_at,status")
      .eq("student_id", user.id).order("purchased_at", { ascending: false }),
    enabled ? supabase.from("payment_orders").select("id,package_lessons,amount_cents,status,created_at,stripe_session_id")
      .eq("student_id", user.id).order("created_at", { ascending: false }).limit(10) : Promise.resolve({ data: [], error: null }),
    enabled ? supabase.from("payment_discount_settings").select("first_package_allowed")
      .eq("student_id", user.id).maybeSingle() : Promise.resolve({ data: null, error: null }),
    enabled ? supabase.from("payment_orders").select("id").eq("student_id", user.id)
      .in("status", ["paid", "refund_review"]).limit(1) : Promise.resolve({ data: [], error: null }),
    enabled ? supabase.from("payment_orders").select("id,package_lessons,stripe_session_id")
      .eq("student_id", user.id).eq("status", "pending").maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  const { data: identityEligible, error: identityError } = enabled
    ? await supabase.rpc("mundus_first_discount_eligible", { buyer_id: user.id })
    : { data: false, error: null };
  const unavailable = !!(packageError || orderError || discountError || paidError || pendingError || identityError);
  const first = !unavailable && identityEligible === true && !paidOrders?.length &&
    (discountSetting?.first_package_allowed ?? !packages?.length);
  const totalRemaining = (packages ?? []).filter(p => p.status === "active").reduce((sum, item) => sum + (item.remaining_lessons ?? 0), 0);

  return <main className="mx-auto max-w-6xl px-5 py-8 text-[#183f38] sm:px-8 lg:py-10">
    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9a8049]">Moje balíčky</p>
    <h1 className="mt-2 text-3xl font-semibold">Hodiny a platby</h1>
    <p className="mt-3 text-gray-600">Zostáva vám <strong>{totalRemaining} {totalRemaining === 1 ? "hodina" : "hodín"}</strong>. Nový balíček si vyberiete nižšie.</p>
    {packages && packages.length > 0 && <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5"><h2 className="text-xl font-semibold">Vaše zakúpené balíčky</h2><ul className="mt-4 space-y-3">{packages.map(pkg => <li key={pkg.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"><div><p className="font-semibold">{pkg.total_lessons} hodín · {pkg.status === "active" ? "Aktívny" : pkg.status === "completed" ? "Vyčerpaný" : "Neaktívny"}</p><p className="mt-1 text-sm text-gray-600">Využité: {pkg.used_lessons ?? 0} · Zostáva: {pkg.remaining_lessons ?? 0}</p></div><a href={enabled ? "#available-packages" : "/contact"} className="text-sm font-semibold text-[#2F3AA2] underline">Kúpiť ďalší balíček</a></li>)}</ul></section>}
    <div className="mt-5 rounded-2xl border border-[#2F3AA2]/20 bg-[#f0f2ff] p-5"><p className="font-semibold text-[#2F3AA2]">Prvý balíček −10 %. Iba raz na osobu.</p><p className="mt-2 text-sm text-gray-600">Kontrolujeme celé meno a overený e-mail. Ďalší účet ani zmena údajov neobnovuje nárok na zľavu. Ak sa vaše meno zhoduje s iným klientom, kontaktujte Mundus na overenie.</p></div>
    {selectedLessons && enabled && <p role="status" className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">Vybrali ste si {selectedLessons} {selectedLessons === 1 ? "hodinu" : "hodín"}. Skontrolujte cenu podľa svojho účtu a pokračujte tlačidlom pri balíčku.</p>}
    {!enabled && <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Online platby pripravujeme. Ak chcete pokračovať vo výučbe, kontaktujte Mundus Languages.</p>}
    {unavailable && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">Stav účtu sa nepodarilo overiť. Skúste obnoviť stránku pred začatím platby.</p>}
    {cancelled && <p role="status" className="mt-6 rounded-2xl bg-gray-100 p-4 text-sm">Vrátili ste sa z platobnej stránky. Stav platby nájdete nižšie; potvrdenie sa môže zobraziť s oneskorením.</p>}
    {problem && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{problem === "price-changed" ? "Nárok na zľavu sa medzičasom zmenil. Skontrolujte aktuálnu cenu a potvrďte výber znova." : problem === "pending" ? "Už máte otvorenú platbu. Môžete ju zrušiť nižšie." : problem === "processing" ? "Platba sa už spracúva. Počkajte na potvrdenie." : "Platbu sa teraz nepodarilo spracovať. Skúste to znova neskôr."}</p>}
    {pendingOrder && <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><p>{pendingOrder.stripe_session_id ? <>Máte otvorenú platbu za {pendingOrder.package_lessons} hodín. Po jej dokončení sa balíček pripíše automaticky.</> : <>Pripravuje sa platba za {pendingOrder.package_lessons} hodín. Obnovte stránku o chvíľu. Ak sa tlačidlo na pokračovanie nezobrazí, kontaktujte Mundus a uveďte číslo objednávky <span className="break-all font-mono">{pendingOrder.id}</span>.</>}</p>
      {!pendingOrder.stripe_session_id && <a href="/contact" className="mt-3 inline-block font-semibold underline">Kontaktovať Mundus</a>}
      {pendingOrder.stripe_session_id && <form action={resumePackageCheckout} className="mt-3"><input type="hidden" name="order_id" value={pendingOrder.id} /><button className="rounded-lg bg-[#183f38] px-4 py-2 font-semibold text-white">Pokračovať v platbe</button></form>}
      {pendingOrder.stripe_session_id && <form action={cancelPackageCheckout} className="mt-3"><input type="hidden" name="order_id" value={pendingOrder.id} /><button className="font-semibold underline">Zrušiť otvorenú platbu</button></form>}
    </div>}
    <section id="available-packages" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Balíčky hodín">
      {PACKAGE_PRICES.map(({ lessons, amountCents }) => {
        const shown = first ? amountCents * 9 / 10 : amountCents;
        return <article key={lessons} className={`rounded-3xl border bg-white p-6 shadow-sm ${selectedLessons === lessons ? "border-[#2F3AA2] ring-2 ring-[#2F3AA2]/20" : "border-black/5"}`}>
          <p className="text-lg font-semibold">{lessons} {lessons === 1 ? "hodina" : "hodín"}</p>
          <p className="mt-3 text-3xl font-semibold">{euro(shown)}</p>
          {first && <p className="mt-1 text-sm text-gray-500">Prvý balíček: zľava 10 % · bežne {euro(amountCents)}</p>}
          <p className="mt-3 text-sm text-gray-500">Individuálne online hodiny po 60 minút</p>
          <form action={startPackageCheckout} className="mt-6"><input type="hidden" name="lessons" value={lessons} /><input type="hidden" name="expected_amount" value={shown} />
            <button disabled={!enabled || unavailable || !!pendingOrder} className="w-full rounded-xl bg-[#183f38] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{pendingOrder ? "Čaká sa na platbu" : "Kúpiť balíček"}</button>
          </form>
        </article>;
      })}
    </section>
    <p className="mt-5 text-sm text-gray-500">Cena sa overí pred otvorením platby. Hodiny sa pripíšu až po potvrdení platby.</p>
    {orders && orders.length > 0 && <section className="mt-10"><h2 className="text-xl font-semibold">Platby</h2>
      <ul className="mt-4 divide-y rounded-2xl bg-white px-5">{orders.map(order => <li className="flex justify-between gap-4 py-4 text-sm" key={order.id}>
        <span>{order.package_lessons} hodín · {new Intl.DateTimeFormat("sk-SK", { timeZone: "Europe/Bratislava", dateStyle: "medium" }).format(new Date(order.created_at))}</span>
        <span>{euro(order.amount_cents)} · {order.status === "paid" ? "Zaplatené" : order.status === "pending" ? "Čaká na platbu" : order.status === "refund_review" ? "Vrátenie sa preveruje" : "Nedokončené"}</span>
      </li>)}</ul>
    </section>}
  </main>;
}
