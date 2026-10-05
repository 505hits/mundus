begin;

alter table public.lessons
  add column if not exists attendance_status text,
  add column if not exists attendance_marked_at timestamptz,
  add column if not exists attendance_marked_by uuid references public.profiles(id) on delete set null;

alter table public.lessons
  drop constraint if exists lessons_attendance_status_check;
alter table public.lessons
  add constraint lessons_attendance_status_check
  check (
    attendance_status is null or attendance_status in (
      'attended','student_no_show','late_cancellation','student_cancelled','teacher_cancelled'
    )
  );

create index if not exists lessons_attendance_month_idx
  on public.lessons(teacher_id, scheduled_at, attendance_status);

alter table public.teacher_monthly_feedback
  add column if not exists categories text[] not null default '{}';

alter table public.teacher_monthly_feedback
  drop constraint if exists teacher_monthly_feedback_categories_check;
alter table public.teacher_monthly_feedback
  add constraint teacher_monthly_feedback_categories_check
  check (
    categories <@ array['preparation','explanation','conversation','friendly','punctuality']::text[]
  );

create table if not exists public.teacher_pay_rates (
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  effective_month date not null,
  rate_cents_per_lesson integer not null check (rate_cents_per_lesson between 0 and 100000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (teacher_id,effective_month),
  constraint teacher_pay_rates_month_start check (effective_month = date_trunc('month',effective_month)::date)
);
alter table public.teacher_pay_rates enable row level security;
revoke all on public.teacher_pay_rates from anon;
grant select,insert,update on public.teacher_pay_rates to authenticated;
drop policy if exists teacher_pay_rates_admin_select on public.teacher_pay_rates;
create policy teacher_pay_rates_admin_select on public.teacher_pay_rates for select to authenticated using (public.is_active_admin());
drop policy if exists teacher_pay_rates_admin_insert on public.teacher_pay_rates;
create policy teacher_pay_rates_admin_insert on public.teacher_pay_rates for insert to authenticated with check (public.is_active_admin());
drop policy if exists teacher_pay_rates_admin_update on public.teacher_pay_rates;
create policy teacher_pay_rates_admin_update on public.teacher_pay_rates for update to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create index if not exists teacher_pay_rates_month_idx on public.teacher_pay_rates(effective_month,teacher_id);

create table if not exists public.admin_profile_notes (
  id uuid primary key default gen_random_uuid(),
  subject_profile_id uuid not null references public.profiles(id) on delete cascade,
  note text not null check (char_length(btrim(note)) between 1 and 3000),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.admin_profile_notes enable row level security;
revoke all on public.admin_profile_notes from anon;
grant select,insert,update,delete on public.admin_profile_notes to authenticated;
drop policy if exists admin_profile_notes_admin_all on public.admin_profile_notes;
create policy admin_profile_notes_admin_all on public.admin_profile_notes
for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create index if not exists admin_profile_notes_subject_idx on public.admin_profile_notes(subject_profile_id,created_at desc);

commit;
