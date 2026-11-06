begin;

-- Public group lesson requests extend the existing contact pipeline.
alter table public.contact_requests
  add column if not exists request_type text not null default 'individual'
    check (request_type in ('individual','group')),
  add column if not exists group_size smallint
    check (group_size is null or group_size between 2 and 20);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  billing_email text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.companies enable row level security;
revoke all on public.companies from anon, authenticated;
grant all on public.companies to service_role;

create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  member_role text not null default 'manager' check (member_role in ('manager','viewer')),
  created_at timestamptz not null default now(),
  primary key(company_id,profile_id)
);
alter table public.company_members enable row level security;
revoke all on public.company_members from anon, authenticated;
grant all on public.company_members to service_role;

create table if not exists public.company_employees (
  company_id uuid not null references public.companies(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key(company_id,student_id)
);
alter table public.company_employees enable row level security;
revoke all on public.company_employees from anon, authenticated;
grant all on public.company_employees to service_role;
create index if not exists company_employees_student_idx on public.company_employees(student_id);

create table if not exists public.company_quote_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(trim(company_name)) between 2 and 160),
  contact_name text not null check (char_length(trim(contact_name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 5 and 254),
  phone text,
  employee_count integer check (employee_count is null or employee_count between 1 and 100000),
  languages text,
  message text not null default '' check (char_length(message) <= 3000),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.company_quote_requests enable row level security;
revoke all on public.company_quote_requests from anon, authenticated;
grant all on public.company_quote_requests to service_role;
create index if not exists company_quote_requests_status_created_idx
  on public.company_quote_requests(status,created_at desc);

create or replace function public.mundus_accept_company_invitation(invited_user_id uuid)
returns void
language plpgsql
security definer
set search_path=''
as $$
declare invited_user auth.users%rowtype;
begin
  select * into invited_user from auth.users where id=invited_user_id for update;
  if not found or invited_user.email_confirmed_at is null then raise exception 'Verified invitation required'; end if;
  if coalesce(invited_user.raw_app_meta_data->>'mundus_invited_role','') <> 'company'
    or (invited_user.raw_app_meta_data->>'mundus_invitation_accepted_at') is not null
    or coalesce((invited_user.raw_app_meta_data->>'mundus_invitation_expires_at')::timestamptz,'-infinity'::timestamptz) <= now()
  then raise exception 'Invitation is invalid, expired or already accepted'; end if;
  update public.profiles set status='active'
    where id=invited_user_id and role='company' and status='pending';
  if not found then raise exception 'Pending company profile required'; end if;
  update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}'::jsonb)
    || jsonb_build_object('mundus_invitation_accepted_at',now())
  where id=invited_user_id;
end;
$$;
revoke all on function public.mundus_accept_company_invitation(uuid) from public,anon,authenticated;
grant execute on function public.mundus_accept_company_invitation(uuid) to service_role;

create or replace function public.company_employee_overview()
returns table(
  student_id uuid,
  full_name text,
  email text,
  language text,
  total_purchased bigint,
  remaining_lessons bigint,
  completed_lessons bigint,
  next_lesson_at timestamptz,
  last_lesson_at timestamptz
)
language sql
stable
security definer
set search_path=''
as $$
  with my_companies as (
    select cm.company_id
    from public.company_members cm
    join public.profiles p on p.id=cm.profile_id
    join auth.users u on u.id=p.id
    where cm.profile_id=auth.uid()
      and p.role='company' and p.status='active'
      and u.email_confirmed_at is not null
  ),
  linked as (
    select distinct ce.student_id
    from public.company_employees ce
    join my_companies mc on mc.company_id=ce.company_id
    where ce.active
  )
  select
    p.id,
    p.full_name,
    p.email,
    so.language,
    coalesce((select sum(lp.total_lessons)::bigint from public.lesson_packages lp where lp.student_id=p.id),0),
    coalesce((select sum(lp.remaining_lessons)::bigint from public.lesson_packages lp where lp.student_id=p.id and lp.status='active'),0),
    coalesce((select count(*)::bigint from public.lessons l where l.student_id=p.id and l.status='completed'),0),
    (select min(l.scheduled_at) from public.lessons l where l.student_id=p.id and l.status in ('scheduled','rescheduled') and l.scheduled_at>=now()),
    (select max(l.scheduled_at) from public.lessons l where l.student_id=p.id and l.status='completed')
  from linked x
  join public.profiles p on p.id=x.student_id and p.role='student' and p.status='active'
  left join public.student_onboarding so on so.student_id=p.id
  order by coalesce(p.full_name,p.email);
$$;
revoke all on function public.company_employee_overview() from public,anon;
grant execute on function public.company_employee_overview() to authenticated,service_role;

create or replace function public.mundus_active_portal_account()
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select exists (
    select 1 from public.profiles p join auth.users u on u.id=p.id
    where p.id=auth.uid() and p.status='active'
      and p.role in ('student','teacher','admin','company')
      and u.email_confirmed_at is not null
  );
$$;

commit;