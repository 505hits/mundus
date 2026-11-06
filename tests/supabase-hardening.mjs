import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();
await db.exec(`
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
create function auth.uid() returns uuid language sql stable as $$
  select '00000000-0000-4000-8000-000000000099'::uuid
$$;

create table public.profiles(
  id uuid primary key,
  role text,
  status text
);

create table public.company_quote_email_outbox(
  id uuid primary key,
  recipient_id uuid references public.profiles(id)
);
create table public.contact_request_email_outbox(
  id uuid primary key,
  recipient_id uuid references public.profiles(id)
);
create table public.group_sessions(
  id uuid primary key,
  teacher_id uuid references public.profiles(id),
  created_by uuid references public.profiles(id)
);
`);

const migration = readFileSync(
  new URL("../supabase/migrations/202611060010_supabase_security_performance_hardening.sql", import.meta.url),
  "utf8"
);
await db.exec(migration);
await db.exec(migration);

const indexes=(await db.query(`
  select indexname from pg_indexes
  where schemaname='public'
`)).rows.map(row=>row.indexname);

for(const name of [
  "company_quote_email_outbox_recipient_id_idx",
  "contact_request_email_outbox_recipient_id_idx",
  "group_sessions_created_by_idx",
  "group_sessions_teacher_id_idx",
]) assert.ok(indexes.includes(name),name);

await db.exec(`
insert into public.profiles(id,role,status)
values('00000000-0000-4000-8000-000000000099','admin','active');
insert into auth.users(id,email_confirmed_at)
values('00000000-0000-4000-8000-000000000099',null);
`);

let row=(await db.query("select public.is_active_admin() as ok")).rows[0];
assert.equal(row.ok,false,"unconfirmed admins must fail the shared admin gate");

await db.query(`
update auth.users
set email_confirmed_at=now()
where id='00000000-0000-4000-8000-000000000099'
`);
row=(await db.query("select public.is_active_admin() as ok")).rows[0];
assert.equal(row.ok,true,"confirmed active admins must pass the shared admin gate");

await db.close();
console.log("PASS: confirmed-admin gate and new foreign-key indexes are reproducible and idempotent");
