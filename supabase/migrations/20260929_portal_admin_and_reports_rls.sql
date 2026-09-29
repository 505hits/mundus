-- Mundus portal: admin access + lesson report RLS
-- Prepared for the production Supabase project. Apply through Supabase migrations/SQL editor.

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_reports enable row level security;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "Admins can manage lessons" on public.lessons;
create policy "Admins can manage lessons"
on public.lessons
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "Students can view own lesson reports" on public.lesson_reports;
create policy "Students can view own lesson reports"
on public.lesson_reports
for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Teachers can view assigned lesson reports" on public.lesson_reports;
create policy "Teachers can view assigned lesson reports"
on public.lesson_reports
for select
to authenticated
using (
  teacher_id = auth.uid()
  and exists (
    select 1
    from public.lessons
    where lessons.id = lesson_reports.lesson_id
      and lessons.teacher_id = auth.uid()
      and lessons.student_id = lesson_reports.student_id
  )
);

drop policy if exists "Teachers can create assigned lesson reports" on public.lesson_reports;
create policy "Teachers can create assigned lesson reports"
on public.lesson_reports
for insert
to authenticated
with check (
  teacher_id = auth.uid()
  and exists (
    select 1
    from public.lessons
    where lessons.id = lesson_reports.lesson_id
      and lessons.teacher_id = auth.uid()
      and lessons.student_id = lesson_reports.student_id
      and lessons.status = 'completed'
  )
);

drop policy if exists "Teachers can update assigned lesson reports" on public.lesson_reports;
create policy "Teachers can update assigned lesson reports"
on public.lesson_reports
for update
to authenticated
using (
  teacher_id = auth.uid()
  and exists (
    select 1
    from public.lessons
    where lessons.id = lesson_reports.lesson_id
      and lessons.teacher_id = auth.uid()
      and lessons.student_id = lesson_reports.student_id
  )
)
with check (
  teacher_id = auth.uid()
  and exists (
    select 1
    from public.lessons
    where lessons.id = lesson_reports.lesson_id
      and lessons.teacher_id = auth.uid()
      and lessons.student_id = lesson_reports.student_id
  )
);

drop policy if exists "Admins can manage lesson reports" on public.lesson_reports;
create policy "Admins can manage lesson reports"
on public.lesson_reports
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());
