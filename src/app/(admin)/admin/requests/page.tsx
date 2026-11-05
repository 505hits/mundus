import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { currentLanguage, localeFor } from "@/lib/i18n";
import { updateContactRequest } from "./actions";

type ContactRequest = {
  id: string; full_name: string; email: string; language: string;
  package_lessons: number | null; message: string; status: string; created_at: string;
};

export default async function AdminRequestsPage({ searchParams }: {
  searchParams: Promise<{ status?: string; problem?: string }>;
}) {
  await requireRole("admin");
  const language = await currentLanguage();
  const sk = language === "sk";
  const params = await searchParams;
  const status = ["new", "contacted", "closed"].includes(params.status ?? "") ? params.status! : "new";
  const labels: Record<string, string> = { new: sk ? "Nové" : "New", contacted: sk ? "Kontaktované" : "Contacted", closed: sk ? "Uzavreté" : "Closed" };
  let requests: ContactRequest[] = [];
  let unavailable = false;
  try {
    const { data, error } = await createSupabaseAdminClient().from("contact_requests")
      .select("id,full_name,email,language,package_lessons,message,status,created_at")
      .eq("status", status).order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    requests = data ?? [];
  } catch {
    unavailable = true;
  }
  return <main className="mx-auto max-w-6xl px-5 py-8 text-[#0a0a0f] sm:px-8">
    <h1 className="text-3xl font-semibold">{sk ? "Žiadosti z webu" : "Website requests"}</h1>
    <p className="mt-3 text-gray-600">{sk ? "Posledných 100 žiadostí podľa zvoleného stavu." : "The latest 100 requests for the selected status."}</p>
    <nav aria-label={sk ? "Stav žiadostí" : "Request status"} className="my-6 flex gap-4">{Object.entries(labels).map(([key, label]) =>
      <a key={key} href={`/admin/requests?status=${key}`} aria-current={status === key ? "page" : undefined} className="rounded-lg border px-4 py-2 font-medium aria-[current=page]:bg-[#EEF2FF]">{label}</a>
    )}</nav>
    {(unavailable || params.problem) && <p role="alert" className="my-4 rounded-xl bg-red-50 p-4 text-red-700">{sk ? "Žiadosti sa nepodarilo načítať alebo uložiť. Skúste to znova alebo kontaktujte správcu webu." : "Requests could not be loaded or saved. Try again or contact the website administrator."}</p>}
    {!unavailable && requests.length === 0 && <p>{sk ? "Žiadne žiadosti v tomto stave." : "No requests with this status."}</p>}
    <div className="space-y-5">{requests.map(request => <article key={request.id} className="rounded-2xl border bg-white p-5">
      <h2 className="text-xl font-semibold">{request.full_name}</h2>
      <a href={`mailto:${request.email}`} className="text-[#2F3AA2] underline">{request.email}</a>
      <p className="mt-3">{request.language}{request.package_lessons ? ` · ${request.package_lessons} ${sk ? "hodín" : "lessons"}` : ""}</p>
      <p className="mt-2 text-sm text-gray-500">{new Intl.DateTimeFormat(localeFor(language), { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(new Date(request.created_at))}</p>
      <p className="my-4 whitespace-pre-wrap break-words">{request.message}</p>
      <form action={updateContactRequest} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="current_status" value={status} />
        <label className="flex items-center gap-2">{sk ? "Stav" : "Status"}
          <select name="status" defaultValue={request.status} className="rounded-lg border p-2">{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        </label>
        <button className="rounded-lg bg-[#2F3AA2] px-4 py-2 font-semibold text-white">{sk ? "Uložiť" : "Save"}</button>
      </form>
    </article>)}</div>
  </main>;
}
