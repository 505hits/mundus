import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contact = readFileSync(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
const action = readFileSync(new URL("../src/app/contact/actions.ts", import.meta.url), "utf8");
const pricing = readFileSync(new URL("../src/components/PurchasePackages.tsx", import.meta.url), "utf8");
const worker = readFileSync(new URL("../src/app/api/notifications/process/route.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../src/app/(admin)/admin/dashboard/page.tsx", import.meta.url), "utf8");

assert.ok(contact.includes("Zaplatiť online"));
assert.ok(contact.includes("Message us on Instagram"));
assert.ok(contact.includes("submitContactRequest"));
assert.ok(contact.includes('name="website"'), "public request form must retain its honeypot");
assert.ok(action.includes(">= 3"), "request action must rate-limit repeated email submissions");
assert.ok(action.includes('from("contact_requests")'));
assert.ok(pricing.includes("Zaplatiť online"));
assert.ok(pricing.includes("I have a question"));
assert.ok(worker.includes("claim_contact_request_emails"));
assert.ok(worker.includes("Mundus: nová žiadosť z webu"));
assert.ok(dashboard.includes('from("contact_requests")'));
assert.ok(dashboard.includes("markContactRequestContacted"));

console.log("PASS: public pay/help/request choices and admin request notification flow");
