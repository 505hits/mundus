begin;
-- Wrap existing accounting. Do not install a second credit-deduction trigger.
-- Catalog first, temporary schema last; preserve public lookup in legacy triggers.
create or replace function public.mundus_complete_lesson(target_lesson_id uuid)
returns uuid language plpgsql security definer set search_path = pg_catalog, public, pg_temp
as $$
declare
  actor_role text;
  lesson_row public.lessons%rowtype;
  package_before public.lesson_packages%rowtype;
  package_after public.lesson_packages%rowtype;
  changed integer;
begin
  select p.role into actor_role from public.profiles p
  join auth.users u on u.id=p.id
  where p.id=auth.uid() and p.status='active' and u.email_confirmed_at is not null
    and p.role in ('teacher','admin');
  if actor_role is null then raise exception 'Verified active teacher or admin required'; end if;

  select * into lesson_row from public.lessons where id=target_lesson_id for update;
  if not found or (actor_role='teacher' and lesson_row.teacher_id is distinct from auth.uid()) then
    raise exception 'Assigned lesson required';
  end if;
  -- A repeated call cannot run the accounting triggers again.
  if lesson_row.status='completed' then return lesson_row.id; end if;
  if lesson_row.status is null or lesson_row.status not in ('scheduled','rescheduled')
    or lesson_row.scheduled_at is null or lesson_row.scheduled_at > now() then
    raise exception 'Only an elapsed scheduled lesson can be completed';
  end if;

  select * into package_before from public.lesson_packages
    where id=lesson_row.package_id and student_id=lesson_row.student_id for update;
  if not found or package_before.status is distinct from 'active'
    or package_before.total_lessons is null or package_before.total_lessons<=0
    or package_before.used_lessons is null or package_before.used_lessons<0
    or package_before.remaining_lessons is null or package_before.remaining_lessons<=0
    or package_before.used_lessons+package_before.remaining_lessons<>package_before.total_lessons then
    raise exception 'Consistent active student package with credit required';
  end if;

  update public.lessons set status='completed',updated_at=now()
    where id=lesson_row.id and status in ('scheduled','rescheduled');
  get diagnostics changed=row_count;
  if changed<>1 then raise exception 'Lesson completion was not saved'; end if;
  select * into package_after from public.lesson_packages where id=package_before.id;
  if not found or package_after.student_id is distinct from package_before.student_id
    or package_after.total_lessons is distinct from package_before.total_lessons
    or package_after.used_lessons is distinct from package_before.used_lessons+1
    or package_after.remaining_lessons is distinct from package_before.remaining_lessons-1
    or package_after.status::text is distinct from
      (case when package_before.remaining_lessons=1 then 'completed' else 'active' end) then
    raise exception 'Lesson accounting must deduct exactly one credit; completion rolled back';
  end if;
  return lesson_row.id;
end;
$$;
revoke all on function public.mundus_complete_lesson(uuid) from public,anon;
grant execute on function public.mundus_complete_lesson(uuid) to authenticated;
-- Prevent an assigned teacher from bypassing the wrapper with a direct API update.
-- Trusted admins retain existing correction access; their direct edits need auditing.
alter table public.lessons enable row level security;
drop policy if exists "Teacher completion requires verified accounting" on public.lessons;
create policy "Teacher completion requires verified accounting" on public.lessons
as restrictive for update to authenticated using (true)
with check (status is distinct from 'completed' or public.is_active_admin());
commit;
