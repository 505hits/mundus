begin;
create table if not exists public.teacher_preferences (
 teacher_id uuid primary key references public.profiles(id),
 accepting_students boolean not null default false,
 languages text[] not null default '{}' check(languages <@ array['English','German','Spanish','Italian','French','Portuguese','Russian','Turkish']::text[]),
 levels text[] not null default '{}' check(levels <@ array['A1','A2','B1','B2','C1','C2']::text[]),
 days text[] not null default '{}' check(days <@ array['1','2','3','4','5','6','7']::text[]),
 time_from time,
 time_to time,
 max_new_students integer not null default 0 check(max_new_students between 0 and 20),
 note text not null default '' check(length(note)<=1000),
 updated_at timestamptz not null default clock_timestamp(),
 check((time_from is null and time_to is null) or (time_from is not null and time_to is not null and time_from<time_to)),
 check(not accepting_students or (cardinality(languages)>0 and cardinality(levels)>0 and max_new_students>0))
);
create or replace function public.mundus_matching_role(role_name text) returns boolean language sql stable security definer set search_path='' as $$
select exists(select 1 from public.profiles p join auth.users u on u.id=p.id where p.id=auth.uid() and p.role=role_name and p.status='active' and u.email_confirmed_at is not null);
$$;
revoke all on function public.mundus_matching_role(text) from public,anon;
grant execute on function public.mundus_matching_role(text) to authenticated;
alter table public.teacher_preferences enable row level security;
revoke all on public.teacher_preferences from anon,authenticated;
grant select,insert,update on public.teacher_preferences to authenticated;
drop policy if exists teacher_preferences_read on public.teacher_preferences;
create policy teacher_preferences_read on public.teacher_preferences for select to authenticated using(public.mundus_matching_role('admin') or (teacher_id=auth.uid() and public.mundus_matching_role('teacher')));
drop policy if exists teacher_preferences_insert on public.teacher_preferences;
create policy teacher_preferences_insert on public.teacher_preferences for insert to authenticated with check(teacher_id=auth.uid() and public.mundus_matching_role('teacher'));
drop policy if exists teacher_preferences_update on public.teacher_preferences;
create policy teacher_preferences_update on public.teacher_preferences for update to authenticated using(teacher_id=auth.uid() and public.mundus_matching_role('teacher')) with check(teacher_id=auth.uid() and public.mundus_matching_role('teacher'));
create or replace function public.guard_teacher_preferences() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.profiles where id=new.teacher_id and role='teacher') then raise exception 'Teacher required';end if;
 if tg_op='UPDATE' and new.teacher_id<>old.teacher_id then raise exception 'Teacher cannot change';end if;
 new.updated_at=clock_timestamp();return new;
end;$$;
revoke all on function public.guard_teacher_preferences() from public,anon,authenticated;
drop trigger if exists guard_teacher_preferences on public.teacher_preferences;
create trigger guard_teacher_preferences before insert or update on public.teacher_preferences for each row execute function public.guard_teacher_preferences();
commit;
