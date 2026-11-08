import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { currentLanguage } from "@/lib/i18n";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentEnabled } from "@/lib/payments";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ExternalLink, Mail, CreditCard, Users, ArrowRight } from "lucide-react";

export const dynamic="force-dynamic";

type Status="ready"|"pending"|"attention";
type Readiness={name:string;details:string;status:Status;href?:string;external?:boolean};

export default async function LaunchReadinessPage(){
  await requireRole("admin");
  const language=await currentLanguage();const sk=language==="sk";
  const admin=createSupabaseAdminClient();
  const checks=await Promise.all([
    admin.from("teacher_public_profiles").select("teacher_id",{count:"exact",head:true}).eq("website_visible",true),
    admin.from("profiles").select("id",{count:"exact",head:true}).eq("role","teacher").eq("status","active"),
    admin.from("contact_requests").select("id",{count:"exact",head:true}).eq("status","new"),
    admin.from("company_quote_requests").select("id",{count:"exact",head:true}).eq("status","new"),
    admin.from("newsletter_subscribers").select("id",{count:"exact",head:true}).eq("status","pending"),
    admin.from("contact_request_email_outbox").select("id",{count:"exact",head:true}).in("status",["pending","failed"]),
    admin.from("company_quote_email_outbox").select("id",{count:"exact",head:true}).in("status",["pending","failed"]),
    admin.from("newsletter_email_outbox").select("id",{count:"exact",head:true}).in("status",["pending","failed"]),
    admin.from("payment_orders").select("id",{count:"exact",head:true}).eq("status","pending"),
  ]);
  const count=(index:number)=>checks[index].error?null:checks[index].count??0;
  const total=(indices:number[])=>indices.some(index=>count(index)===null)?null:indices.reduce((sum,index)=>sum+(count(index)??0),0);
  const emailReady=process.env.MUNDUS_EMAIL_NOTIFICATIONS_ENABLED==="true"&&!!process.env.MUNDUS_SMTP_HOST&&!!process.env.MUNDUS_SMTP_USER&&!!process.env.MUNDUS_SMTP_PASSWORD&&!!process.env.MUNDUS_EMAIL_FROM&&!!(process.env.MUNDUS_NOTIFICATION_SECRET||process.env.CRON_SECRET);
  const checkoutReady=paymentEnabled();
  const liveMode=process.env.MUNDUS_PAYMENTS_LIVE_ENABLED==="true";
  const teacherCount=count(0),activeTeacherCount=count(1),queued=total([5,6,7]),inquiries=total([2,3]);
  const cards:Readiness[]=[
    {name:sk?"Platobná brána Stripe":"Stripe checkout",
      details:checkoutReady?(liveMode?(sk?"Produkčné platby sú nakonfigurované. Overte skutočnú transakciu.":"Live payments are configured. Verify with a real transaction."):(sk?"Aktívny je testovací režim. Nespúšťajte reálne platby.":"Test mode is active. Do not accept real payments.")):(sk?"Chýba platobná konfigurácia alebo je platba bezpečnostne vypnutá.":"Payment configuration is missing or checkout is intentionally disabled."),
      status:checkoutReady?(liveMode?"attention":"pending"):"pending",href:"/admin/payments"},
    {name:sk?"E-mailové doručovanie":"Email delivery",
      details:emailReady?(sk?"SMTP a prístupový token sú nastavené. Overte spracovanie frontu a skutočné doručenie.":"SMTP and worker secret are configured. Verify queue processing and real inbox delivery."):(sk?"SMTP heslo, bezpečný token alebo aktivácia pracovníka chýba; formuláre stále ukladajú dopyty.":"SMTP password, worker secret or notification activation is missing; website requests still persist."),
      status:emailReady?"attention":"pending",href:"/admin/dashboard"},
    {name:sk?"Zverejnené profily lektorov":"Approved teacher profiles",
      details:teacherCount===null?(sk?"Databázu sa nepodarilo načítať.":"Could not read the teacher database."):(sk?`Z databázy: ${teacherCount} zverejnených profilov · ${activeTeacherCount??"?"} aktívnych lektorov. Verejný web má aj samostatné predstavenia z Instagramu.`:`Database: ${teacherCount} published profiles · ${activeTeacherCount??"?"} active teachers. The site also has separately sourced Instagram introductions.`),
      status:teacherCount===null?"attention":teacherCount>0?"ready":"pending",href:"/admin/teachers"},
    {name:sk?"Doména a SEO":"Domain and SEO",
      details:sk?"Overte vlastníctvo munduslanguages.com a www v nastaveniach Vercel. Vyhľadávací index odkazuje na túto doménu.":"Verify ownership of munduslanguages.com and www in Vercel settings. The sitemap and canonical links use this domain.",
      status:"attention",href:"https://vercel.com/dashboard",external:true},
  ];
  const statusLabel=(v:Status)=>v==="ready"?(sk?"Nastavené":"Configured"):v==="pending"?(sk?"Vyžaduje nastavenie":"Needs setup"):(sk?"Overiť":"Verify");
  return <main className="mx-auto max-w-7xl px-4 py-7 text-[#171A2B] sm:px-8 sm:py-10">
    <div className="rounded-[1.75rem] bg-gradient-to-br from-[#1D2552] to-[#4658A8] px-6 py-9 text-white sm:p-10">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#D6DEFF]"><ClipboardCheck size={17}/>{sk?"Pripravenosť na spustenie":"Launch readiness"}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight !text-white sm:text-4xl">{sk?"Všetko, čo treba pred prvými platbami.":"Everything needed before your first payments."}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#E0E5FF] sm:text-base">{sk?"Aktuálny prehľad konfigurácie a reálnych dát. Stav Nastavené nezaručuje doručenie alebo úspešnú platbu — tie musíte ešte overiť v praxi.":"Current configuration and real database signals. Configured does not guarantee delivery or a completed payment; these require separate live verification."}</p>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {icon:Mail,value:inquiries,label:sk?"Nové webové dopyty":"New website leads",href:"/admin/dashboard"},
        {icon:AlertTriangle,value:queued,label:sk?"Nevybavené e-mailové úlohy":"Unsent email jobs",href:"/admin/newsletter"},
        {icon:Users,value:teacherCount,label:sk?"Verejné profily lektorov":"Public teacher profiles",href:"/admin/teachers"},
        {icon:CreditCard,value:count(8),label:sk?"Otvorené platby":"Pending payments",href:"/admin/payments"},
      ].map(item=>{const Icon=item.icon;return <Link key={item.label} href={item.href} className="rounded-2xl border border-[#E1E6F3] bg-white p-5 shadow-sm hover:border-[#A5B3EC]"><Icon size={20} className="text-[#4656A9]"/><p className="mt-3 text-3xl font-semibold tabular-nums">{item.value===null?"—":item.value}</p><p className="mt-1 text-sm text-[#626C81]">{item.label}</p></Link>})}
    </div>
    <section className="mt-9 grid gap-4 sm:grid-cols-2">
      {cards.map(card=><article key={card.name} className="flex flex-col rounded-[1.4rem] border border-[#E1E6F3] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{card.name}</h2>{card.status==="ready"?<CheckCircle2 size={20} className="text-emerald-600"/>:<AlertTriangle size={20} className="text-amber-600"/>}</div>
        <p className="mt-2 text-xs font-bold uppercase tracking-[.1em] text-[#5B6786]">{statusLabel(card.status)}</p>
        <p className="mt-4 flex-1 text-sm leading-6 text-[#606A80]">{card.details}</p>
        {card.href&&(card.external?<a href={card.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#3443A3]">{sk?"Otvoriť nastavenia":"Open settings"}<ExternalLink size={16}/></a>:<Link href={card.href} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#3443A3]">{sk?"Otvoriť sekciu":"Open section"}<ArrowRight size={16}/></Link>)}
      </article>)}
    </section>
    <p className="mt-6 text-xs leading-6 text-[#6A7589]">{sk?"Tento prehľad nezobrazuje heslá ani tajné kľúče. Po zmene konfigurácie vo Vercel znova nasaďte web a overte reálne platby aj doručenie správ.":"This view never exposes passwords or API keys. After changing Vercel configuration, redeploy and verify actual payments and inbox delivery."}</p>
  </main>;
}
