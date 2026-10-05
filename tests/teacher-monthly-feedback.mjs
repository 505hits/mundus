import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();
await db.exec(`
create role anon; create role authenticated;
create schema auth;
create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
create table profiles(id uuid primary key, role text, status text);
create table lessons(
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  teacher_id uuid not null references profiles(id),
  status text,
  scheduled_at timestamptz
);
create function mundus_matching_role(role_name text) returns boolean language sql stable as $$ select true $$;
create function is_active_admin() returns boolean language sql stable as $$ select false $$;
`);

await db.exec(readFileSync(
  new URL("../supabase/migrations/202610050011_teacher_monthly_feedback.sql", import.meta.url),
  "utf8"
));

await db.exec(`
insert into profiles values
('00000000-0000-4000-8000-000000000001','student','active'),
('00000000-0000-4000-8000-000000000002','teacher','active');
`);

await db.query(`
insert into teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating,feedback)
values(
 '00000000-0000-4000-8000-000000000001',
 '00000000-0000-4000-8000-000000000002',
 '2026-10-01',
 5,
 'Great lessons'
)`);

await assert.rejects(
  db.query(`
    insert into teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating)
    values(
     '00000000-0000-4000-8000-000000000001',
     '00000000-0000-4000-8000-000000000002',
     '2026-10-01',
     4
    )`),
  /unique|duplicate/i
);

await assert.rejects(
  db.query(`
    insert into teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating)
    values(
     '00000000-0000-4000-8000-000000000001',
     '00000000-0000-4000-8000-000000000002',
     '2026-11-01',
     6
    )`),
  /check constraint/i
);

await assert.rejects(
  db.query(`
    insert into teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating)
    values(
     '00000000-0000-4000-8000-000000000001',
     '00000000-0000-4000-8000-000000000002',
     '2026-11-15',
     5
    )`),
  /check constraint/i
);

const indexes = await db.query(`
select count(*)::int n from pg_indexes
where schemaname='public'
  and indexname in ('teacher_monthly_feedback_teacher_month_idx','teacher_monthly_feedback_student_month_idx')
`);
assert.equal(indexes.rows[0].n, 2);

await db.close();
console.log("PASS: monthly teacher feedback constraints and indexes");
