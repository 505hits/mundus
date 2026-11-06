begin;

alter table public.payment_orders
  add column if not exists duration_minutes integer not null default 60
  check (duration_minutes in (45,60));

alter table public.lesson_packages
  add column if not exists duration_minutes integer not null default 60
  check (duration_minutes in (45,60));

create or replace function public.mundus_package_base_amount(lesson_count integer, lesson_duration integer)
returns integer
language sql
immutable
set search_path=''
as $$
  select case
    when lesson_duration=60 then case lesson_count
      when 1 then 2800 when 5 then 13500 when 10 then 26000 when 20 then 49000 when 30 then 70500 end
    when lesson_duration=45 then round((case lesson_count
      when 1 then 2800 when 5 then 13500 when 10 then 26000 when 20 then 49000 when 30 then 70500 end) * 0.75)::integer
  end;
$$;

create or replace function public.mundus_discounted_amount(base_amount integer)
returns integer
language sql
immutable
set search_path=''
as $$ select round(base_amount * 0.90)::integer; $$;

create or replace function public.mundus_reserve_payment_order(buyer_id uuid, lesson_count integer, lesson_duration integer)
returns public.payment_orders
language plpgsql
security definer
set search_path=''
as $$
declare
  base_amount integer;
  prior_purchase boolean;
  override_allowed boolean;
  created public.payment_orders;
begin
  select public.mundus_package_base_amount(lesson_count,lesson_duration) into base_amount;
  if base_amount is null then raise exception 'Unknown package'; end if;

  perform 1 from public.profiles where id=buyer_id and role='student' and status='active' for update;
  if not found then raise exception 'Active student required'; end if;

  if exists(select 1 from public.payment_orders where student_id=buyer_id and status='pending') then
    raise exception 'An unfinished checkout already exists';
  end if;

  select exists(select 1 from public.payment_orders where student_id=buyer_id and status in ('paid','refund_review'))
    into prior_purchase;

  select first_package_allowed into override_allowed
  from public.payment_discount_settings where student_id=buyer_id;

  if override_allowed is null then
    prior_purchase := prior_purchase or exists(select 1 from public.lesson_packages where student_id=buyer_id);
  else
    prior_purchase := prior_purchase or not override_allowed;
  end if;

  insert into public.payment_orders(student_id,package_lessons,duration_minutes,amount_cents,discount_percent)
  values(
    buyer_id,
    lesson_count,
    lesson_duration,
    case when prior_purchase then base_amount else public.mundus_discounted_amount(base_amount) end,
    case when prior_purchase then 0 else 10 end
  )
  returning * into created;

  return created;
end;
$$;

create or replace function public.mundus_reserve_payment_order(buyer_id uuid, lesson_count integer)
returns public.payment_orders
language sql
security definer
set search_path=''
as $$ select * from public.mundus_reserve_payment_order(buyer_id,lesson_count,60); $$;

create or replace function public.mundus_guard_discount_identity()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  buyer public.profiles;
  base_amount integer;
begin
  if TG_OP='UPDATE' then
    if new.student_id is distinct from old.student_id
      or new.discount_name_key is distinct from old.discount_name_key
      or new.discount_email_key is distinct from old.discount_email_key
      or new.discount_percent is distinct from old.discount_percent
      or new.package_lessons is distinct from old.package_lessons
      or new.duration_minutes is distinct from old.duration_minutes
      or new.amount_cents is distinct from old.amount_cents then
      raise exception 'Payment identity and price are immutable';
    end if;
    return new;
  end if;

  select * into buyer from public.profiles where id=new.student_id;
  new.discount_name_key := md5(public.mundus_discount_name(buyer.full_name));
  new.discount_email_key := md5(public.mundus_discount_email(buyer.email));
  base_amount := public.mundus_package_base_amount(new.package_lessons,new.duration_minutes);
  if base_amount is null then raise exception 'Unknown package'; end if;

  if new.discount_percent=10 and not public.mundus_first_discount_eligible(new.student_id) then
    new.discount_percent := 0;
    new.amount_cents := base_amount;
  elsif new.discount_percent=10 then
    new.amount_cents := public.mundus_discounted_amount(base_amount);
  else
    new.amount_cents := base_amount;
  end if;
  return new;
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

revoke all on function public.mundus_package_base_amount(integer,integer) from public,anon,authenticated;
revoke all on function public.mundus_discounted_amount(integer) from public,anon,authenticated;
revoke all on function public.mundus_reserve_payment_order(uuid,integer,integer) from public,anon,authenticated;
revoke all on function public.mundus_reserve_payment_order(uuid,integer) from public,anon,authenticated;
grant execute on function public.mundus_package_base_amount(integer,integer) to service_role;
grant execute on function public.mundus_discounted_amount(integer) to service_role;
grant execute on function public.mundus_reserve_payment_order(uuid,integer,integer) to service_role;
grant execute on function public.mundus_reserve_payment_order(uuid,integer) to service_role;

commit;
