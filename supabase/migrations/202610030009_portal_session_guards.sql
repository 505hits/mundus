begin;
-- Restrict old overlapping policies without replacing their row/role checks.
create or replace function public.mundus_active_portal_account()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p join auth.users u on u.id = p.id
    where p.id = auth.uid() and p.status = 'active'
      and p.role in ('student','teacher','admin') and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.mundus_active_portal_account() from public;
grant execute on function public.mundus_active_portal_account() to anon, authenticated;

do $$ declare target text;
begin
  foreach target in array array['lessons','lesson_packages','lesson_reports','schedule_change_requests',
    'student_onboarding','payment_orders','placement_results','learning_files'] loop
    if to_regclass('public.' || target) is null then
      continue;
    end if;
    execute format('alter table public.%I enable row level security', target);
    execute format('drop policy if exists "Active verified portal account required" on public.%I', target);
    execute format('create policy "Active verified portal account required" on public.%I as restrictive for all to public using (public.mundus_active_portal_account()) with check (public.mundus_active_portal_account())', target);
  end loop;
end $$;

create or replace function public.validate_schedule_change_request()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  linked_student_id uuid;
  linked_teacher_id uuid;
  linked_status text;
  linked_scheduled_at timestamptz;
begin
  select student_id, teacher_id, status, scheduled_at
  into linked_student_id, linked_teacher_id, linked_status, linked_scheduled_at
  from public.lessons where id = new.lesson_id;
  if linked_student_id is null then
    raise exception 'Schedule request must reference an existing lesson';
  end if;
  if new.student_id is distinct from linked_student_id then
    raise exception 'Schedule request student must match the lesson student';
  end if;
  if tg_op = 'INSERT' then
    if new.status is distinct from 'pending' then
      raise exception 'New schedule requests must be pending';
    end if;
    if auth.uid() is not null then
      if new.requested_by is distinct from auth.uid()
        or (auth.uid() is distinct from linked_student_id and auth.uid() is distinct from linked_teacher_id
            and not public.is_active_admin()) then
        raise exception 'Only the lesson student or teacher can create their own request';
      end if;
    end if;
  end if;
  if new.status is null or new.status not in ('pending','accepted','declined') then
    raise exception 'Invalid schedule request status';
  end if;
  -- The responder guard still enforces pending-only, immutable details and the other party.
  -- Declining an expired/cancelled request must not move the lesson or leave it stuck pending.
  if tg_op = 'UPDATE' and new.status = 'declined' then
    return new;
  end if;
  if linked_status is null or linked_status not in ('scheduled','rescheduled')
    or linked_scheduled_at is null or linked_scheduled_at <= now() then
    raise exception 'Only an active upcoming lesson can be rescheduled';
  end if;
  if new.preferred_at is null or new.preferred_at <= now() then
    raise exception 'Preferred lesson time must be in the future';
  end if;
  if new.alternative_at is not null and new.alternative_at <= now() then
    raise exception 'Alternative lesson time must be in the future';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_schedule_change_request() from public;
commit;
