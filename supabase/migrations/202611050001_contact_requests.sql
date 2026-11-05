begin;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 5 and 254),
  language text not null check (char_length(trim(language)) between 2 and 80),
  package_lessons integer check (package_lessons is null or package_lessons in (1,5,10,20,30)),
  message text not null default '' check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from anon, authenticated;
grant all on public.contact_requests to service_role;

create index if not exists contact_requests_status_created_idx
on public.contact_requests(status, created_at desc);
create index if not exists contact_requests_email_created_idx
on public.contact_requests(lower(email), created_at desc);

create table if not exists public.contact_request_email_outbox (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.contact_requests(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id),
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  lease_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(request_id, recipient_id)
);
alter table public.contact_request_email_outbox enable row level security;
revoke all on public.contact_request_email_outbox from anon, authenticated;
grant all on public.contact_request_email_outbox to service_role;

create or replace function public.queue_contact_request_admin_emails()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  insert into public.contact_request_email_outbox(request_id,recipient_id,recipient_email)
  select new.id,p.id,p.email
  from public.profiles p
  join auth.users u on u.id=p.id
  where p.role='admin'
    and p.status='active'
    and p.email is not null
    and u.email_confirmed_at is not null
  on conflict(request_id,recipient_id) do nothing;
  return new;
end;
$$;
revoke all on function public.queue_contact_request_admin_emails() from public,anon,authenticated;

drop trigger if exists queue_contact_request_admin_emails on public.contact_requests;
create trigger queue_contact_request_admin_emails
after insert on public.contact_requests
for each row execute function public.queue_contact_request_admin_emails();

create or replace function public.claim_contact_request_emails(batch_size integer default 5)
returns setof public.contact_request_email_outbox
language sql
security definer
set search_path=''
as $$
  with candidates as (
    select id from public.contact_request_email_outbox
    where attempts < 5
      and available_at <= now()
      and (status='pending' or (status='sending' and lease_until < now()))
    order by created_at
    limit least(greatest(batch_size,1),5)
    for update skip locked
  )
  update public.contact_request_email_outbox n
  set status='sending',
      attempts=n.attempts+1,
      lease_token=gen_random_uuid(),
      lease_until=now()+interval '10 minutes'
  from candidates c
  where n.id=c.id
  returning n.*;
$$;
revoke all on function public.claim_contact_request_emails(integer) from public,anon,authenticated;
grant execute on function public.claim_contact_request_emails(integer) to service_role;

commit;
