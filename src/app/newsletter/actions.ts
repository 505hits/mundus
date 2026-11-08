"use server";
import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validEmail } from "@/lib/account-policy";
import type { AccountFormState } from "@/lib/account-policy";

type NewsletterState = AccountFormState & { subscribed?: boolean };

export async function subscribeNewsletter(_previous: NewsletterState, form: FormData): Promise<NewsletterState> {
  const email=String(form.get("email")||"").trim().toLowerCase();
  const language=form.get("ui_language")==="en"?"en":"sk";
  const source=form.get("source")==="popup"?"popup":"footer";
  const consent=form.get("marketing_consent")==="on";
  if(!validEmail(email)) return {error: language==="sk"?"Zadajte platnú e-mailovú adresu.":"Enter a valid email address."};
  if(!consent) return {error: language==="sk"?"Na odber noviniek je potrebný váš súhlas.":"Your consent is required to subscribe."};

  const admin=createSupabaseAdminClient();
  const {data:existing,error:lookupError}=await admin.from("newsletter_subscribers").select("id,status").eq("email",email).maybeSingle();
  if(lookupError) return {error: language==="sk"?"Prihlásenie sa nepodarilo. Skúste to neskôr.":"Subscription could not be saved. Try again later."};

  if(existing?.status==="active") return {success: language==="sk"?"Tento e-mail už odoberá novinky Mundus.":"This email is already subscribed to Mundus updates.",subscribed:true};

  const confirmToken=randomUUID();
  const unsubscribeToken=randomUUID();
  let subscriberId=existing?.id;

  if(existing){
    const {error:updateError}=await admin.from("newsletter_subscribers").update({
      language,source,status:"pending",consent_at:new Date().toISOString(),confirmed_at:null,unsubscribed_at:null,
      confirm_token:confirmToken,unsubscribe_token:unsubscribeToken,updated_at:new Date().toISOString(),
    }).eq("id",existing.id);
    if(updateError) return {error: language==="sk"?"Prihlásenie sa nepodarilo. Skúste to neskôr.":"Subscription could not be saved. Try again later."};
    await admin.from("newsletter_email_outbox").delete().eq("subscriber_id",existing.id).eq("kind","confirm");
  }else{
    const {data:newRow,error:insertError}=await admin.from("newsletter_subscribers").insert({
      email,language,source,status:"pending",confirm_token:confirmToken,unsubscribe_token:unsubscribeToken,
    }).select("id").single();
    if(insertError||!newRow) return {error: language==="sk"?"Prihlásenie sa nepodarilo. Skúste to neskôr.":"Subscription could not be saved. Try again later."};
    subscriberId=newRow.id;
  }

  const {error:queueError}=await admin.from("newsletter_email_outbox").insert({
    subscriber_id:subscriberId,recipient_email:email,kind:"confirm"
  });
  if(queueError) return {error: language==="sk"?"E-mail sme uložili, ale potvrdenie sa nepodarilo pripraviť. Skúste to znova neskôr.":"Your email was saved, but confirmation could not be prepared. Please try again later."};
  // Notify the Mundus inbox about every new consented email address.
  // This remains pending in the outbox until SMTP delivery is configured.
  await admin.from("newsletter_email_outbox").upsert({
    subscriber_id:subscriberId,
    recipient_email:"mundus.languages@gmail.com",
    kind:"admin_notice",
    status:"pending",
    attempts:0,
    available_at:new Date().toISOString(),
    lease_token:null,
    lease_until:null,
    sent_at:null,
  },{onConflict:"subscriber_id,kind"});


  const mailReady = process.env.MUNDUS_EMAIL_NOTIFICATIONS_ENABLED === "true" && Boolean(process.env.MUNDUS_SMTP_HOST && process.env.MUNDUS_SMTP_USER && process.env.MUNDUS_SMTP_PASSWORD && process.env.MUNDUS_EMAIL_FROM);
  return {success: mailReady ? (language==="sk"?"Skontrolujte e-mail a potvrďte odber.":"Check your email and confirm your subscription.") : (language==="sk"?"E-mail sme bezpečne uložili. Potvrdzovací e-mail sa odošle po aktivovaní e-mailovej služby.":"We saved your email. The confirmation will be sent once email delivery is activated."),subscribed:true};
}
