-- Base schema for a NEW Mundus database only.
-- Applied before the existing migrations by build-empty-database-install.mjs.
-- Never run this against the older populated Mundus database.
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind in ('r','p')) then
    raise exception 'Installation stopped: public schema is not empty. Use the existing-database migration workflow.';
  end if;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student','teacher','admin')),
  status text not null default 'active' check (status in ('active','inactive','pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_packages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  package_type text not null,
  total_lessons integer not null check (total_lessons > 0),
  used_lessons integer not null default 0 check (used_lessons >= 0),
  remaining_lessons integer not null check (remaining_lessons >= 0),
  purchased_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (used_lessons + remaining_lessons = total_lessons)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  teacher_id uuid not null references public.profiles(id),
  package_id uuid references public.lesson_packages(id),
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 180),
  status text not null default 'scheduled' check (status in
    ('scheduled','rescheduled','completed','student_no_show','student_cancelled','late_cancellation','teacher_cancelled')),
  language text not null,
  lesson_type text not null default 'regular',
  meet_link text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_reports (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id),
  student_id uuid not null references public.profiles(id),
  teacher_id uuid not null references public.profiles(id),
  topic text, progress text, student_note text, homework text, next_focus text, private_teacher_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedule_change_requests (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id),
  student_id uuid not null references public.profiles(id),
  requested_by uuid not null references public.profiles(id),
  preferred_at timestamptz not null,
  alternative_at timestamptz,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Deny access until the later migrations install the final role/ownership policies.
alter table public.profiles enable row level security;
alter table public.lesson_packages enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_reports enable row level security;
alter table public.schedule_change_requests enable row level security;
revoke all on public.profiles, public.lesson_packages, public.lessons,
  public.lesson_reports, public.schedule_change_requests from public, anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.lesson_packages, public.lessons,
  public.lesson_reports, public.schedule_change_requests to authenticated;
grant all on public.profiles, public.lesson_packages, public.lessons,
  public.lesson_reports, public.schedule_change_requests to service_role;

-- The existing migrations install SELECT/admin policies; retain own-name updates.
create policy "Users can update own profile" on public.profiles for update to authenticated
using (id=(select auth.uid())) with check (id=(select auth.uid()));

-- Existing completion RPC verifies this single accounting trigger consumes exactly one credit.
create function public.mundus_account_lesson_credit() returns trigger
language plpgsql security definer set search_path='' as $$
declare changed integer;
begin
  if TG_OP='DELETE' then
    if old.status='completed' then raise exception 'Completed lesson history cannot be deleted'; end if;
    return old;
  end if;
  if TG_OP='UPDATE' and old.status='completed' then
    if new.status is distinct from old.status or new.package_id is distinct from old.package_id
      or new.student_id is distinct from old.student_id then
      raise exception 'Completed lesson accounting cannot be reassigned or reopened';
    end if;
    return new;
  end if;
  if new.status='completed' then
    if new.scheduled_at > now() then raise exception 'Only elapsed lessons can consume credit'; end if;
    update public.lesson_packages
      set used_lessons=used_lessons+1, remaining_lessons=remaining_lessons-1,
          status=case when remaining_lessons=1 then 'completed' else 'active' end,
          updated_at=now()
      where id=new.package_id and student_id=new.student_id and status='active' and remaining_lessons>0;
    get diagnostics changed=row_count;
    if changed<>1 then raise exception 'An active student package with a remaining credit is required'; end if;
  end if;
  return new;
end $$;
revoke all on function public.mundus_account_lesson_credit() from public, anon, authenticated;
create trigger lesson_package_usage_trigger after insert or update or delete on public.lessons
for each row execute function public.mundus_account_lesson_credit();

create function public.mundus_create_auth_profile() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,email,full_name,role,status)
  values(new.id,new.email,left(coalesce(new.raw_user_meta_data->>'full_name',''),200),'student','active');
  return new;
end $$;
revoke all on function public.mundus_create_auth_profile() from public, anon, authenticated;
create trigger mundus_auth_profile_created after insert on auth.users
for each row execute function public.mundus_create_auth_profile();

-- Only Auth identities are carried over; never infer privileges from user-editable metadata.
insert into public.profiles(id,email,full_name,role,status)
select id,email,left(coalesce(raw_user_meta_data->>'full_name',''),200),'student','active'
from auth.users;
