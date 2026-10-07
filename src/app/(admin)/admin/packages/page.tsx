import { AlertCircle, CheckCircle2, Package, RefreshCw } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPackageStatus, formatPackageType } from "@/lib/portalLabels";
import AddPackageForm from "./AddPackageForm";
import PackageAdminActions from "./PackageAdminActions";
import {currentLanguage,localeFor} from "@/lib/i18n";
import type {Language} from "@/context/LanguageContext";

function formatDate(value: string | null,language:Language) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(localeFor(language), {
    day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Bratislava",
  }).format(new Date(value));
}

export default async function AdminPackagesPage() {
  const language=await currentLanguage(); const sk=language==="sk";
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const [
    { data: packages, error },
    { data: students, error: studentsError },
  ] = await Promise.all([
    supabase
      .from("lesson_packages")
      .select(`
        id,student_id,package_type,total_lessons,used_lessons,remaining_lessons,
        purchased_at,status,expires_at,
        student:profiles!lesson_packages_student_id_fkey(full_name,email)
      `)
      .order("purchased_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id,full_name,email")
      .eq("role", "student")
      .eq("status", "active")
      .order("full_name", { ascending: true }),
  ]);

  const rows = packages ?? [];
  const active = rows.filter((item) => item.status === "active");
  const renewalSoon = active.filter(
    (item) => (item.remaining_lessons ?? 0) > 0 && (item.remaining_lessons ?? 0) <= 2
  );
  const renewalDue = active.filter(
    (item) => (item.remaining_lessons ?? 0) === 0
  );
  const totalUsed = rows.reduce((sum, item) => sum + (item.used_lessons ?? 0), 0);

  return (
    <main className="min-h-screen bg-transparent text-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Balíčky":"Packages"}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{sk?"Prehľad balíčkov":"Package overview"}</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            {sk?"Aktuálny stav hodín v balíčkoch a upozornenia na pokračovanie.":"Current lesson balances and continuation alerts."}
          </p>
        </section>

        {(error || studentsError) && (
          <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {sk?"Nepodarilo sa načítať údaje o balíčkoch. Obnovte stránku a skúste to znova.":"Package data could not be loaded. Refresh the page and try again."}
          </div>
        )}

        <AddPackageForm students={students ?? []} />

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <Package size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{active.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Aktívne balíčky":"Active packages"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <AlertCircle size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{renewalSoon.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"2 alebo menej hodín":"2 or fewer lessons"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <RefreshCw size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{renewalDue.length}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Je čas pokračovať":"Time to continue"}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <CheckCircle2 size={20} className="text-[#2F3AA2]" />
            <p className="mt-4 text-3xl font-semibold">{totalUsed}</p>
            <p className="mt-1 text-sm text-gray-500">{sk?"Využité hodiny vo všetkých balíčkoch":"Used lessons across all packages"}</p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#E5E7F0] bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">{sk?"Zatiaľ nie sú vytvorené žiadne balíčky.":"No packages have been created yet."}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((item) => {
                const studentRelation = item.student;
                const student = Array.isArray(studentRelation) ? studentRelation[0] : studentRelation;
                const purchased = item.total_lessons ?? 0;
                const used = item.used_lessons ?? 0;
                const remaining = item.remaining_lessons ?? 0;
                const percentage = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;
                const warning = item.status === "active" && remaining <= 2;
                const displayStatus =
                  item.status === "active" && remaining === 0
                    ? (sk?"Je čas pokračovať":"Time to continue")
                    : item.status === "active" && remaining <= 2
                      ? (sk?"Čoskoro pokračovanie":"Continuation soon")
                      : formatPackageStatus(item.status,language);

                return (
                  <div key={item.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_0.9fr_1fr_0.8fr] lg:items-center lg:px-6">
                    <div>
                      <p className="font-semibold">
                        {student?.full_name?.trim() || student?.email || (sk?"Študent":"Student")}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {formatPackageType(item.package_type,language)} · {formatDate(item.purchased_at,language)}
                      </p>
                      <div className="mt-3 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#2F3AA2]" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Zakúpené":"Purchased"}</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{purchased}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Využité":"Used"}</p>
                      <p className="mt-1 text-sm font-medium lg:mt-0">{used}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 lg:hidden">{sk?"Zostáva":"Remaining"}</p>
                      <p className={`mt-1 text-lg font-semibold lg:mt-0 ${warning ? "text-[#2F3AA2]" : ""}`}>
                        {remaining}
                      </p>
                    </div>
                    <div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        warning ? "bg-[#faf1d9] text-[#2F3AA2]" : "bg-[#EEF2FF] text-[#3730A3]"
                      }`}>
                        {displayStatus.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.expires_at ? `${sk?"Platí do":"Valid until"} ${formatDate(item.expires_at,language)}` : (sk?"Bez expirácie":"No expiration")}
                    </div>
                    <PackageAdminActions
                      packageId={item.id}
                      totalLessons={purchased}
                      remainingLessons={remaining}
                      status={item.status}
                    />
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
