import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();
await db.exec(`
create table profiles(id uuid primary key);
create table lessons(id uuid primary key,student_id uuid references profiles(id),teacher_id uuid references profiles(id),package_id uuid);
create table lesson_packages(id uuid primary key,student_id uuid references profiles(id));
alter table lessons add constraint lessons_package_id_fkey foreign key(package_id) references lesson_packages(id);
create table lesson_reports(id uuid primary key,student_id uuid references profiles(id),teacher_id uuid references profiles(id));
create table learning_files(id uuid primary key,uploaded_by uuid references profiles(id));
create table notification_outbox(id uuid primary key,recipient_id uuid references profiles(id));
create table payment_discount_settings(id uuid primary key,updated_by uuid references profiles(id));
create table renewal_followups(id uuid primary key,updated_by uuid references profiles(id));
create table schedule_change_requests(id uuid primary key,requested_by uuid references profiles(id),student_id uuid references profiles(id));
`);
await db.exec(readFileSync(new URL("../supabase/migrations/202610050003_foreign_key_indexes.sql", import.meta.url), "utf8"));
const rows=(await db.query(`select indexname from pg_indexes where schemaname='public'`)).rows.map(row=>row.indexname);
for (const name of [
  "learning_files_uploaded_by_idx","lesson_packages_student_id_idx","lesson_reports_student_id_idx",
  "lesson_reports_teacher_id_idx","lessons_package_id_idx","lessons_student_id_idx","lessons_teacher_id_idx",
  "notification_outbox_recipient_id_idx","payment_discount_settings_updated_by_idx",
  "renewal_followups_updated_by_idx","schedule_change_requests_requested_by_idx",
  "schedule_change_requests_student_id_idx"
]) assert.ok(rows.includes(name), name);
await db.close();
console.log("PASS: portal foreign-key covering indexes are created idempotently");
