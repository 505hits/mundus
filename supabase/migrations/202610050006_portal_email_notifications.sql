begin;

create table if not exists public.portal_email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id),
  recipient_email text not null,
  kind text not null check (kind in ('admin_assignment','admin_renewal','student_renewal')),
  student_id uuid not null references public.profiles(id),
  package_id uuid references public.lesson_packages(id),
  status text not null default 'pending' check (status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  lease_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(kind,recipient_id,package_id)
);
alter table public.portal_email_outbox enable row level security;
revoke all on public.portal_email_outbox from anon,authenticated;
grant all on public.portal_email_outbox to service_role;

create or replace function public.queue_paid_student_assignment_email()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.status='paid' and old.status is distinct from 'paid' and new.lesson_package_id is not null then
    insert into public.portal_email_outbox(recipient_id,recipient_email,kind,student_id,package_id)
    select p.id,p.email,'admin_assignment',new.student_id,new.lesson_package_id
    from public.profiles p join auth.users u on u.id=p.id
    where p.role='admin' and p.status='active' and p.email is not null and u.email_confirmed_at is not null
    on conflict(kind,recipient_id,package_id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function public.queue_paid_student_assignment_email() from public,anon,authenticated;
drop trigger if exists queue_paid_student_assignment_email on public.payment_orders;
create trigger queue_paid_student_assignment_email after update of status on public.payment_orders
for each row execute function public.queue_paid_student_assignment_email();

create or replace function public.queue_package_renewal_emails()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.remaining_lessons is null or old.remaining_lessons is null then return new; end if;

  if new.remaining_lessons<=2 and old.remaining_lessons>2 then
    insert into public.portal_email_outbox(recipient_id,recipient_email,kind,student_id,package_id)
    select p.id,p.email,'admin_renewal',new.student_id,new.id
    from public.profiles p join auth.users u on u.id=p.id
    where p.role='admin' and p.status='active' and p.email is not null and u.email_confirmed_at is not null
    on conflict(kind,recipient_id,package_id) do nothing;
  end if;

  if new.total_lessons=5 and new.used_lessons>=4 and new.remaining_lessons<=1 and old.remaining_lessons>1 then
    insert into public.portal_email_outbox(recipient_id,recipient_email,kind,student_id,package_id)
    select p.id,p.email,'student_renewal',new.student_id,new.id
    from public.profiles p join auth.users u on u.id=p.id
    where p.id=new.student_id and p.role='student' and p.status='active'
      and p.email is not null and u.email_confirmed_at is not null
    on conflict(kind,recipient_id,package_id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function public.queue_package_renewal_emails() from public,anon,authenticated;
drop trigger if exists queue_package_renewal_emails on public.lesson_packages;
create trigger queue_package_renewal_emails after update of used_lessons,remaining_lessons on public.lesson_packages
for each row execute function public.queue_package_renewal_emails();

create or replace function public.claim_portal_emails(batch_size integer default 5)
returns setof public.portal_email_outbox language sql security definer set search_path='' as $$
  with candidates as (
    select id from public.portal_email_outbox
    where attempts<5 and available_at<=now()
      and (status='pending' or (status='sending' and lease_until<now()))
    order by created_at
    limit least(greatest(batch_size,1),5)
    for update skip locked
  )
  update public.portal_email_outbox n
  set status='sending',attempts=n.attempts+1,lease_token=gen_random_uuid(),lease_until=now()+interval '10 minutes'
  from candidates c where n.id=c.id returning n.*;
$$;
revoke all on function public.claim_portal_emails(integer) from public,anon,authenticated;
grant execute on function public.claim_portal_emails(integer) to service_role;

commit;
