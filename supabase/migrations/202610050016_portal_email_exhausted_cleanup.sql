begin;

create or replace function public.claim_portal_emails(batch_size integer default 5)
returns setof public.portal_email_outbox
language sql
security definer
set search_path=''
as $$
  with exhausted as (
    update public.portal_email_outbox
    set status='failed', lease_until=null
    where status='sending'
      and attempts>=5
      and lease_until<now()
    returning id
  ),
  candidates as (
    select id
    from public.portal_email_outbox
    where attempts<5
      and available_at<=now()
      and (status='pending' or (status='sending' and lease_until<now()))
    order by created_at
    limit least(greatest(batch_size,1),5)
    for update skip locked
  )
  update public.portal_email_outbox n
  set status='sending',
      attempts=n.attempts+1,
      lease_token=gen_random_uuid(),
      lease_until=now()+interval '10 minutes'
  from candidates c
  where n.id=c.id
  returning n.*;
$$;

commit;
