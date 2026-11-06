import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db=new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth;
create function auth.role() returns text language sql as $$ select nullif(current_setting('request.jwt.claim.role',true),'') $$;
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.profiles(id uuid primary key,full_name text,email text,role text,status text);
create table public.lesson_packages(
 id uuid primary key default gen_random_uuid(), student_id uuid references profiles(id), package_type text,
 total_lessons integer, used_lessons integer, remaining_lessons integer, purchased_at timestamptz, status text
);
grant usage on schema auth to anon,authenticated,service_role;
grant all on public.profiles,public.lesson_packages to service_role;
`);

for(const migration of [
  "202609290002_payments.sql",
  "202610030001_first_package_identity.sql",
  "202611060003_lesson_duration_packages.sql",
]) {
  await db.exec(readFileSync(new URL("../supabase/migrations/"+migration,import.meta.url),"utf8"));
}

await db.exec("set request.jwt.claim.role='service_role'; set role service_role");

const prices=[
  [45,1,2100,1890],
  [45,5,10125,9113],
  [45,10,19500,17550],
  [45,20,36750,33075],
  [45,30,52875,47588],
  [60,1,2800,2520],
  [60,5,13500,12150],
  [60,10,26000,23400],
  [60,20,49000,44100],
  [60,30,70500,63450],
];

let n=1;
for(const [duration,lessons,base,discounted] of prices){
  const id=`00000000-0000-4000-8000-${String(n++).padStart(12,"0")}`;
  await db.query("insert into profiles values ($1,$2,$3,'student','active')",[id,`Student ${n}`,`student${n}@example.com`]);
  const order=(await db.query("select * from mundus_reserve_payment_order($1,$2,$3)",[id,lessons,duration])).rows[0];
  assert.equal(order.duration_minutes,duration);
  assert.equal(order.amount_cents,discounted,`${duration}min x ${lessons} first-package price`);
  assert.equal(order.discount_percent,10);
  assert.equal((await db.query("select mundus_package_base_amount($1,$2) amount",[lessons,duration])).rows[0].amount,base);
  await db.query("select mundus_close_payment_order($1,$2,$3)",[order.id,null,"failed"]);
}

// One paid discounted purchase consumes the offer across both durations.
const buyer="99999999-9999-4999-8999-999999999999";
await db.query("insert into profiles values ($1,'Once Student','once@example.com','student','active')",[buyer]);
const first=(await db.query("select * from mundus_reserve_payment_order($1,5,45)",[buyer])).rows[0];
assert.equal(first.amount_cents,9113);
await db.query("select mundus_attach_checkout_session($1,$2)",[first.id,"cs_45_once"]);
await db.query("select mundus_fulfill_payment_order($1,$2,$3,$4,$5)",[first.id,"cs_45_once","pi_45_once",9113,"eur"]);
const pkg=(await db.query("select total_lessons,duration_minutes from lesson_packages where student_id=$1",[buyer])).rows[0];
assert.equal(pkg.total_lessons,5);
assert.equal(pkg.duration_minutes,45);

const renewal=(await db.query("select * from mundus_reserve_payment_order($1,10,60)",[buyer])).rows[0];
assert.equal(renewal.amount_cents,26000,"later 60-minute package must be full price");
assert.equal(renewal.discount_percent,0,"first-package discount is consumed exactly once after payment");

console.log("PASS: 45/60 minute prices, automatic 10% calculation and one-time discount consumption");
await db.close();
