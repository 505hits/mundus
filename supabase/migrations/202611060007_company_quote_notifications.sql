begin;

create table if not exists public.company_quote_email_outbox (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.company_quote_requests(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id),
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  lease_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(request_id,recipient_id)
);
alter table public.company_quote_email_outbox enable row level security;
revoke all on public.company_quote_email_outbox from anon,authenticated;
grant all on public.company_quote_email_outbox to service_role;

create or replace function public.queue_company_quote_admin_emails()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  insert into public.company_quote_email_outbox(request_id,recipient_id,recipient_email)
  select new.id,p.id,p.email
  from public.profiles p join auth.users u on u.id=p.id
  where p.role='admin' and p.status='active' and p.email is not null and u.email_confirmed_at is not null
  on conflict(request_id,recipient_id) do nothing;
  return new;
end;
$$;
revoke all on function public.queue_company_quote_admin_emails() from public,anon,authenticated;

drop trigger if exists queue_company_quote_admin_emails on public.company_quote_requests;
create trigger queue_company_quote_admin_emails
after insert on public.company_quote_requests
for each row execute function public.queue_company_quote_admin_emails();

create or replace function public.claim_company_quote_emails(batch_size integer default 5)
returns setof public.company_quote_email_outbox
language sql security definer set search_path=''
as $$
  with candidates as (
    select id from public.company_quote_email_outbox
    where attempts < 5 and available_at <= now()
      and (status='pending' or (status='sending' and lease_until < now()))
    order by created_at
    limit least(greatest(batch_size,1),5)
    for update skip locked
  )
  update public.company_quote_email_outbox n
  set status='sending',attempts=n.attempts+1,lease_token=gen_random_uuid(),lease_until=now()+interval '10 minutes'
  from candidates c where n.id=c.id returning n.*;
$$;
revoke all on function public.claim_company_quote_emails(integer) from public,anon,authenticated;
grant execute on function public.claim_company_quote_emails(integer) to service_role;

commit;