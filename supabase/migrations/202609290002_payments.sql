-- Apply only after inspecting the current lesson_packages schema and triggers.
-- Existing packages/credits are not modified by this migration.
begin;

create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  package_lessons integer not null check (package_lessons in (1, 5, 10, 20, 30)),
  amount_cents integer not null check (amount_cents > 0),
  discount_percent integer not null check (discount_percent in (0, 10)),
  currency text not null default 'eur' check (currency = 'eur'),
  status text not null default 'pending' check (status in ('pending','paid','failed','expired','refund_review')),
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  lesson_package_id uuid unique references public.lesson_packages(id),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);
create unique index payment_orders_one_pending_per_student on public.payment_orders(student_id) where status = 'pending';
create index payment_orders_student_created on public.payment_orders(student_id, created_at desc);
alter table public.payment_orders enable row level security;
revoke all on public.payment_orders from anon, authenticated;
grant select on public.payment_orders to authenticated;
grant all on public.payment_orders to service_role;
create policy payment_orders_student_read on public.payment_orders for select to authenticated using (
  student_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active'
  )
);

-- Optional per-account override. A paid order always consumes the offer, even if
-- an administrator previously enabled it for a student with legacy packages.
create table public.payment_discount_settings (
  student_id uuid primary key references public.profiles(id),
  first_package_allowed boolean not null,
  updated_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now()
);
alter table public.payment_discount_settings enable row level security;
revoke all on public.payment_discount_settings from anon, authenticated;
grant select on public.payment_discount_settings to authenticated;
grant all on public.payment_discount_settings to service_role;
create policy payment_discount_settings_read on public.payment_discount_settings for select to authenticated using (
  student_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active'
  )
);

create function public.mundus_set_first_discount(buyer_id uuid, allowed boolean, admin_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.profiles where id = admin_id and role = 'admin' and status = 'active') then
    raise exception 'Active administrator required';
  end if;
  perform 1 from public.profiles where id = buyer_id and role = 'student' and status = 'active' for update;
  if not found then raise exception 'Active student required'; end if;
  if exists (select 1 from public.payment_orders where student_id = buyer_id and status in ('pending','paid','refund_review')) then
    raise exception 'Cannot change discount during or after purchase';
  end if;
  insert into public.payment_discount_settings(student_id, first_package_allowed, updated_by)
    values (buyer_id, allowed, admin_id)
    on conflict (student_id) do update set first_package_allowed = excluded.first_package_allowed,
      updated_by = excluded.updated_by, updated_at = now();
end;
$$;

-- RLS stays active, so this summary only sees records the caller may read.
create function public.mundus_payment_account_state(account_ids uuid[])
returns table (student_id uuid, has_paid boolean, has_package boolean, has_pending boolean, allowed boolean)
language sql stable security invoker set search_path = '' as $$
  select p.id,
    exists(select 1 from public.payment_orders o where o.student_id = p.id and o.status in ('paid','refund_review')),
    exists(select 1 from public.lesson_packages l where l.student_id = p.id),
    exists(select 1 from public.payment_orders o where o.student_id = p.id and o.status = 'pending'),
    (select s.first_package_allowed from public.payment_discount_settings s where s.student_id = p.id)
  from public.profiles p where p.id = any(account_ids) and p.role = 'student'
    and (auth.role() = 'service_role' or p.id = auth.uid() or exists (
      select 1 from public.profiles a where a.id = auth.uid() and a.role = 'admin' and a.status = 'active'
    ));
$$;
revoke all on function public.mundus_payment_account_state(uuid[]) from public, anon;
grant execute on function public.mundus_payment_account_state(uuid[]) to authenticated, service_role;

-- Trusted server only. Lock the student row to serialize first purchase checks and fulfillment.
create function public.mundus_reserve_payment_order(buyer_id uuid, lesson_count integer)
returns public.payment_orders language plpgsql security definer set search_path = '' as $$
declare base_amount integer; prior_purchase boolean; override_allowed boolean; created public.payment_orders;
begin
  select case lesson_count when 1 then 2800 when 5 then 13500 when 10 then 26000
    when 20 then 49000 when 30 then 70500 else null end into base_amount;
  if base_amount is null then raise exception 'Unknown package'; end if;
  perform 1 from public.profiles where id = buyer_id and role = 'student' and status = 'active' for update;
  if not found then raise exception 'Active student required'; end if;
  if exists (select 1 from public.payment_orders where student_id = buyer_id and status = 'pending') then
    raise exception 'An unfinished checkout already exists';
  end if;
  select exists (select 1 from public.payment_orders where student_id = buyer_id and status in ('paid','refund_review'))
    into prior_purchase;
  select first_package_allowed into override_allowed from public.payment_discount_settings where student_id = buyer_id;
  if override_allowed is null then
    prior_purchase := prior_purchase or exists (select 1 from public.lesson_packages where student_id = buyer_id);
  else
    prior_purchase := prior_purchase or not override_allowed;
  end if;
  insert into public.payment_orders(student_id, package_lessons, amount_cents, discount_percent)
    values (buyer_id, lesson_count, case when prior_purchase then base_amount else base_amount * 9 / 10 end,
      case when prior_purchase then 0 else 10 end)
    returning * into created;
  return created;
end;
$$;

create function public.mundus_attach_checkout_session(order_id uuid, session_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.payment_orders set stripe_session_id = session_id, updated_at = now()
    where id = order_id and status = 'pending' and stripe_session_id is null
      and session_id like 'cs_%';
  if not found then raise exception 'Order is unavailable for checkout'; end if;
end;
$$;

create function public.mundus_close_payment_order(order_id uuid, session_id text, new_status text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if new_status not in ('failed','expired') then raise exception 'Invalid order status'; end if;
  -- Webhook calls supply the known session; creation failures supply NULL before session attachment.
  update public.payment_orders set status = new_status, updated_at = now()
    where id = order_id and status = 'pending'
      and ((session_id is null and stripe_session_id is null)
        or (session_id is not null and stripe_session_id = session_id));
end;
$$;

create function public.mundus_fulfill_payment_order(order_id uuid, session_id text,
  payment_intent_id text, paid_amount integer, paid_currency text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare paid_order public.payment_orders; buyer uuid; new_package uuid;
begin
  select student_id into buyer from public.payment_orders where id = order_id;
  if not found then raise exception 'Order not found'; end if;
  perform 1 from public.profiles where id = buyer for update;
  select * into paid_order from public.payment_orders where id = order_id for update;
  if paid_order.stripe_session_id is distinct from session_id
    or paid_order.amount_cents is distinct from paid_amount
    or paid_order.currency is distinct from paid_currency
    or coalesce(payment_intent_id, '') = '' then
    raise exception 'Payment does not match the order';
  end if;
  if paid_order.status in ('paid', 'refund_review') then
    if paid_order.stripe_payment_intent_id is distinct from payment_intent_id then
      raise exception 'Another payment already fulfilled this order';
    end if;
    return paid_order.lesson_package_id;
  end if;
  if paid_order.status <> 'pending' then raise exception 'Order is closed'; end if;
  insert into public.lesson_packages(student_id, package_type, total_lessons,
    used_lessons, remaining_lessons, purchased_at, status)
    values (paid_order.student_id, paid_order.package_lessons::text || ' hodín',
      paid_order.package_lessons, 0, paid_order.package_lessons, now(), 'active')
    returning id into new_package;
  update public.payment_orders set status = 'paid', stripe_payment_intent_id = payment_intent_id,
    lesson_package_id = new_package, paid_at = now(), updated_at = now() where id = order_id;
  return new_package;
end;
$$;

-- Refunds require an administrator to decide how used/unused credits are handled.
create function public.mundus_flag_payment_refund(payment_intent_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.payment_orders set status = 'refund_review', updated_at = now()
    where stripe_payment_intent_id = payment_intent_id and status = 'paid';
end;
$$;

revoke all on function public.mundus_reserve_payment_order(uuid,integer) from public, anon, authenticated;
revoke all on function public.mundus_set_first_discount(uuid,boolean,uuid) from public, anon, authenticated;
revoke all on function public.mundus_attach_checkout_session(uuid,text) from public, anon, authenticated;
revoke all on function public.mundus_close_payment_order(uuid,text,text) from public, anon, authenticated;
revoke all on function public.mundus_fulfill_payment_order(uuid,text,text,integer,text) from public, anon, authenticated;
revoke all on function public.mundus_flag_payment_refund(text) from public, anon, authenticated;
grant execute on function public.mundus_reserve_payment_order(uuid,integer) to service_role;
grant execute on function public.mundus_set_first_discount(uuid,boolean,uuid) to service_role;
grant execute on function public.mundus_attach_checkout_session(uuid,text) to service_role;
grant execute on function public.mundus_close_payment_order(uuid,text,text) to service_role;
grant execute on function public.mundus_fulfill_payment_order(uuid,text,text,integer,text) to service_role;
grant execute on function public.mundus_flag_payment_refund(text) to service_role;
commit;
