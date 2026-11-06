begin;

-- Premium-short 45-minute pricing. 60-minute pricing is unchanged.
create or replace function public.mundus_package_base_amount(lesson_count integer, lesson_duration integer)
returns integer
language sql
immutable
set search_path=''
as $$
  select case
    when lesson_duration=60 then case lesson_count
      when 1 then 2800 when 5 then 13500 when 10 then 26000 when 20 then 49000 when 30 then 70500 end
    when lesson_duration=45 then case lesson_count
      when 1 then 2400 when 5 then 11500 when 10 then 22000 when 20 then 41500 when 30 then 59500 end
  end;
$$;

-- Permanent one-time discount claim ledger. This is intentionally separate from
-- payment orders so the "used once" fact survives order cleanup/history changes.
create table if not exists public.payment_discount_claims (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.profiles(id),
  payment_order_id uuid not null unique references public.payment_orders(id),
  discount_name_key text not null,
  discount_email_key text not null,
  claimed_at timestamptz not null default now()
);

alter table public.payment_discount_claims enable row level security;
revoke all on public.payment_discount_claims from public, anon, authenticated;
grant all on public.payment_discount_claims to service_role;

create unique index if not exists payment_discount_claim_name_unique
  on public.payment_discount_claims(discount_name_key);
create unique index if not exists payment_discount_claim_email_unique
  on public.payment_discount_claims(discount_email_key);

create or replace function public.mundus_prevent_discount_claim_mutation()
returns trigger
language plpgsql
set search_path=''
as $$
begin
  raise exception 'First-package discount claims are immutable';
end;
$$;
revoke all on function public.mundus_prevent_discount_claim_mutation() from public,anon,authenticated;

drop trigger if exists prevent_discount_claim_mutation on public.payment_discount_claims;
create trigger prevent_discount_claim_mutation
before update or delete on public.payment_discount_claims
for each row execute function public.mundus_prevent_discount_claim_mutation();

-- Backfill every already-paid discounted order. If historical duplicate claims
-- exist, this migration fails instead of silently legitimising two discounts.
insert into public.payment_discount_claims(
  student_id,payment_order_id,discount_name_key,discount_email_key,claimed_at
)
select
  o.student_id,o.id,o.discount_name_key,o.discount_email_key,coalesce(o.paid_at,o.updated_at,o.created_at)
from public.payment_orders o
where o.discount_percent=10
  and o.status in ('paid','refund_review')
  and o.discount_name_key is not null
  and o.discount_email_key is not null
  and not exists(select 1 from public.payment_discount_claims c where c.payment_order_id=o.id);

create or replace function public.mundus_first_discount_eligible(buyer_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path=''
as $$
declare
  buyer public.profiles;
  name_key text;
  email_key text;
  override_allowed boolean;
begin
  if coalesce(auth.role(),'') <> 'service_role'
    and buyer_id is distinct from auth.uid()
    and not exists(
      select 1 from public.profiles
      where id=auth.uid() and role='admin' and status='active'
    ) then
    return false;
  end if;

  select * into buyer
  from public.profiles
  where id=buyer_id and role='student' and status='active';

  if not found
    or public.mundus_discount_name(buyer.full_name) is null
    or nullif(trim(buyer.email),'') is null then
    return false;
  end if;

  name_key := md5(public.mundus_discount_name(buyer.full_name));
  email_key := md5(public.mundus_discount_email(buyer.email));

  -- Permanent successful claim always wins.
  if exists(
    select 1 from public.payment_discount_claims c
    where c.student_id=buyer_id
      or c.discount_name_key=name_key
      or c.discount_email_key=email_key
  ) then return false; end if;

  -- Active discounted checkout also blocks a second simultaneous checkout.
  if exists(
    select 1 from public.payment_orders o
    where (o.student_id=buyer_id or o.discount_name_key=name_key or o.discount_email_key=email_key)
      and o.status='pending'
      and o.discount_percent=10
  ) then return false; end if;

  -- Historical paid/refund records remain a second independent safeguard.
  if exists(
    select 1 from public.payment_orders o
    where (o.student_id=buyer_id or o.discount_name_key=name_key or o.discount_email_key=email_key)
      and o.status in ('paid','refund_review')
      and o.discount_percent=10
  ) then return false; end if;

  select first_package_allowed into override_allowed
  from public.payment_discount_settings where student_id=buyer_id;

  if override_allowed is not null then return override_allowed; end if;

  return not exists(
    select 1
    from public.lesson_packages l
    join public.profiles p on p.id=l.student_id
    where p.id=buyer_id
       or md5(public.mundus_discount_name(p.full_name))=name_key
       or md5(public.mundus_discount_email(p.email))=email_key
  );
end;
$$;

create or replace function public.mundus_fulfill_payment_order(
  order_id uuid,
  session_id text,
  payment_intent_id text,
  paid_amount integer,
  paid_currency text
)
returns uuid
language plpgsql
security definer
set search_path=''
as $$
declare
  paid_order public.payment_orders;
  buyer uuid;
  new_package uuid;
begin
  select student_id into buyer from public.payment_orders where id=order_id;
  if not found then raise exception 'Order not found'; end if;

  perform 1 from public.profiles where id=buyer for update;
  select * into paid_order from public.payment_orders where id=order_id for update;

  if paid_order.stripe_session_id is distinct from session_id
    or paid_order.amount_cents is distinct from paid_amount
    or paid_order.currency is distinct from paid_currency
    or coalesce(payment_intent_id,'')='' then
    raise exception 'Payment does not match the order';
  end if;

  if paid_order.status in ('paid','refund_review') then
    if paid_order.stripe_payment_intent_id is distinct from payment_intent_id then
      raise exception 'Another payment already fulfilled this order';
    end if;
    return paid_order.lesson_package_id;
  end if;

  if paid_order.status<>'pending' then raise exception 'Order is closed'; end if;

  -- Successful discounted payment atomically consumes the offer forever.
  -- Unique constraints independently protect account, normalized name and email.
  if paid_order.discount_percent=10 then
    insert into public.payment_discount_claims(
      student_id,payment_order_id,discount_name_key,discount_email_key,claimed_at
    ) values(
      paid_order.student_id,
      paid_order.id,
      paid_order.discount_name_key,
      paid_order.discount_email_key,
      now()
    );
  end if;

  insert into public.lesson_packages(
    student_id,package_type,total_lessons,used_lessons,remaining_lessons,purchased_at,status,duration_minutes
  )
  values(
    paid_order.student_id,
    paid_order.package_lessons::text || ' hodín · ' || paid_order.duration_minutes::text || ' min',
    paid_order.package_lessons,0,paid_order.package_lessons,now(),'active',paid_order.duration_minutes
  )
  returning id into new_package;

  update public.payment_orders
  set status='paid',
      stripe_payment_intent_id=payment_intent_id,
      lesson_package_id=new_package,
      paid_at=now(),
      updated_at=now()
  where id=order_id;

  return new_package;
end;
$$;

-- The claim ledger is server-only.
revoke all on function public.mundus_first_discount_eligible(uuid) from public,anon;
grant execute on function public.mundus_first_discount_eligible(uuid) to authenticated,service_role;

commit;
