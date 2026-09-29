import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

// Isolated fixture only. Nothing here connects to Mundus, Supabase, or Stripe.
const db = new PGlite();
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth;
  create function auth.role() returns text language sql as $$ select nullif(current_setting('request.jwt.claim.role',true),'') $$;
  create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  create table public.profiles (id uuid primary key, email text, role text, status text);
  create table public.lesson_packages (
    id uuid primary key default gen_random_uuid(), student_id uuid references profiles(id), package_type text,
    total_lessons integer, used_lessons integer, remaining_lessons integer, purchased_at timestamptz,
    status text
  );
  grant usage on schema auth to anon, authenticated, service_role;
  grant select on profiles, lesson_packages to authenticated;
  grant all on profiles, lesson_packages to service_role;
`);
await db.exec(readFileSync(new URL("../supabase/migrations/202609290002_payments.sql", import.meta.url), "utf8"));
const packageGuardrails = readFileSync(new URL("../supabase/migrations/20260929_schedule_and_package_guardrails.sql", import.meta.url), "utf8");
await db.exec(packageGuardrails.slice(packageGuardrails.indexOf("create or replace function public.validate_lesson_package_counters()")));
const student = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
await db.exec(`insert into profiles values ('${student}','student@example.com','student','active'),('${other}','other@example.com','student','active')`);

await db.exec("set request.jwt.claim.role='service_role'; set role service_role");
const adminId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const legacyId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
await db.query("insert into profiles(id,email,role,status) values ($1,'admin@example.com','admin','active'),($2,'legacy@example.com','student','active')", [adminId, legacyId]);
await db.query("insert into lesson_packages(student_id,package_type,total_lessons,used_lessons,remaining_lessons,purchased_at,status) values ($1,'legacy',5,0,5,now(),'active')", [legacyId]);
let legacyOrder = (await db.query("select * from mundus_reserve_payment_order($1,5)", [legacyId])).rows[0];
assert.equal(legacyOrder.amount_cents, 13500, "an existing package is not a first purchase by default");
await db.query("select mundus_close_payment_order($1,$2,$3)", [legacyOrder.id, null, "failed"]);
await db.query("select mundus_set_first_discount($1,$2,$3)", [legacyId, true, adminId]);
legacyOrder = (await db.query("select * from mundus_reserve_payment_order($1,5)", [legacyId])).rows[0];
assert.equal(legacyOrder.amount_cents, 12150, "admin can allow discount for an existing student account");
await assert.rejects(db.query("select mundus_set_first_discount($1,$2,$3)", [legacyId, false, adminId]), /during or after purchase/);
await db.query("select mundus_attach_checkout_session($1,$2)", [legacyOrder.id, "cs_legacy"]);
await db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [legacyOrder.id, "cs_legacy", "pi_legacy", 12150, "eur"]);
await assert.rejects(db.query("select mundus_set_first_discount($1,$2,$3)", [legacyId, true, adminId]), /during or after purchase/);
const legacyRenewal = (await db.query("select * from mundus_reserve_payment_order($1,5)", [legacyId])).rows[0];
assert.equal(legacyRenewal.amount_cents, 13500, "a paid order consumes the discount despite an allow override");
await db.query("insert into payment_orders(student_id,package_lessons,amount_cents,discount_percent,status) select $1,1,2800,0,'failed' from generate_series(1,105)", [legacyId]);
const summary = (await db.query("select * from mundus_payment_account_state($1)", [[legacyId]])).rows[0];
assert.equal(summary.has_paid, true, "paid purchase remains visible beyond the last 100 orders");
assert.equal(summary.has_pending, true);
await assert.rejects(db.query("select mundus_set_first_discount($1,$2,$3)", [other, true, student]), /Active administrator/);
for (const [index, lessons, base] of [
  [3, 1, 2800], [4, 5, 13500], [5, 10, 26000], [6, 20, 49000], [7, 30, 70500],
]) {
  const id = `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
  await db.query("insert into profiles(id,email,role,status) values ($1,$2,'student','active')", [id, `price${index}@example.com`]);
  const order = (await db.query("select * from mundus_reserve_payment_order($1,$2)", [id, lessons])).rows[0];
  assert.equal(order.amount_cents, base * 9 / 10, `${lessons}-lesson first purchase`);
  assert.equal(order.discount_percent, 10);
  await db.query("select mundus_close_payment_order($1,$2,$3)", [order.id, null, "failed"]);
  const retry = (await db.query("select * from mundus_reserve_payment_order($1,$2)", [id, lessons])).rows[0];
  assert.equal(retry.amount_cents, base * 9 / 10, "a failed first checkout keeps the discount");
}
const excludedId = "99999999-9999-4999-8999-999999999999";
await db.query("insert into profiles(id,email,role,status) values ($1,'excluded@example.com','student','active')", [excludedId]);
await db.query("select mundus_set_first_discount($1,$2,$3)", [excludedId, false, adminId]);
assert.equal((await db.query("select * from mundus_reserve_payment_order($1,1)", [excludedId])).rows[0].amount_cents, 2800);
const first = (await db.query("select * from mundus_reserve_payment_order($1,$2)", [student, 5])).rows[0];
assert.equal(first.amount_cents, 12150);
assert.equal(first.discount_percent, 10);
await assert.rejects(db.query("select * from mundus_reserve_payment_order($1,$2)", [student, 10]), /unfinished checkout/);
await db.query("select mundus_attach_checkout_session($1,$2)", [first.id, "cs_test_first"]);
await assert.rejects(db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [first.id, "cs_test_first", "pi_first", 13500, "eur"]), /does not match/);
await db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [first.id, "cs_test_first", "pi_first", 12150, "eur"]);
await db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [first.id, "cs_test_first", "pi_first", 12150, "eur"]);
assert.equal((await db.query("select count(*)::integer as count from lesson_packages where student_id=$1", [student])).rows[0].count, 1);
assert.equal((await db.query("select remaining_lessons from lesson_packages where student_id=$1", [student])).rows[0].remaining_lessons, 5);
await assert.rejects(db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [first.id, "cs_test_first", "pi_second", 12150, "eur"]), /Another payment/);

const renewal = (await db.query("select * from mundus_reserve_payment_order($1,$2)", [student, 10])).rows[0];
assert.equal(renewal.amount_cents, 26000);
assert.equal(renewal.discount_percent, 0);
await db.query("select mundus_attach_checkout_session($1,$2)", [renewal.id, "cs_test_renewal"]);
await db.query("select mundus_close_payment_order($1,$2,$3)", [renewal.id, "cs_test_renewal", "expired"]);
assert.equal((await db.query("select count(*)::integer as count from lesson_packages where student_id=$1", [student])).rows[0].count, 1);
await assert.rejects(db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)", [renewal.id, "cs_test_renewal", "pi_renewal", 26000, "eur"]), /closed/);

await db.exec("reset role; set request.jwt.claim.role='authenticated'; set request.jwt.claim.sub='" + student + "'; set role authenticated");
await assert.rejects(db.query("insert into payment_orders(student_id,package_lessons,amount_cents,discount_percent) values ($1,5,100,0)", [student]), /permission denied/);
await assert.rejects(db.query("select * from mundus_reserve_payment_order($1,$2)", [student, 5]), /permission denied/);
await assert.rejects(db.query("select mundus_set_first_discount($1,$2,$3)", [student, true, adminId]), /permission denied/);
assert.equal((await db.query("select count(*)::integer as count from payment_orders")).rows[0].count, 2);
assert.equal((await db.query("select * from mundus_payment_account_state($1)", [[legacyId]])).rows.length, 0, "other account summaries stay private");
await db.exec("reset role; set request.jwt.claim.sub='" + other + "'; set role authenticated");
assert.equal((await db.query("select count(*)::integer as count from payment_orders")).rows[0].count, 0);
await db.exec("reset role; set request.jwt.claim.role='service_role'; set role service_role");
await db.query("select mundus_flag_payment_refund($1)", ["pi_first"]);
assert.equal((await db.query("select status from payment_orders where id=$1", [first.id])).rows[0].status, "refund_review");
assert.equal((await db.query("select count(*)::integer as count from lesson_packages where student_id=$1", [student])).rows[0].count, 1);
console.log("PASS: account discount override, prices, renewal, pending lock, amount validation, duplicate webhook, access control, refund review");
await db.close();
