import { NextRequest,NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";
import { scheduleEmail } from "@/lib/schedule-email";
import { portalEmail } from "@/lib/portal-email";
export const runtime="nodejs";
export const maxDuration=120;
export async function GET(request:NextRequest) {
 const secret=process.env.MUNDUS_NOTIFICATION_SECRET || process.env.CRON_SECRET;
 const received=request.headers.get("authorization")||"";
 const expected=`Bearer ${secret}`;
 if(!secret || secret.length<32 || Buffer.byteLength(received)!==Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(received),Buffer.from(expected))) return NextResponse.json({error:"Unauthorized"},{status:401});
 const port=Number(process.env.MUNDUS_SMTP_PORT||587);
 if(process.env.MUNDUS_EMAIL_NOTIFICATIONS_ENABLED!=="true" || !process.env.MUNDUS_SMTP_HOST || !process.env.MUNDUS_SMTP_USER || !process.env.MUNDUS_SMTP_PASSWORD || !process.env.MUNDUS_EMAIL_FROM || ![465,587].includes(port)) return NextResponse.json({error:"Notifications not configured"},{status:503});
 try {
  const origin=accountOrigin();const admin=createSupabaseAdminClient();
  const transport=nodemailer.createTransport({host:process.env.MUNDUS_SMTP_HOST,port,secure:port===465,requireTLS:true,auth:{user:process.env.MUNDUS_SMTP_USER,pass:process.env.MUNDUS_SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,disableFileAccess:true,disableUrlAccess:true});
  const {data:jobs,error}=await admin.rpc("claim_schedule_emails",{batch_size:2});
  if(error)throw error;
  let sent=0,failed=0;
  for(const job of jobs||[]) {
   try {
    const {data:current,error:requestError}=await admin.from("schedule_change_requests").select("status,preferred_at,lesson_id,student_id").eq("id",job.request_id).single();
    if(requestError || !current) throw new Error("Request unavailable");
    const {data:lesson,error:lessonError}=await admin.from("lessons").select("teacher_id").eq("id",current.lesson_id).single();
    if(lessonError || !lesson) throw new Error("Lesson unavailable");
    if(current.status!==job.event || Date.parse(current.preferred_at)!==Date.parse(job.preferred_at) || ![current.student_id,lesson.teacher_id].includes(job.recipient_id)) {
     const {error:skipError}=await admin.from("notification_outbox").update({status:"skipped",lease_until:null}).eq("id",job.id).eq("lease_token",job.lease_token);
     if(skipError)throw skipError;
     continue;
    }
    // Recheck verified active recipient; queued email never follows an edited recipient identity.
    const {data:profile}=await admin.from("profiles").select("status,email,role").eq("id",job.recipient_id).single();
    const {data:auth}=await admin.auth.admin.getUserById(job.recipient_id);
    if(profile?.status!=="active" || profile.email!==job.recipient_email || !auth.user?.email_confirmed_at || auth.user.email?.toLowerCase()!==job.recipient_email.toLowerCase()) throw new Error("Recipient unavailable");
    const content=scheduleEmail(job.event,job.preferred_at,`${origin}/${profile.role === "teacher" ? "teacher/schedule" : profile.role === "admin" ? "admin/lessons" : "lessons"}`);
    const result=await transport.sendMail({from:process.env.MUNDUS_EMAIL_FROM,to:job.recipient_email,...content,messageId:`<mundus-${job.id}@${new URL(origin).hostname}>`});
    if(!result.accepted.length)throw new Error("SMTP rejected");
    const {error:finishError}=await admin.from("notification_outbox").update({status:"sent",sent_at:new Date().toISOString(),lease_until:null}).eq("id",job.id).eq("lease_token",job.lease_token);
    if(finishError)throw finishError;
    sent++;
   }catch {
    const {error:retryError}=await admin.from("notification_outbox").update({status:job.attempts>=5?"failed":"pending",available_at:new Date(Date.now()+15*60*1000).toISOString(),lease_until:null}).eq("id",job.id).eq("lease_token",job.lease_token);
    if(retryError)throw retryError;
    failed++;
   }
  }
  const {data:portalJobs,error:portalError}=await admin.rpc("claim_portal_emails",{batch_size:5});
  if(portalError) throw portalError;
  for(const job of portalJobs||[]) {
    try {
      const {data:recipient}=await admin.from("profiles").select("status,email,role").eq("id",job.recipient_id).single();
      const {data:student}=await admin.from("profiles").select("full_name,email").eq("id",job.student_id).single();
      const {data:auth}=await admin.auth.admin.getUserById(job.recipient_id);
      if(recipient?.status!=="active" || recipient.email!==job.recipient_email || !auth.user?.email_confirmed_at) throw new Error("Recipient unavailable");
      const studentName=student?.full_name?.trim()||student?.email||"študent";
      const href=job.kind==="admin_assignment"?"/admin/matching":job.kind==="admin_renewal"?"/admin/dashboard":"/packages";
      const content=portalEmail(job.kind,studentName,origin+href);
      const result=await transport.sendMail({from:process.env.MUNDUS_EMAIL_FROM,to:job.recipient_email,...content,messageId:"<mundus-"+job.id+"@"+new URL(origin).hostname+">"});
      if(!result.accepted.length) throw new Error("SMTP rejected");
      const {error:finishError}=await admin.from("portal_email_outbox").update({status:"sent",sent_at:new Date().toISOString(),lease_until:null}).eq("id",job.id).eq("lease_token",job.lease_token);
      if(finishError) throw finishError;
      sent++;
    } catch {
      const {error:retryError}=await admin.from("portal_email_outbox").update({status:job.attempts>=5?"failed":"pending",available_at:new Date(Date.now()+15*60*1000).toISOString(),lease_until:null}).eq("id",job.id).eq("lease_token",job.lease_token);
      if(retryError) throw retryError;
      failed++;
    }
  }
  return NextResponse.json({sent,failed});
 }catch{return NextResponse.json({error:"Notification processing unavailable"},{status:503});}
}
export const POST=GET;
