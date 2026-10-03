begin;
create table public.notification_outbox (
 id uuid primary key default gen_random_uuid(), request_id uuid not null references public.schedule_change_requests(id),
 recipient_id uuid not null references public.profiles(id), recipient_email text not null,
 event text not null check(event in ('pending','accepted','declined')), preferred_at timestamptz not null,
 status text not null default 'pending' check(status in ('pending','sending','sent','failed')),
 attempts integer not null default 0, available_at timestamptz not null default now(),
 lease_token uuid, lease_until timestamptz, sent_at timestamptz, created_at timestamptz not null default now(),
 unique(request_id,recipient_id,event)
);
alter table public.notification_outbox enable row level security;
revoke all on public.notification_outbox from anon,authenticated;
grant all on public.notification_outbox to service_role;
create function public.queue_schedule_email() returns trigger language plpgsql security definer set search_path='' as $$
declare teacher uuid;
begin
 if TG_OP='UPDATE' and new.status is not distinct from old.status then return new; end if;
 if new.status not in ('pending','accepted','declined') then return new; end if;
 select teacher_id into teacher from public.lessons where id=new.lesson_id;
 insert into public.notification_outbox(request_id,recipient_id,recipient_email,event,preferred_at)
 select new.id,p.id,p.email,new.status,new.preferred_at from public.profiles p join auth.users u on u.id=p.id
 where p.id in (teacher,new.student_id) and p.status='active' and u.email_confirmed_at is not null and p.email is not null
 on conflict(request_id,recipient_id,event) do nothing;
 return new;
end;
$$;
revoke all on function public.queue_schedule_email() from public;
create trigger schedule_email_created after insert on public.schedule_change_requests for each row execute function public.queue_schedule_email();
create trigger schedule_email_answered after update of status on public.schedule_change_requests for each row execute function public.queue_schedule_email();
create function public.claim_schedule_emails(batch_size integer default 2) returns setof public.notification_outbox
language sql security definer set search_path='' as $$
 with exhausted as (update public.notification_outbox set status='failed',lease_until=null where status='sending' and attempts>=5 and lease_until<now() returning id), candidates as (
 select id from public.notification_outbox where attempts<5 and available_at<=now()
 and (status='pending' or (status='sending' and lease_until<now()))
 order by created_at limit least(greatest(batch_size,1),2) for update skip locked
 ) update public.notification_outbox n set status='sending',attempts=n.attempts+1,lease_token=gen_random_uuid(),lease_until=now()+interval '10 minutes'
 from candidates c where n.id=c.id returning n.*;
$$;
revoke all on function public.claim_schedule_emails(integer) from public,anon,authenticated;
grant execute on function public.claim_schedule_emails(integer) to service_role;
commit;
