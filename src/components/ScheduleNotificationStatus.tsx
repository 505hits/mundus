import RetryNotification from "./RetryNotification";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
export default async function ScheduleNotificationStatus() {
 await requireRole("admin");
 let failedJobs: {id:string;recipient_email:string;event:string}[]=[];
 let counts: {waiting:number;failed:number;sent:number}|null=null;
 try {
  const admin=createSupabaseAdminClient();
  const [waiting,failed,sent,jobs]=await Promise.all([
   admin.from("notification_outbox").select("id",{count:"exact",head:true}).in("status",["pending","sending"]),
   admin.from("notification_outbox").select("id",{count:"exact",head:true}).eq("status","failed"),
   admin.from("notification_outbox").select("id",{count:"exact",head:true}).eq("status","sent"),
   admin.from("notification_outbox").select("id,recipient_email,event").eq("status","failed").order("created_at",{ascending:false}).limit(10),
  ]);
  if(!waiting.error&&!failed.error&&!sent.error) counts={waiting:waiting.count??0,failed:failed.count??0,sent:sent.count??0};
  if(!jobs.error)failedJobs=jobs.data??[];
 }catch{}
 const enabled=process.env.MUNDUS_EMAIL_NOTIFICATIONS_ENABLED==="true";
 return <section className="mx-auto my-5 max-w-6xl rounded-2xl border border-indigo-100 bg-white p-5"><h2 className="text-lg font-semibold">E-maily k zmenám termínov</h2><p className="mt-2 text-sm text-gray-600">{enabled?"Odosielanie je povolené v nastaveniach. Overte SMTP, plánovač a doručenie testovacieho e-mailu.":"Odosielanie je vypnuté. Žiadosti fungujú v portáli; e-maily čakajú na nastavenie SMTP a plánovača."}</p>{counts?<p className="mt-3 text-sm">Vo fronte: <strong>{counts.waiting}</strong> · Zlyhané: <strong>{counts.failed}</strong> · Prijaté SMTP serverom: <strong>{counts.sent}</strong></p>:<p className="mt-3 text-sm text-amber-800">Frontu sa nepodarilo načítať. Overte migráciu notifikácií a serverové pripojenie.</p>}<p className="mt-2 text-xs text-gray-500">Prijatie SMTP serverom ešte nepotvrdzuje doručenie do schránky. Zlyhané správy vyžadujú kontrolu administrátora. Opakovanie môže spôsobiť duplicitný e-mail, ak SMTP správu už prijal pred zlyhaním.</p>{failedJobs.length>0&&<ul className="mt-4 space-y-3">{failedJobs.map(job=><li key={job.id} className="rounded-xl border p-3"><p className="break-all text-sm">{job.recipient_email} · {job.event==="pending"?"Nová žiadosť":job.event==="accepted"?"Prijatá zmena":"Zamietnutá zmena"}</p><RetryNotification id={job.id}/></li>)}</ul>}</section>;
}
