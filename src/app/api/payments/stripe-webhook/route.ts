import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentEnabled, stripeClient } from "@/lib/payments";

export const runtime = "nodejs";

async function fulfill(sessionId: string) {
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
  if (session.payment_status !== "paid") return;
  const orderId = session.metadata?.mundus_order_id;
  const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const line = session.line_items?.data;
  if (!orderId || session.client_reference_id !== orderId || session.mode !== "payment" ||
    session.currency !== "eur" || !session.amount_total || !intent ||
    line?.length !== 1 || line[0].quantity !== 1 || line[0].amount_total !== session.amount_total ||
    session.livemode !== (process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true")) {
    throw new Error("Checkout session does not match a Mundus order");
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.rpc("mundus_fulfill_payment_order", {
    order_id: orderId, session_id: session.id, payment_intent_id: intent,
    paid_amount: session.amount_total, paid_currency: session.currency,
  });
  if (error) throw error;
}

async function close(session: Stripe.Checkout.Session, status: "failed" | "expired") {
  const orderId = session.metadata?.mundus_order_id;
  if (!orderId || session.client_reference_id !== orderId ||
    session.livemode !== (process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true")) return;
  const { error } = await createSupabaseAdminClient().rpc("mundus_close_payment_order", {
    order_id: orderId, session_id: session.id, new_status: status,
  });
  if (error) throw error;
}

export async function POST(request: NextRequest) {
  if (!paymentEnabled()) return NextResponse.json({ error: "Payments unavailable" }, { status: 503 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.livemode !== (process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true")) {
    return NextResponse.json({ error: "Wrong payment mode" }, { status: 400 });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // The same Stripe account can have unrelated Checkout purchases.
        if (session.metadata?.mundus_order_id) await fulfill(session.id);
        break;
      }
      case "checkout.session.async_payment_failed":
        await close(event.data.object as Stripe.Checkout.Session, "failed");
        break;
      case "checkout.session.expired":
        await close(event.data.object as Stripe.Checkout.Session, "expired");
        break;
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const intent = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (intent) {
          const { error } = await createSupabaseAdminClient().rpc("mundus_flag_payment_refund", { payment_intent_id: intent });
          if (error) throw error;
        }
        break;
      }
    }
  } catch {
    console.error("Mundus payment processing failed", { eventId: event.id, eventType: event.type });
    // Stripe retries the event; an incomplete database write must not be acknowledged.
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
