begin;

create table if not exists public.teacher_monthly_feedback (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  feedback_month date not null,
  rating smallint not null check (rating between 1 and 5),
  feedback text not null default '' check (char_length(feedback) <= 1500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_monthly_feedback_month_start check (feedback_month = date_trunc('month', feedback_month)::date),
  constraint teacher_monthly_feedback_unique unique (student_id, teacher_id, feedback_month),
  constraint teacher_monthly_feedback_distinct_users check (student_id <> teacher_id)
);

create index if not exists teacher_monthly_feedback_teacher_month_idx
  on public.teacher_monthly_feedback(teacher_id, feedback_month);
create index if not exists teacher_monthly_feedback_student_month_idx
  on public.teacher_monthly_feedback(student_id, feedback_month);

alter table public.teacher_monthly_feedback enable row level security;

grant select, insert, update on public.teacher_monthly_feedback to authenticated;
revoke all on public.teacher_monthly_feedback from anon;

drop policy if exists teacher_monthly_feedback_student_read on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_student_read
on public.teacher_monthly_feedback for select
to authenticated
using (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
);

drop policy if exists teacher_monthly_feedback_admin_read on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_admin_read
on public.teacher_monthly_feedback for select
to authenticated
using (public.is_active_admin());

drop policy if exists teacher_monthly_feedback_student_insert on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_student_insert
on public.teacher_monthly_feedback for insert
to authenticated
with check (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
  and exists (
    select 1
    from public.lessons l
    where l.student_id = (select auth.uid())
      and l.teacher_id = teacher_monthly_feedback.teacher_id
      and l.status = 'completed'
      and l.scheduled_at >= teacher_monthly_feedback.feedback_month::timestamptz
      and l.scheduled_at < (teacher_monthly_feedback.feedback_month + interval '1 month')::timestamptz
  )
);

drop policy if exists teacher_monthly_feedback_student_update on public.teacher_monthly_feedback;
create policy teacher_monthly_feedback_student_update
on public.teacher_monthly_feedback for update
to authenticated
using (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
)
with check (
  (select auth.uid()) = student_id
  and public.mundus_matching_role('student')
  and exists (
    select 1
    from public.lessons l
    where l.student_id = (select auth.uid())
      and l.teacher_id = teacher_monthly_feedback.teacher_id
      and l.status = 'completed'
      and l.scheduled_at >= teacher_monthly_feedback.feedback_month::timestamptz
      and l.scheduled_at < (teacher_monthly_feedback.feedback_month + interval '1 month')::timestamptz
  )
);

commit;
