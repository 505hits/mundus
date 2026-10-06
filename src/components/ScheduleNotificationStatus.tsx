import RetryNotification from "./RetryNotification";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { currentLanguage } from "@/lib/i18n";
export default async function ScheduleNotificationStatus() {
 const language=await currentLanguage(); const sk=language==="sk";
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
 return <section className="mx-auto my-5 max-w-6xl rounded-2xl border border-indigo-100 bg-white p-5"><h2 className="text-lg font-semibold">{sk?"E-maily k zmenám termínov":"Schedule-change emails"}</h2><p className="mt-2 text-sm text-gray-600">{enabled?(sk?"Odosielanie je povolené v nastaveniach. Overte SMTP, plánovač a doručenie testovacieho e-mailu.":"Sending is enabled in settings. Verify SMTP, the scheduler and delivery of a test email."):(sk?"Odosielanie je vypnuté. Žiadosti fungujú v portáli; e-maily čakajú na nastavenie SMTP a plánovača.":"Sending is disabled. Requests still work in the portal; emails are waiting for SMTP and scheduler configuration.")}</p>{counts?<p className="mt-3 text-sm">{sk?"Vo fronte:":"Queued:"} <strong>{counts.waiting}</strong> · {sk?"Zlyhané:":"Failed:"} <strong>{counts.failed}</strong> · {sk?"Prijaté SMTP serverom:":"Accepted by SMTP server:"} <strong>{counts.sent}</strong></p>:<p className="mt-3 text-sm text-amber-800">{sk?"Frontu sa nepodarilo načítať. Overte migráciu notifikácií a serverové pripojenie.":"The queue could not be loaded. Verify the notification migration and server connection."}</p>}<p className="mt-2 text-xs text-gray-500">{sk?"Prijatie SMTP serverom ešte nepotvrdzuje doručenie do schránky. Zlyhané správy vyžadujú kontrolu administrátora. Opakovanie môže spôsobiť duplicitný e-mail, ak SMTP správu už prijal pred zlyhaním.":"Acceptance by the SMTP server does not guarantee inbox delivery. Failed messages require admin review. Retrying can create a duplicate email if SMTP accepted the message before the failure."}</p>{failedJobs.length>0&&<ul className="mt-4 space-y-3">{failedJobs.map(job=><li key={job.id} className="rounded-xl border p-3"><p className="break-all text-sm">{job.recipient_email} · {job.event==="pending"?(sk?"Nová žiadosť":"New request"):job.event==="accepted"?(sk?"Prijatá zmena":"Accepted change"):(sk?"Zamietnutá zmena":"Declined change")}</p><RetryNotification id={job.id}/></li>)}</ul>}</section>;
}
