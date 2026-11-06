begin;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 5 and 254 and email = lower(email)),
  language text not null default 'sk' check (language in ('sk','en')),
  source text not null default 'footer' check (source in ('popup','footer')),
  status text not null default 'pending' check (status in ('pending','active','unsubscribed')),
  consent_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  confirm_token uuid not null unique default gen_random_uuid(),
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;
grant all on public.newsletter_subscribers to service_role;

create index if not exists newsletter_subscribers_status_created_idx
  on public.newsletter_subscribers(status,created_at desc);

create table if not exists public.newsletter_email_outbox (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  recipient_email text not null,
  kind text not null check (kind in ('confirm')),
  status text not null default 'pending' check (status in ('pending','sending','sent','failed','skipped')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  lease_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(subscriber_id,kind)
);

alter table public.newsletter_email_outbox enable row level security;
revoke all on public.newsletter_email_outbox from anon, authenticated;
grant all on public.newsletter_email_outbox to service_role;

create or replace function public.claim_newsletter_emails(batch_size integer default 5)
returns setof public.newsletter_email_outbox
language sql
security definer
set search_path=''
as $$
  with candidates as (
    select id
    from public.newsletter_email_outbox
    where attempts < 5
      and available_at <= now()
      and (status='pending' or (status='sending' and lease_until < now()))
    order by created_at
    limit least(greatest(batch_size,1),5)
    for update skip locked
  )
  update public.newsletter_email_outbox n
  set status='sending',
      attempts=n.attempts+1,
      lease_token=gen_random_uuid(),
      lease_until=now()+interval '10 minutes'
  from candidates c
  where n.id=c.id
  returning n.*;
$$;

revoke all on function public.claim_newsletter_emails(integer) from public,anon,authenticated;
grant execute on function public.claim_newsletter_emails(integer) to service_role;

commit;