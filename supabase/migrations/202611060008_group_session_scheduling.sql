begin;

create table if not exists public.group_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id),
  scheduled_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes in (45,60)),
  language text not null,
  meet_link text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.group_sessions enable row level security;
revoke all on public.group_sessions from anon,authenticated;
grant all on public.group_sessions to service_role;

alter table public.lessons add column if not exists group_session_id uuid references public.group_sessions(id) on delete set null;
create index if not exists lessons_group_session_id_idx on public.lessons(group_session_id);

create or replace function public.mundus_create_group_session(
  target_teacher_id uuid,
  target_student_ids uuid[],
  target_scheduled_at timestamptz,
  target_duration_minutes integer,
  target_language text,
  target_meet_link text
)
returns uuid
language plpgsql
security definer
set search_path=''
as $$
declare
  session_id uuid;
  sid uuid;
  package_id uuid;
begin
  if not public.is_active_admin() then raise exception 'Active administrator required'; end if;
  if target_scheduled_at is null or target_scheduled_at <= now() then raise exception 'Future schedule required'; end if;
  if target_duration_minutes not in (45,60) then raise exception 'Unsupported lesson duration'; end if;
  if nullif(trim(target_language),'') is null then raise exception 'Language required'; end if;
  if coalesce(array_length(target_student_ids,1),0) < 2 or coalesce(array_length(target_student_ids,1),0) > 5 then raise exception 'Group size must be 2 to 5'; end if;
  if (select count(distinct x) from unnest(target_student_ids) x) <> array_length(target_student_ids,1) then raise exception 'Duplicate students are not allowed'; end if;
  if not exists(select 1 from public.profiles where id=target_teacher_id and role='teacher' and status='active') then raise exception 'Active teacher required'; end if;

  insert into public.group_sessions(teacher_id,scheduled_at,duration_minutes,language,meet_link,created_by)
  values(target_teacher_id,target_scheduled_at,target_duration_minutes,target_language,nullif(trim(target_meet_link),''),auth.uid())
  returning id into session_id;

  foreach sid in array target_student_ids loop
    if not exists(select 1 from public.profiles where id=sid and role='student' and status='active') then
      raise exception 'Every group member must be an active student';
    end if;

    select lp.id into package_id
    from public.lesson_packages lp
    where lp.student_id=sid and lp.status='active' and lp.remaining_lessons>0
      and coalesce(lp.duration_minutes,60)=target_duration_minutes
    order by lp.purchased_at nulls last,lp.id
    limit 1
    for update;

    if package_id is null then raise exception 'Every group member needs an active package matching the group duration'; end if;

    insert into public.lessons(
      student_id,teacher_id,package_id,scheduled_at,duration_minutes,status,lesson_type,meet_link,language,updated_at,group_session_id
    ) values(
      sid,target_teacher_id,package_id,target_scheduled_at,target_duration_minutes,'scheduled','group',nullif(trim(target_meet_link),''),target_language,now(),session_id
    );
  end loop;

  return session_id;
end;
$$;
revoke all on function public.mundus_create_group_session(uuid,uuid[],timestamptz,integer,text,text) from public,anon;
grant execute on function public.mundus_create_group_session(uuid,uuid[],timestamptz,integer,text,text) to authenticated,service_role;

commit;