# Mundus package payments

## Behavior

- Students buy one of 1, 5, 10, 20 or 30 individual 60-minute lessons in EUR through hosted Stripe Checkout. Prices in cents: 2800, 13500, 26000, 49000, 70500.
- The first package receives 10% off per student account. By default, an account with an existing assigned package is ineligible. An admin can explicitly allow or block the first-purchase offer on `/admin/payments` before checkout; this accommodates customers with pre-portal purchase history. A paid portal order always consumes the offer, regardless of the setting. The database locks the student row during reservation and admin changes.
- Each student may have only one pending checkout. The student can cancel an open session on `/packages`; an expired session also releases the pending slot. If Checkout is complete, cancellation waits for the webhook.
- Students can resume an open Checkout from `/packages`. The server rechecks session ownership, amount, currency and mode before redirecting. Completed sessions go to the status page; expired sessions release the pending slot. The return page distinguishes missing, failed, refunded and pending orders and refreshes pending status for up to one minute. Only webhooks grant credits.
- A verified Stripe webhook re-fetches the Checkout Session and checks mode, account mode, currency, amount, line item and order identity. One paid order creates exactly one lesson package with its full balance. A success redirect alone never grants credits.
- Refunded charges flag the order `refund_review`; the admin payment view highlights them. Refunds do not silently remove hours already used or assigned. An admin must decide how to adjust the package after reviewing lessons.
- The refund review queue is independent of the recent-order table and lists the oldest 100 cases with original amount, lesson balance and payment-intent reference. Compare the actual refunded amount in Stripe before adjusting any hours; partial refunds also require review. Discount changes show a readable error when blocked by an open or paid purchase.
- Teacher/admin accounts cannot initiate Checkout. Students see only their own orders; admins can see the payment list. All price and fulfillment RPCs are server-only.
- The main website's pricing section and `/prices` show the same EUR package list, reachable from the site's Cenník/Prices navigation. When enabled, each individual package links to its selected card in the student portal; login and signup can carry this choice through account onboarding. Group courses remain an enquiry flow. When payments are disabled, public package buttons link to contact instead of implying an active checkout. If self-signup is off, public copy tells new students to contact Mundus while existing students can sign in.

## Deployment prerequisites

1. Confirm the Stripe account belongs to Mundus. Use a dedicated test sandbox first. Do not put live credentials into a preview environment.
2. Inspect the target Supabase `profiles` and `lesson_packages` table, policies and triggers against the migration assumptions. Apply `202609290001_account_onboarding.sql` first if account onboarding is part of the deployment, then apply `202609290002_payments.sql` in a test database. The latter adds orders and functions; it does not modify existing lesson balances.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, server-only `SUPABASE_SERVICE_ROLE_KEY`, and a valid HTTPS `MUNDUS_SITE_URL`. The deployment must be reachable at that URL. Set a Stripe restricted **test** key as `STRIPE_RESTRICTED_KEY` with Checkout Session create/retrieve/expire permissions. Store secrets only in the deployment's secret manager.
4. Create a Stripe test webhook endpoint at `https://<site>/api/payments/stripe-webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired` and `charge.refunded`. Set its endpoint signing secret as `STRIPE_WEBHOOK_SECRET`. The endpoint needs the raw request body for verification.
5. Set `MUNDUS_PAYMENTS_ENABLED=true` only in the test deployment once the migration, key and webhook are ready. Leave `MUNDUS_PAYMENTS_LIVE_ENABLED=false`. Run test card checkout, failed/cancelled checkout, repeated webhook delivery, delayed payment and refund review end to end. Confirm the paid balance appears once, then compare the order with the Stripe Dashboard.
6. Before live enablement, review each imported student's first-purchase eligibility in the admin payment view, and confirm prices, lesson terms, cancellation/refund policy, payment descriptor, business/Stripe account ownership, taxes and registrations with Mundus. Set a separate restricted live key and live webhook signing secret; enable `MUNDUS_PAYMENTS_LIVE_ENABLED=true` only with explicit authorization. If Stripe Tax is appropriate, configure it separately after registration decisions. Existing code does not calculate or collect tax automatically.

If checkout has been created but its session cannot be attached, the server tries to expire it before returning an error. Investigate any pending order left after a Stripe/API outage; do not manually mark it paid. Stripe events should be replayed after service recovery.

## Local checks

- `npm run build`
- `node tests/payment-database.mjs` exercises the SQL in an isolated PGlite fixture. It covers first purchase pricing, renewal, concurrent pending prevention, amount checks, duplicate fulfillment, expiration, database permissions and refund review.
- `node tests/purchase-intent.mjs` confirms that login and email redirects accept only the five internal package choices.

These checks do not connect to a real Stripe account or production Supabase. Verify the schema, webhook delivery and actual Checkout in a dedicated test environment before accepting payments.
