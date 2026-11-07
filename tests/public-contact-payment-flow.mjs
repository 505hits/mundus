import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contact = readFileSync(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
const action = readFileSync(new URL("../src/app/contact/actions.ts", import.meta.url), "utf8");
const pricing = readFileSync(new URL("../src/components/PurchasePackages.tsx", import.meta.url), "utf8");
const worker = readFileSync(new URL("../src/app/api/notifications/process/route.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../src/app/(admin)/admin/dashboard/page.tsx", import.meta.url), "utf8");

assert.ok(contact.includes("Zaplatiť online"));
assert.equal(contact.includes("Message us on Instagram"),false,"Instagram must not compete with the purchase path");
assert.ok(contact.includes('href={`/${language}/#languages`}'),"contact page must direct buyers to the working localized language section");
assert.ok(contact.includes("submitContactRequest"));
assert.ok(contact.includes('name="website"'), "public request form must retain its honeypot");
assert.ok(action.includes(">= 3"), "request action must rate-limit repeated email submissions");
assert.ok(action.includes('from("contact_requests")'));
assert.ok(pricing.includes("Zaplatiť online"));
assert.ok(pricing.includes("Najprv vybrať jazyk") && pricing.includes("Choose a language first"));\nassert.ok(pricing.includes("`/signup?next=${encodeURIComponent(`"),"paid package CTA must carry purchase intent into student signup");\nassert.ok(pricing.includes("${prefix}/#languages"),"missing-language CTA must stay on the working homepage language section");
assert.equal(pricing.includes("I have a question"),false,"package cards should have one primary conversion action");
assert.ok(worker.includes("claim_contact_request_emails"));
assert.ok(worker.includes("Mundus: nová žiadosť z webu"));
assert.ok(dashboard.includes('from("contact_requests")'));
assert.ok(dashboard.includes("markContactRequestContacted"));

console.log("PASS: public purchase is primary and contact remains a secondary help flow");
