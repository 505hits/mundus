import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();

await db.exec(`
create role anon;
create role authenticated;

create schema auth;
create function auth.uid() returns uuid language sql stable as $$ select '00000000-0000-4000-8000-000000000099'::uuid $$;

create table public.profiles(
  id uuid primary key,
  role text,
  status text
);

create function public.is_active_admin() returns boolean language sql stable as $$ select true $$;
create function public.mundus_matching_role(role_name text) returns boolean language sql stable as $$ select role_name in ('student','teacher','admin') $$;

create table public.lessons(
  id uuid primary key,
  student_id uuid not null references public.profiles(id),
  teacher_id uuid not null references public.profiles(id),
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  status text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.teacher_monthly_feedback(
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  teacher_id uuid not null references public.profiles(id),
  feedback_month date not null,
  rating smallint not null,
  feedback text not null default ''
);
`);

await db.exec(readFileSync(new URL("../supabase/migrations/202610050013_operations_quality_layer.sql",import.meta.url),"utf8"));
await db.exec(readFileSync(new URL("../supabase/migrations/202610050014_sync_lesson_attendance.sql",import.meta.url),"utf8"));

await db.exec(`
insert into public.profiles(id,role,status) values
('00000000-0000-4000-8000-000000000001','student','active'),
('00000000-0000-4000-8000-000000000002','teacher','active'),
('00000000-0000-4000-8000-000000000099','admin','active');

insert into public.lessons(id,student_id,teacher_id,scheduled_at,status)
values(
 '10000000-0000-4000-8000-000000000001',
 '00000000-0000-4000-8000-000000000001',
 '00000000-0000-4000-8000-000000000002',
 now()-interval '1 hour',
 'scheduled'
);
`);

await db.query(`update public.lessons set status='completed' where id='10000000-0000-4000-8000-000000000001'`);
let lesson=(await db.query(`select attendance_status,attendance_marked_at is not null marked from public.lessons where id='10000000-0000-4000-8000-000000000001'`)).rows[0];
assert.equal(lesson.attendance_status,"attended");
assert.equal(lesson.marked,true);

await db.query(`update public.lessons set status='rescheduled' where id='10000000-0000-4000-8000-000000000001'`);
lesson=(await db.query(`select attendance_status,attendance_marked_at from public.lessons where id='10000000-0000-4000-8000-000000000001'`)).rows[0];
assert.equal(lesson.attendance_status,null);
assert.equal(lesson.attendance_marked_at,null);

await db.query(`update public.lessons set status='student_no_show' where id='10000000-0000-4000-8000-000000000001'`);
lesson=(await db.query(`select attendance_status from public.lessons where id='10000000-0000-4000-8000-000000000001'`)).rows[0];
assert.equal(lesson.attendance_status,"student_no_show");

await assert.rejects(
  db.query(`update public.lessons set attendance_status='invalid' where id='10000000-0000-4000-8000-000000000001'`),
  /check constraint/i
);

await db.query(`
insert into public.teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating,categories)
values(
 '00000000-0000-4000-8000-000000000001',
 '00000000-0000-4000-8000-000000000002',
 '2026-10-01',5,array['preparation','friendly']
)
`);
await assert.rejects(
  db.query(`
    insert into public.teacher_monthly_feedback(student_id,teacher_id,feedback_month,rating,categories)
    values(
     '00000000-0000-4000-8000-000000000001',
     '00000000-0000-4000-8000-000000000002',
     '2026-11-01',5,array['speed']
    )`),
  /check constraint/i
);

await db.query(`
insert into public.teacher_pay_rates(teacher_id,effective_month,rate_cents_per_lesson,created_by)
values(
 '00000000-0000-4000-8000-000000000002',
 '2026-10-01',1800,
 '00000000-0000-4000-8000-000000000099'
)
`);
await assert.rejects(
  db.query(`
    insert into public.teacher_pay_rates(teacher_id,effective_month,rate_cents_per_lesson,created_by)
    values(
     '00000000-0000-4000-8000-000000000002',
     '2026-10-15',1800,
     '00000000-0000-4000-8000-000000000099'
    )`),
  /check constraint/i
);
await assert.rejects(
  db.query(`
    insert into public.teacher_pay_rates(teacher_id,effective_month,rate_cents_per_lesson,created_by)
    values(
     '00000000-0000-4000-8000-000000000002',
     '2026-11-01',100001,
     '00000000-0000-4000-8000-000000000099'
    )`),
  /check constraint/i
);

await db.query(`
insert into public.admin_profile_notes(subject_profile_id,note,created_by)
values(
 '00000000-0000-4000-8000-000000000001',
 'Prefers morning lessons',
 '00000000-0000-4000-8000-000000000099'
)
`);
await assert.rejects(
  db.query(`
    insert into public.admin_profile_notes(subject_profile_id,note,created_by)
    values(
     '00000000-0000-4000-8000-000000000001',
     '',
     '00000000-0000-4000-8000-000000000099'
    )`),
  /check constraint/i
);

await db.close();
console.log("PASS: attendance, feedback categories, payout rates and admin notes constraints");
