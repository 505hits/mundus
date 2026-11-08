import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const checkout=read("src/app/(portal)/packages/actions.ts");
const payments=read("src/lib/payments.ts");

assert.ok(checkout.includes('idempotencyKey: `mundus-order-${order.id}`'),"Checkout must use the stored order as a stable Stripe idempotency key");
assert.ok(checkout.includes('client_reference_id: order.id') && checkout.includes('mundus_order_id: order.id'),"Checkout metadata must bind to the reserved order");
assert.ok(checkout.includes("amount_total !== order.amount_cents"),"Checkout must verify Stripe's actual total");
assert.equal(checkout.includes("stripeIntegrationIdentifier()"),false,"Checkout must not include a new random integration identifier on every retry");
assert.equal(payments.includes("randomBytes"),false,"The Stripe adapter must not introduce per-attempt random values");
assert.ok(checkout.includes("mundus_attach_checkout_session"),"Checkout session must attach to order before redirect");
console.log("PASS: Stripe Checkout idempotency parameters are stable and validated before redirect");
