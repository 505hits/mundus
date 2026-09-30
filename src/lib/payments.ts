import "server-only";
import Stripe from "stripe";
import { randomBytes } from "node:crypto";
import { accountOrigin } from "@/lib/account-config";

export const PACKAGE_PRICES = [
  { lessons: 1, amountCents: 2800 },
  { lessons: 5, amountCents: 13500 },
  { lessons: 10, amountCents: 26000 },
  { lessons: 20, amountCents: 49000 },
  { lessons: 30, amountCents: 70500 },
] as const;

export function paymentEnabled() {
  try { accountOrigin(); } catch { return false; }
  const live = process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true";
  return process.env.MUNDUS_PAYMENTS_ENABLED === "true" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !!process.env.STRIPE_WEBHOOK_SECRET &&
    !!process.env.STRIPE_RESTRICTED_KEY?.startsWith(live ? "rk_live_" : "rk_test_");
}

export function stripeClient() {
  const key = process.env.STRIPE_RESTRICTED_KEY;
  const live = process.env.MUNDUS_PAYMENTS_LIVE_ENABLED === "true";
  if (!key || !key.startsWith(live ? "rk_live_" : "rk_test_")) {
    throw new Error("The configured Stripe key does not match the selected payment mode");
  }
  return new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
}

export function stripeIntegrationIdentifier() {
  return `mundus-portal-${Array.from(randomBytes(8), byte => String.fromCharCode(97 + byte % 26)).join("")}`;
}

export function euro(amountCents: number) {
  return new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}
