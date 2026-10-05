begin;
alter table public.notification_outbox drop constraint notification_outbox_status_check;
alter table public.notification_outbox add constraint notification_outbox_status_check check(status in ('pending','sending','sent','failed','skipped'));
create function public.retry_schedule_email(job_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.notification_outbox n set status='pending',attempts=0,available_at=now(),lease_token=null,lease_until=null
 where n.id=job_id and n.status='failed' and n.sent_at is null
 and exists(select 1 from public.schedule_change_requests r join public.lessons l on l.id=r.lesson_id
   join public.profiles p on p.id=n.recipient_id join auth.users u on u.id=p.id
   where r.id=n.request_id and r.status=n.event and r.preferred_at=n.preferred_at
   and p.id in (r.student_id,l.teacher_id) and p.status='active' and p.email=n.recipient_email and u.email_confirmed_at is not null);
 return found;
end;
$$;
revoke all on function public.retry_schedule_email(uuid) from public,anon,authenticated;
grant execute on function public.retry_schedule_email(uuid) to service_role;
commit;
