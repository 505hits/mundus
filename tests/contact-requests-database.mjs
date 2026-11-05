import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();
const admin = "00000000-0000-4000-8000-000000000001";

await db.exec(`
create role anon; create role authenticated; create role service_role;
create schema auth;
create table public.profiles(id uuid primary key, email text, role text, status text);
create table auth.users(id uuid primary key, email_confirmed_at timestamptz);
insert into public.profiles values ('${admin}','admin@test.invalid','admin','active');
insert into auth.users values ('${admin}',now());
`);

await db.exec(readFileSync(new URL("../supabase/migrations/202611050001_contact_requests.sql", import.meta.url), "utf8"));

const inserted = (await db.query(`
  insert into public.contact_requests(full_name,email,language,package_lessons,message)
  values ('Test Student','student@test.invalid','English',10,'Work conversation')
  returning id
`)).rows[0];

let rows = (await db.query("select request_id,recipient_id,status,attempts from public.contact_request_email_outbox")).rows;
assert.equal(rows.length, 1);
assert.equal(rows[0].request_id, inserted.id);
assert.equal(rows[0].recipient_id, admin);
assert.equal(rows[0].status, "pending");

await db.exec("set role service_role");
const claimed = (await db.query("select * from public.claim_contact_request_emails(5)")).rows;
assert.equal(claimed.length, 1);
assert.equal(claimed[0].request_id, inserted.id);
assert.equal(claimed[0].status, "sending");
assert.equal(claimed[0].attempts, 1);
await db.exec("reset role");

await db.exec("set role authenticated");
await assert.rejects(db.query("select * from public.contact_requests"), /permission denied/);
await assert.rejects(db.query("select * from public.contact_request_email_outbox"), /permission denied/);
await assert.rejects(db.query("select * from public.claim_contact_request_emails(5)"), /permission denied/);
await db.exec("reset role");

console.log("PASS: website lesson requests queue one service-only admin notification");
await db.close();
