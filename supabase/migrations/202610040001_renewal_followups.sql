begin;
create table if not exists public.renewal_followups (
 student_id uuid primary key references public.profiles(id),
 status text not null check(status in ('to_contact','contacted','waiting','later','closed')),
 last_contact date,
 next_followup date,
 note text not null default '' check(length(note)<=2000),
 updated_by uuid not null references public.profiles(id),
 updated_at timestamptz not null default clock_timestamp()
);
alter table public.renewal_followups enable row level security;
revoke all on public.renewal_followups from anon,authenticated;
grant select,insert,update on public.renewal_followups to authenticated;
create or replace function public.mundus_followup_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles p join auth.users u on u.id=p.id where p.id=auth.uid() and p.role='admin' and p.status='active' and u.email_confirmed_at is not null) $$;
revoke all on function public.mundus_followup_admin() from public,anon;
grant execute on function public.mundus_followup_admin() to authenticated;
drop policy if exists renewal_followups_admin on public.renewal_followups;
create policy renewal_followups_admin on public.renewal_followups for all to authenticated
 using(public.mundus_followup_admin())
 with check(public.mundus_followup_admin());
create or replace function public.guard_renewal_followup() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.profiles where id=new.student_id and role='student') then raise exception 'Student required'; end if;
 if tg_op='UPDATE' and new.student_id<>old.student_id then raise exception 'Student cannot change'; end if;
 new.updated_by=auth.uid(); new.updated_at=clock_timestamp(); return new;
end; $$;
revoke all on function public.guard_renewal_followup() from public,anon,authenticated;
drop trigger if exists guard_renewal_followup on public.renewal_followups;
create trigger guard_renewal_followup before insert or update on public.renewal_followups for each row execute function public.guard_renewal_followup();
commit;
