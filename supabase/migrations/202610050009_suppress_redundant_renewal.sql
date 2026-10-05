begin;

create or replace function public.queue_package_renewal_emails()
returns trigger language plpgsql security definer set search_path='' as $$
declare
  has_continuation boolean;
begin
  if new.remaining_lessons is null or old.remaining_lessons is null then return new; end if;

  select exists (
    select 1 from public.lesson_packages newer
    where newer.student_id=new.student_id
      and newer.id<>new.id
      and newer.status='active'
      and coalesce(newer.remaining_lessons,0)>0
      and coalesce(newer.purchased_at,'epoch'::timestamptz)>coalesce(new.purchased_at,'epoch'::timestamptz)
  ) into has_continuation;

  if not has_continuation and new.remaining_lessons<=2 and old.remaining_lessons>2 then
    insert into public.portal_email_outbox(recipient_id,recipient_email,kind,student_id,package_id)
    select p.id,p.email,'admin_renewal',new.student_id,new.id
    from public.profiles p join auth.users u on u.id=p.id
    where p.role='admin' and p.status='active' and p.email is not null and u.email_confirmed_at is not null
    on conflict(kind,recipient_id,package_id) do nothing;
  end if;

  if not has_continuation and new.total_lessons=5 and new.used_lessons>=4 and new.remaining_lessons<=1 and old.remaining_lessons>1 then
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

commit;
