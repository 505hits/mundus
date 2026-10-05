-- Apply after account onboarding and payments. Existing package balances are unchanged.
begin;

create function public.mundus_discount_name(value text) returns text
language sql immutable set search_path = '' as $$
  select nullif(regexp_replace(translate(lower(coalesce(value,'')),
    'áäčďéěíĺľňóôöřŕšťúůüýž', 'aacdeeillnooorrstuuuyz'), '[^[:alnum:]]', '', 'g'), '');
$$;
create function public.mundus_discount_email(value text) returns text
language sql immutable set search_path = '' as $$
  select case when split_part(lower(trim(value)), '@', 2) in ('gmail.com','googlemail.com')
    then replace(split_part(split_part(lower(trim(value)), '@', 1), '+', 1), '.', '') || '@gmail.com'
    else lower(trim(value)) end;
$$;

alter table public.payment_orders add column discount_name_key text;
alter table public.payment_orders add column discount_email_key text;
-- Preserve a snapshot so subsequent profile edits cannot reset the offer.
update public.payment_orders o set
  discount_name_key = md5(public.mundus_discount_name(p.full_name)),
  discount_email_key = md5(public.mundus_discount_email(p.email))
from public.profiles p where p.id = o.student_id;

create function public.mundus_first_discount_eligible(buyer_id uuid) returns boolean
language plpgsql stable security definer set search_path = '' as $$
declare buyer public.profiles; name_key text; email_key text; override_allowed boolean;
begin
  if coalesce(auth.role(), '') <> 'service_role' and buyer_id is distinct from auth.uid()
    and not exists(select 1 from public.profiles where id=auth.uid() and role='admin' and status='active') then
    return false;
  end if;
  select * into buyer from public.profiles where id=buyer_id and role='student' and status='active';
  if not found or public.mundus_discount_name(buyer.full_name) is null or nullif(trim(buyer.email),'') is null then return false; end if;
  name_key := md5(public.mundus_discount_name(buyer.full_name));
  email_key := md5(public.mundus_discount_email(buyer.email));
  if exists(select 1 from public.payment_orders o where
    (o.student_id=buyer_id or o.discount_name_key=name_key or o.discount_email_key=email_key)
    and (o.status in ('paid','refund_review') or (o.status='pending' and o.discount_percent=10))) then return false; end if;
  select first_package_allowed into override_allowed from public.payment_discount_settings where student_id=buyer_id;
  if override_allowed is not null then return override_allowed; end if;
  return not exists(select 1 from public.lesson_packages l join public.profiles p on p.id=l.student_id
    where p.id=buyer_id or md5(public.mundus_discount_name(p.full_name))=name_key
      or md5(public.mundus_discount_email(p.email))=email_key);
end;
$$;
revoke all on function public.mundus_first_discount_eligible(uuid) from public, anon;
grant execute on function public.mundus_first_discount_eligible(uuid) to authenticated, service_role;

create function public.mundus_guard_discount_identity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare buyer public.profiles;
begin
  if TG_OP='UPDATE' then
    if new.student_id is distinct from old.student_id
      or new.discount_name_key is distinct from old.discount_name_key
      or new.discount_email_key is distinct from old.discount_email_key
      or new.discount_percent is distinct from old.discount_percent
      or new.package_lessons is distinct from old.package_lessons
      or new.amount_cents is distinct from old.amount_cents then
      raise exception 'Payment identity and price are immutable';
    end if;
    return new;
  end if;
  select * into buyer from public.profiles where id=new.student_id;
  new.discount_name_key := md5(public.mundus_discount_name(buyer.full_name));
  new.discount_email_key := md5(public.mundus_discount_email(buyer.email));
  if new.discount_percent=10 and not public.mundus_first_discount_eligible(new.student_id) then
    new.discount_percent := 0;
    new.amount_cents := case new.package_lessons when 1 then 2800 when 5 then 13500
      when 10 then 26000 when 20 then 49000 when 30 then 70500 end;
  end if;
  return new;
end;
$$;
revoke all on function public.mundus_guard_discount_identity() from public;
create trigger guard_discount_identity before insert or update on public.payment_orders
for each row execute function public.mundus_guard_discount_identity();
-- Unique active reservations also stop two simultaneous accounts claiming the offer.
create unique index payment_discount_pending_name on public.payment_orders(discount_name_key)
  where status='pending' and discount_percent=10;
create unique index payment_discount_pending_email on public.payment_orders(discount_email_key)
  where status='pending' and discount_percent=10;
commit;
