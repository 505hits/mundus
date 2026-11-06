import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { currentLanguage,localeFor } from "@/lib/i18n";

export default async function AdminNewsletterPage(){
 const language=await currentLanguage();const sk=language==="sk";await requireRole("admin");
 const admin=createSupabaseAdminClient();
 const {data,error}=await admin.from("newsletter_subscribers").select("id,email,language,source,status,consent_at,confirmed_at,unsubscribed_at,created_at").order("created_at",{ascending:false}).limit(500);
 const rows=data??[];
 const active=rows.filter(r=>r.status==="active").length;
 const pending=rows.filter(r=>r.status==="pending").length;
 const unsubscribed=rows.filter(r=>r.status==="unsubscribed").length;
 const fmt=(v:string|null)=>v?new Intl.DateTimeFormat(localeFor(language),{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Bratislava"}).format(new Date(v)):"—";
 return <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2F3AA2]">{sk?"Marketing":"Marketing"}</p>
  <h1 className="mt-2 text-3xl font-semibold">{sk?"Odberatelia noviniek":"Newsletter subscribers"}</h1>
  <p className="mt-2 text-gray-600">{sk?"Zoznam vzniká iba z výslovného marketingového súhlasu a potvrdenia cez e-mail.":"This list includes only explicit marketing consent and email confirmation."}</p>
  <section className="mt-7 grid gap-4 sm:grid-cols-3">
   {[[active,sk?"Aktívni":"Active"],[pending,sk?"Čakajú na potvrdenie":"Pending confirmation"],[unsubscribed,sk?"Odhlásení":"Unsubscribed"]].map(([value,label])=><div key={String(label)} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><p className="text-3xl font-semibold">{String(value)}</p><p className="mt-1 text-sm text-gray-500">{String(label)}</p></div>)}
  </section>
  {error?<p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{sk?"Odberateľov sa nepodarilo načítať.":"Subscribers could not be loaded."}</p>:
  <div className="mt-7 overflow-x-auto rounded-3xl border border-black/5 bg-white shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#F6F7FB] text-gray-500"><tr><th className="px-5 py-4">E-mail</th><th className="px-5 py-4">{sk?"Jazyk":"Language"}</th><th className="px-5 py-4">{sk?"Zdroj":"Source"}</th><th className="px-5 py-4">{sk?"Stav":"Status"}</th><th className="px-5 py-4">{sk?"Súhlas":"Consent"}</th><th className="px-5 py-4">{sk?"Potvrdené":"Confirmed"}</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-t border-gray-100"><td className="px-5 py-4 font-medium">{r.email}</td><td className="px-5 py-4 uppercase">{r.language}</td><td className="px-5 py-4">{r.source==="popup"?(sk?"Popup":"Popup"):(sk?"Pätička":"Footer")}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status==="active"?"bg-green-50 text-green-800":r.status==="pending"?"bg-amber-50 text-amber-800":"bg-gray-100 text-gray-600"}`}>{r.status==="active"?(sk?"Aktívny":"Active"):r.status==="pending"?(sk?"Čaká":"Pending"):(sk?"Odhlásený":"Unsubscribed")}</span></td><td className="px-5 py-4 text-gray-500">{fmt(r.consent_at)}</td><td className="px-5 py-4 text-gray-500">{fmt(r.confirmed_at)}</td></tr>)}</tbody></table></div>}
  <p className="mt-5 text-xs leading-5 text-gray-500">{sk?"Marketingové kampane posielajte iba aktívnym odberateľom. Odhlásení a nepotvrdení odberatelia sa nesmú používať na newsletter kampane.":"Send marketing campaigns only to active subscribers. Unsubscribed and unconfirmed addresses must not be used for newsletter campaigns."}</p>
 </main>;
}
