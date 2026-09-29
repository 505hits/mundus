-- Mundus portal: final schedule-request integrity guards.
-- Apply after the earlier schedule/RLS migrations.

-- Only one pending schedule-change request may exist for a lesson at a time.
create unique index if not exists schedule_change_requests_one_pending_per_lesson
on public.schedule_change_requests (lesson_id)
where status = 'pending';


create or replace function public.validate_schedule_change_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  linked_student_id uuid;
  linked_status text;
  linked_scheduled_at timestamptz;
begin
  select student_id, status, scheduled_at
  into linked_student_id, linked_status, linked_scheduled_at
  from public.lessons
  where id = new.lesson_id;

  if linked_student_id is null then
    raise exception 'Schedule request must reference an existing lesson';
  end if;

  if linked_student_id <> new.student_id then
    raise exception 'Schedule request student must match the lesson student';
  end if;

  if linked_status not in ('scheduled', 'rescheduled') then
    raise exception 'Only an active upcoming lesson can be rescheduled';
  end if;

  if linked_scheduled_at <= now() then
    raise exception 'Past lessons cannot be rescheduled';
  end if;

  if new.preferred_at <= now() then
    raise exception 'Preferred lesson time must be in the future';
  end if;

  if new.alternative_at is not null and new.alternative_at <= now() then
    raise exception 'Alternative lesson time must be in the future';
  end if;

  if new.status not in ('pending', 'accepted', 'declined') then
    raise exception 'Invalid schedule request status';
  end if;

  return new;
end;
$$;

drop trigger if exists a_validate_schedule_change_request
on public.schedule_change_requests;

create trigger a_validate_schedule_change_request
before insert or update of lesson_id, student_id, preferred_at, alternative_at, status
on public.schedule_change_requests
for each row
execute function public.validate_schedule_change_request();
