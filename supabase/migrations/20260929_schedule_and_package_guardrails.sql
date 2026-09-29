-- Mundus portal: additional package and schedule integrity guardrails.
-- Apply to the production Supabase project after the earlier portal RLS migration.

create or replace function public.apply_accepted_schedule_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_rows integer;
begin
  if new.status = 'accepted'
     and old.status is distinct from 'accepted' then

    if new.preferred_at <= now() then
      raise exception 'Accepted lesson time must be in the future';
    end if;

    update public.lessons
    set
      scheduled_at = new.preferred_at,
      status = 'rescheduled',
      updated_at = now()
    where id = new.lesson_id
      and student_id = new.student_id
      and status in ('scheduled', 'rescheduled');

    get diagnostics changed_rows = row_count;

    if changed_rows <> 1 then
      raise exception 'Schedule change is not linked to an active lesson';
    end if;

    new.responded_at = coalesce(new.responded_at, now());
    new.updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists apply_accepted_schedule_change_trigger
on public.schedule_change_requests;

create trigger apply_accepted_schedule_change_trigger
before update of status
on public.schedule_change_requests
for each row
execute function public.apply_accepted_schedule_change();


-- Keep package counters internally consistent when they are edited manually.
create or replace function public.validate_lesson_package_counters()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.total_lessons is null or new.total_lessons <= 0 then
    raise exception 'Package total must be greater than zero';
  end if;

  new.used_lessons := coalesce(new.used_lessons, 0);
  new.remaining_lessons := coalesce(new.remaining_lessons, 0);

  if new.used_lessons < 0 or new.remaining_lessons < 0 then
    raise exception 'Package counters cannot be negative';
  end if;

  if new.used_lessons > new.total_lessons
     or new.remaining_lessons > new.total_lessons then
    raise exception 'Package counters cannot exceed package total';
  end if;

  if new.used_lessons + new.remaining_lessons <> new.total_lessons then
    raise exception 'Used and remaining lessons must equal package total';
  end if;

  if new.remaining_lessons = 0 and new.status = 'active' then
    new.status := 'completed';
  end if;

  if new.remaining_lessons > 0 and new.status = 'completed' then
    raise exception 'A completed package cannot have remaining lessons';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_lesson_package_counters_trigger
on public.lesson_packages;

create trigger validate_lesson_package_counters_trigger
before insert or update of total_lessons, used_lessons, remaining_lessons
on public.lesson_packages
for each row
execute function public.validate_lesson_package_counters();
