import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("src/app/(admin)/admin/launch/page.tsx");
const nav=read("src/components/AdminNav.tsx");
const payment=read("src/lib/payments.ts");
const worker=read("src/app/api/notifications/process/route.ts");
assert.ok(page.includes('requireRole("admin")'),"launch readiness must be admin only");
assert.ok(page.includes("paymentEnabled()")&&page.includes("MUNDUS_PAYMENTS_LIVE_ENABLED"),"payment status must use actual server-side payment gates");
assert.ok(payment.includes("STRIPE_RESTRICTED_KEY")&&payment.includes("STRIPE_WEBHOOK_SECRET"),"checkout remains safely disabled without server key and webhook");
assert.ok(page.includes("MUNDUS_SMTP_PASSWORD")&&page.includes("MUNDUS_EMAIL_NOTIFICATIONS_ENABLED"),"email readiness must require actual SMTP configuration");
for(const table of ["teacher_public_profiles","contact_requests","company_quote_requests","newsletter_subscribers","contact_request_email_outbox","company_quote_email_outbox","newsletter_email_outbox","payment_orders"]){
 assert.ok(page.includes(table),"admin launch readiness must inspect "+table);
}
assert.ok(page.includes('requireRole("admin")')&&!page.includes('process.env.STRIPE_RESTRICTED_KEY?.slice'),"launch readiness must not expose payment secrets");
assert.ok(nav.includes('href: "/admin/launch"'),"admin navigation should expose launch health");
assert.ok(worker.includes("timingSafeEqual"),"notification worker must continue to verify its secret securely");
console.log("PASS: admin launch readiness reports payment, email, teacher and outbox status without exposing secrets");
