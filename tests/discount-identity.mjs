import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role bypassrls;
create schema auth;
create function auth.role() returns text language sql as $$ select nullif(current_setting('request.jwt.claim.role',true),'') $$;
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table profiles(id uuid primary key, full_name text, email text, role text, status text);
create table lesson_packages(id uuid primary key default gen_random_uuid(), student_id uuid references profiles(id), package_type text, total_lessons integer, used_lessons integer, remaining_lessons integer, purchased_at timestamptz, status text);
grant usage on schema auth to anon, authenticated, service_role;
grant select on profiles, lesson_packages to authenticated;
grant all on profiles, lesson_packages to service_role;
`);
for (const migration of ['202609290002_payments.sql','202610030001_first_package_identity.sql']) {
 await db.exec(readFileSync(new URL('../supabase/migrations/'+migration, import.meta.url),'utf8'));
}
await db.exec("set request.jwt.claim.role='service_role'; set role service_role");
let counter=1;
async function student(name,email) {
 const id=`00000000-0000-4000-8000-${String(counter++).padStart(12,'0')}`;
 await db.query("insert into profiles values ($1,$2,$3,'student','active')",[id,name,email]);return id;
}
const a=await student('Anna Nováková','anna.novak+first@gmail.com');
const reserve=async id=>(await db.query('select * from mundus_reserve_payment_order($1,5)',[id])).rows[0];
const first=await reserve(a);assert.equal(first.amount_cents,12150);
const sameName=await student('  ANNA-NOVAKOVA ','different@example.com');
assert.equal((await reserve(sameName)).discount_percent,0,'name variation cannot open a second discounted checkout');
const alias=await student('Different Name','annanovak+another@googlemail.com');
assert.equal((await reserve(alias)).discount_percent,0,'Gmail dots, tags and alternate domain identify the same mailbox');
await db.query('select mundus_attach_checkout_session($1,$2)',[first.id,'cs_identity']);
await db.query('select mundus_fulfill_payment_order($1,$2,$3,$4,$5)',[first.id,'cs_identity','pi_identity',12150,'eur']);
await db.query("update profiles set full_name='Changed Name',email='changed@example.com' where id=$1",[a]);
const repeat=await student('Anna Nováková','brandnew@example.com');
assert.equal((await reserve(repeat)).discount_percent,0,'paid snapshot survives profile edits');
const own=await reserve(a);assert.equal(own.discount_percent,0,'changing identity never resets paid account eligibility');
const retry=await student('New Student','new@example.com');
const failed=await reserve(retry);assert.equal(failed.discount_percent,10);
await db.query('select mundus_close_payment_order($1,$2,$3)',[failed.id,null,'failed']);
assert.equal((await reserve(retry)).discount_percent,10,'failed attempt does not consume the offer');
const missing=await student('', 'missing@example.com');assert.equal((await reserve(missing)).discount_percent,0);
await assert.rejects(db.query('update payment_orders set discount_name_key=$1 where id=$2',['changed',first.id]),/immutable/);
await db.exec(`reset role; set request.jwt.claim.role='authenticated'; set request.jwt.claim.sub='${a}'; set role authenticated`);
assert.equal((await db.query('select mundus_first_discount_eligible($1) as eligible',[retry])).rows[0].eligible,false,'other account eligibility is not exposed');
console.log('PASS: one-person name checks, Gmail aliases, immutable paid identity, failed retry and private eligibility');
await db.close();
