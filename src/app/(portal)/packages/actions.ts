"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountOrigin } from "@/lib/account-config";
import { PACKAGE_PRICES, paymentEnabled, stripeClient, stripeIntegrationIdentifier } from "@/lib/payments";

export async function startPackageCheckout(form: FormData) {
  const { user } = await requireRole("student");
  if (!paymentEnabled()) redirect("/packages?problem=unavailable");
  const lessons = Number(form.get("lessons"));
  if (!PACKAGE_PRICES.some(item => item.lessons === lessons)) redirect("/packages?problem=package");
  const origin = accountOrigin();
  const stripe = stripeClient();

  const admin = createSupabaseAdminClient();
  const { data: order, error: reservationError } = await admin.rpc("mundus_reserve_payment_order", {
    buyer_id: user.id, lesson_count: lessons,
  });
  if (reservationError || !order) {
    const { data: pending } = await admin.from("payment_orders").select("id")
      .eq("student_id", user.id).eq("status", "pending").maybeSingle();
    redirect(pending ? "/packages?problem=pending" : "/packages?problem=checkout");
  }

  let checkout: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
  try {
    checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "sk",
      customer_email: user.email,
      client_reference_id: order.id,
      metadata: { mundus_order_id: order.id },
      integration_identifier: stripeIntegrationIdentifier(),
      line_items: [{ price_data: {
        currency: "eur",
        unit_amount: order.amount_cents,
        product_data: { name: `Mundus Languages – ${lessons} ${lessons === 1 ? "hodina" : "hodín"}`, description: "Individuálne online jazykové hodiny, 60 minút" },
      }, quantity: 1 }],
      success_url: `${origin}/packages/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/packages?cancelled=1`,
    }, { idempotencyKey: `mundus-order-${order.id}` });
  } catch {
    await admin.rpc("mundus_close_payment_order", { order_id: order.id, session_id: null, new_status: "failed" });
    redirect("/packages?problem=checkout");
  }

  if (!checkout.url || checkout.currency !== "eur" || checkout.amount_total !== order.amount_cents) {
    await stripe.checkout.sessions.expire(checkout.id).catch(() => undefined);
    await admin.rpc("mundus_close_payment_order", { order_id: order.id, session_id: null, new_status: "failed" });
    redirect("/packages?problem=checkout");
  }
  const { error: attachError } = await admin.rpc("mundus_attach_checkout_session", {
    order_id: order.id, session_id: checkout.id,
  });
  if (attachError) {
    // Never give the customer a Checkout URL for an untracked order.
    const expired = await stripe.checkout.sessions.expire(checkout.id).then(() => true).catch(() => false);
    if (expired) await admin.rpc("mundus_close_payment_order", { order_id: order.id, session_id: null, new_status: "failed" });
    redirect("/packages?problem=checkout");
  }
  redirect(checkout.url);
}

export async function cancelPackageCheckout(form: FormData) {
  const { user } = await requireRole("student");
  if (!paymentEnabled()) redirect("/packages");
  const id = String(form.get("order_id") ?? "");
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin.from("payment_orders")
    .select("id,stripe_session_id,status").eq("id", id).eq("student_id", user.id).maybeSingle();
  if (!order || order.status !== "pending" || !order.stripe_session_id) redirect("/packages");
  const stripe = stripeClient();
  let completed = false;
  try {
    const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
    if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
    if (session.status === "complete") completed = true;
    else {
      const { error } = await admin.rpc("mundus_close_payment_order", {
        order_id: order.id, session_id: session.id, new_status: "expired",
      });
      if (error) throw error;
    }
  } catch {
    // A paid session must never be closed because Stripe was temporarily unavailable.
    redirect("/packages?problem=cancel");
  }
  if (completed) redirect("/packages?problem=processing");
  redirect("/packages?cancelled=1");
}

export async function resumePackageCheckout(form: FormData) {
  const { user } = await requireRole("student");
  if (!paymentEnabled()) redirect("/packages?problem=unavailable");
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin.from("payment_orders")
    .select("id,stripe_session_id,amount_cents,status").eq("id", String(form.get("order_id") ?? ""))
    .eq("student_id", user.id).maybeSingle();
  if (!order?.stripe_session_id || order.status !== "pending") redirect("/packages");
  let destination = "/packages";
  try {
    const session = await stripeClient().checkout.sessions.retrieve(order.stripe_session_id);
    if (session.client_reference_id !== order.id || session.metadata?.mundus_order_id !== order.id ||
      session.amount_total !== order.amount_cents || session.currency !== "eur" || session.mode !== "payment" ||
      session.livemode !== (process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true")) throw new Error("Checkout mismatch");
    if (session.status === "open" && session.url) destination = session.url;
    else if (session.status === "complete") destination = `/packages/return?session_id=${encodeURIComponent(session.id)}`;
    else if (session.status === "expired") {
      const { error } = await admin.rpc("mundus_close_payment_order", { order_id: order.id, session_id: session.id, new_status: "expired" });
      if (error) throw error;
    }
  } catch { redirect("/packages?problem=checkout"); }
  redirect(destination);
}
