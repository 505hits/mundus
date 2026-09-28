import { AlertCircle, CheckCircle2, Package, RefreshCw } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function AdminPackagesPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: packages, error } = await supabase
    .from("lesson_packages")
    .select(`
      id,student_id,package_type,total_lessons,used_lessons,remaining_lessons,
      purchased_at,status,expires_at,
      student:profiles!lesson_packages_student_id_fkey(full_name,email)
    `)
    .order("purchased_at", { ascending: false });

  const rows = packages ?? [];
  const active = rows.filter((item) => item.status === "active");
  const renewalSoon = active.filter(
    (item) => (item.remaining_lessons ?? 0) > 0 && (item.remaining_lessons ?? 0) <= 2
  );
  const renewalDue = rows.filter(
    (item) => (item.remaining_lessons ?? 0) === 0
  );
  const totalVyužité = rows.reduce((sum, item) => sum + (item.used_lessons ?? 0), 0);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#183f38]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a8049]">Packages</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Prehľad balíčkov</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Aktuálny stav hodín v balíčkoch a upozornenia na pokračovanie.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            We couldn&apos;t load package data. Please refresh and try again.
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <Package size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{active.length}</p>
            <p className="mt-1 text-sm text-gray-500">Aktívne balíčky</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{renewalSoon.length}</p>
            <p className="mt-1 text-sm text-gray-500">2 alebo menej hodín</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <RefreshCw size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{renewalDue.length}</p>
            <p className="mt-1 text-sm text-gray-500">Je čas pokračovať</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#9a8049]" />
            <p className="mt-4 text-3xl font-semibold">{totalVyužité}</p>
            <p className="mt-1 text-sm text-gray-500">Hodiny used in all packages</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">Zatiaľ nie sú vytvorené žiadne balíčky.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((item) => {
                const studentRelation = item.student;
                const student = Array.isArray(studentRelation) ? studentRelation[0] : studentRelation;
                const purchased = item.total_lessons ?? 0;
                const used = item.used_lessons ?? 0;
                const remaining = item.remaining_lessons ?? 0;
                const percentage = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;
                const warning = remaining <= 2;
                const displayStav =
                  remaining === 0 ? "Je čas pokračovať" :
                  item.status === "active" && remaining <= 2 ? "Čoskoro pokračovanie" :
                  item.status || "Unknown";

                return (
                  <div key={item.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_0.8fr_0.7fr_0.7fr_0.9fr_1fr] lg:items-center lg:px-6">
                    <div>
                      <p className="font-semibold">
                        {student?.full_name?.trim() || student?.email || "Študent"}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {item.package_type || "Balíček hodín"} · {formatDate(item.purchased_at)}
                      </p>
                      <div className="mt-3 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#183f38]" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Zakúpené</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{purchased}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Využité</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{used}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">Zostáva</p>
                      <p className={`mt-1 text-lg font-semibold lg:mt-0 ${warning ? "text-[#9a8049]" : ""}`}>
                        {remaining}
                      </p>
                    </div>
                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        warning ? "bg-[#faf1d9] text-[#9a8049]" : "bg-[#eef3ef] text-[#527064]"
                      }`}>
                        {displayStav.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.expires_at ? `Platí do ${formatDate(item.expires_at)}` : "Bez expirácie"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
