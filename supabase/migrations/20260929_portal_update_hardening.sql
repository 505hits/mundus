-- Mundus portal: restrict sensitive updates performed by non-admin portal users.
-- Apply after the earlier portal RLS/guardrail migrations.

create or replace function public.guard_teacher_lesson_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
  actor_status text;
begin
  if auth.uid() is null or public.is_active_admin() then
    return new;
  end if;

  select role, status
  into actor_role, actor_status
  from public.profiles
  where id = auth.uid();

  if actor_role = 'teacher' and actor_status = 'active' then
    if old.teacher_id is distinct from auth.uid() then
      raise exception 'Teacher is not assigned to this lesson';
    end if;

    if new.teacher_id is distinct from old.teacher_id then
      raise exception 'Teacher cannot change lesson teacher';
    end if;

    if new.student_id is distinct from old.student_id then
      raise exception 'Teacher cannot change lesson student';
    end if;

    if new.package_id is distinct from old.package_id then
      raise exception 'Teacher cannot change lesson package';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists a_guard_teacher_lesson_update
on public.lessons;

create trigger a_guard_teacher_lesson_update
before update
on public.lessons
for each row
execute function public.guard_teacher_lesson_update();


create or replace function public.guard_schedule_request_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  lesson_teacher_id uuid;
  actor_is_responder boolean := false;
begin
  if auth.uid() is null or public.is_active_admin() then
    return new;
  end if;

  select teacher_id
  into lesson_teacher_id
  from public.lessons
  where id = old.lesson_id
    and student_id = old.student_id;

  actor_is_responder :=
    (
      auth.uid() = old.student_id
      and old.requested_by is distinct from auth.uid()
    )
    or
    (
      auth.uid() = lesson_teacher_id
      and old.requested_by is distinct from auth.uid()
    );

  if not actor_is_responder then
    raise exception 'Only the other party can respond to this schedule request';
  end if;

  if old.status <> 'pending' then
    raise exception 'Only pending schedule requests can be updated';
  end if;

  if new.status not in ('accepted', 'declined') then
    raise exception 'Schedule request response must be accepted or declined';
  end if;

  if new.lesson_id is distinct from old.lesson_id
     or new.student_id is distinct from old.student_id
     or new.requested_by is distinct from old.requested_by
     or new.requested_at is distinct from old.requested_at
     or new.preferred_at is distinct from old.preferred_at
     or new.alternative_at is distinct from old.alternative_at
     or new.message is distinct from old.message then
    raise exception 'Schedule request details cannot be changed while responding';
  end if;

  return new;
end;
$$;

drop trigger if exists a_guard_schedule_request_response
on public.schedule_change_requests;

create trigger a_guard_schedule_request_response
before update
on public.schedule_change_requests
for each row
execute function public.guard_schedule_request_response();
