import {PGlite} from "@electric-sql/pglite";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";

const db=new PGlite();
const student="00000000-0000-4000-8000-000000000001";
const admin="00000000-0000-4000-8000-000000000002";
const pkg="00000000-0000-4000-8000-000000000003";
const order="00000000-0000-4000-8000-000000000004";

await db.exec(`
create role anon;create role authenticated;create role service_role;
create schema auth;
create table profiles(id uuid primary key,role text,status text,email text);
create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
create table lesson_packages(id uuid primary key,student_id uuid references profiles(id),total_lessons int,used_lessons int,remaining_lessons int,status text default 'active',purchased_at timestamptz default now());
create table payment_orders(id uuid primary key,student_id uuid references profiles(id),status text,lesson_package_id uuid references lesson_packages(id));
create table student_onboarding(student_id uuid primary key references profiles(id),completed_at timestamptz);
insert into profiles values('${student}','student','active','student@test.invalid'),('${admin}','admin','active','admin@test.invalid');
insert into auth.users values('${student}',now()),('${admin}',now());
insert into lesson_packages(id,student_id,total_lessons,used_lessons,remaining_lessons,status,purchased_at) values('${pkg}','${student}',5,2,3,'active',now()-interval '1 day');
insert into payment_orders values('${order}','${student}','pending','${pkg}');
`);

await db.exec(readFileSync(new URL("../supabase/migrations/202610050006_portal_email_notifications.sql",import.meta.url),"utf8"));
await db.exec(readFileSync(new URL("../supabase/migrations/202610050009_suppress_redundant_renewal.sql",import.meta.url),"utf8"));
await db.exec(readFileSync(new URL("../supabase/migrations/202611060002_matching_ready_notification.sql",import.meta.url),"utf8"));

await db.exec("update payment_orders set status='paid' where id='"+order+"'");
await db.exec("insert into student_onboarding(student_id,completed_at) values('"+student+"',now())");
await db.exec("update lesson_packages set used_lessons=3,remaining_lessons=2 where id='"+pkg+"'");
await db.exec("update lesson_packages set used_lessons=4,remaining_lessons=1 where id='"+pkg+"'");

const rows=(await db.query("select kind,recipient_id from portal_email_outbox order by kind")).rows;
assert.equal(rows.filter(r=>r.kind==="admin_assignment").length,1);
assert.equal(rows.filter(r=>r.kind==="admin_matching_ready").length,1);
assert.equal(rows.filter(r=>r.kind==="admin_renewal").length,1);
assert.equal(rows.filter(r=>r.kind==="student_renewal").length,1);

await db.exec("update student_onboarding set completed_at=completed_at where student_id='"+student+"'");
await db.exec("update lesson_packages set used_lessons=4,remaining_lessons=1 where id='"+pkg+"'");
assert.equal((await db.query("select count(*)::int n from portal_email_outbox")).rows[0].n,4);

const secondPkg="00000000-0000-4000-8000-000000000005";
await db.exec("insert into lesson_packages(id,student_id,total_lessons,used_lessons,remaining_lessons,status,purchased_at) values('"+secondPkg+"','"+student+"',5,0,5,'active',now()+interval '1 minute')");
await db.exec("delete from portal_email_outbox where kind in ('admin_renewal','student_renewal')");
await db.exec("update lesson_packages set used_lessons=2,remaining_lessons=3 where id='"+pkg+"'");
await db.exec("update lesson_packages set used_lessons=4,remaining_lessons=1 where id='"+pkg+"'");
assert.equal((await db.query("select count(*)::int n from portal_email_outbox where kind in ('admin_renewal','student_renewal')")).rows[0].n,0);

await db.exec("set role service_role");
assert.ok((await db.query("select * from claim_portal_emails(5)")).rows.length>0);
await db.close();
console.log("PASS: paid assignment, matching-ready and renewal emails queue idempotently");
