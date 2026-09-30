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


-- Keep lessons and packages consistent.
create or replace function public.validate_lesson_package_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  package_student_id uuid;
  package_remaining integer;
  package_status text;
begin
  if new.package_id is null then
    return new;
  end if;

  select student_id, remaining_lessons, status
  into package_student_id, package_remaining, package_status
  from public.lesson_packages
  where id = new.package_id;

  if package_student_id is null then
    raise exception 'Selected lesson package does not exist';
  end if;

  if package_student_id <> new.student_id then
    raise exception 'Lesson package must belong to the same student';
  end if;

  if (
    tg_op = 'INSERT'
    or old.package_id is distinct from new.package_id
  ) and package_status <> 'active' then
    raise exception 'Only an active lesson package can be assigned';
  end if;

  if new.status = 'completed'
     and (
       tg_op = 'INSERT'
       or old.status is distinct from 'completed'
       or old.package_id is distinct from new.package_id
     )
     and coalesce(package_remaining, 0) <= 0 then
    raise exception 'No lessons remain in the selected package';
  end if;

  return new;
end;
$$;

drop trigger if exists a_validate_lesson_package_assignment
on public.lessons;

create trigger a_validate_lesson_package_assignment
before insert or update of package_id, student_id, status
on public.lessons
for each row
execute function public.validate_lesson_package_assignment();


-- Let teachers work with packages and create future lessons only for
-- students they are already assigned to through an existing lesson.
create or replace function public.teacher_is_assigned_to_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.lessons
    where teacher_id = auth.uid()
      and student_id = target_student_id
  );
$$;

revoke all on function public.teacher_is_assigned_to_student(uuid) from public;
grant execute on function public.teacher_is_assigned_to_student(uuid) to authenticated;

alter table public.lesson_packages enable row level security;

drop policy if exists "Teachers can view assigned student packages" on public.lesson_packages;
create policy "Teachers can view assigned student packages"
on public.lesson_packages
for select
to authenticated
using (public.teacher_is_assigned_to_student(student_id));

drop policy if exists "Teachers can create lessons for assigned students" on public.lessons;
create policy "Teachers can create lessons for assigned students"
on public.lessons
for insert
to authenticated
with check (
  teacher_id = auth.uid()
  and public.teacher_is_assigned_to_student(student_id)
);
