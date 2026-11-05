begin;

alter table public.portal_email_outbox
  drop constraint if exists portal_email_outbox_kind_check;

alter table public.portal_email_outbox
  add constraint portal_email_outbox_kind_check
  check (kind in ('admin_assignment','admin_matching_ready','admin_renewal','student_renewal'));

create or replace function public.queue_matching_ready_email()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  paid_package_id uuid;
begin
  if new.completed_at is null then
    return new;
  end if;

  if tg_op='UPDATE' and old.completed_at is not null then
    return new;
  end if;

  select po.lesson_package_id into paid_package_id
  from public.payment_orders po
  join public.lesson_packages lp on lp.id=po.lesson_package_id
  where po.student_id=new.student_id
    and po.status='paid'
    and po.lesson_package_id is not null
  order by lp.purchased_at desc nulls last
  limit 1;

  if paid_package_id is null then
    return new;
  end if;

  insert into public.portal_email_outbox(recipient_id,recipient_email,kind,student_id,package_id)
  select p.id,p.email,'admin_matching_ready',new.student_id,paid_package_id
  from public.profiles p
  join auth.users u on u.id=p.id
  where p.role='admin'
    and p.status='active'
    and p.email is not null
    and u.email_confirmed_at is not null
  on conflict(kind,recipient_id,package_id) do nothing;

  return new;
end;
$$;

revoke all on function public.queue_matching_ready_email() from public,anon,authenticated;

drop trigger if exists queue_matching_ready_email on public.student_onboarding;
create trigger queue_matching_ready_email
after insert or update of completed_at on public.student_onboarding
for each row execute function public.queue_matching_ready_email();

commit;
