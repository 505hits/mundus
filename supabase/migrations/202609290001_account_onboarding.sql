-- Apply to the existing Mundus database before enabling the account feature flags.
-- Does not replace the existing auth.users -> profiles creation trigger.
begin;

create table public.student_onboarding (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  language text not null check (language in ('Angličtina','Nemčina','Španielčina','Taliančina','Francúzština','Portugalčina','Ruština','Turečtina')),
  level text not null check (level in ('Neviem posúdiť','Úplný začiatočník','A1','A2','B1','B2','C1','C2')),
  goal text not null check (char_length(btrim(goal)) between 3 and 1000),
  completed_at timestamptz not null default now()
);
alter table public.student_onboarding enable row level security;
revoke all on public.student_onboarding from anon;
grant select, insert, update on public.student_onboarding to authenticated;
grant all on public.student_onboarding to service_role;
create policy student_onboarding_read on public.student_onboarding for select to authenticated
  using (student_id = auth.uid() or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin' and status = 'active'
  ));
create policy student_onboarding_insert on public.student_onboarding for insert to authenticated
  with check (student_id = auth.uid() and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'student' and status = 'active'
  ));
create policy student_onboarding_update on public.student_onboarding for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid() and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'student' and status = 'active'
  ));

-- User-supplied metadata is never authority for an account role or status.
-- Auth's existing trigger still supplies the other profile fields.
create function public.mundus_guard_profile_access() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    if coalesce(auth.role(), '') in ('anon', 'authenticated') then
      raise exception 'Profiles must be created by the account service';
    end if;
    NEW.role := 'student';
    NEW.status := 'active';
    return NEW;
  end if;
  if coalesce(auth.role(), '') <> 'service_role' then
    if TG_OP = 'DELETE' then
      raise exception 'Profiles must be deleted by the account service';
    end if;
    if NEW.id is distinct from OLD.id or NEW.role is distinct from OLD.role
       or NEW.status is distinct from OLD.status or NEW.email is distinct from OLD.email then
      raise exception 'Account access fields cannot be changed by a client';
    end if;
  end if;
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end;
$$;
revoke all on function public.mundus_guard_profile_access() from public;
create trigger zz_mundus_guard_profile_access before insert or update or delete on public.profiles
  for each row execute function public.mundus_guard_profile_access();

-- Atomic activation and invitation consumption, callable only by the server.
create function public.mundus_accept_teacher_invitation(invited_user_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  invited_user auth.users%rowtype;
begin
  select * into invited_user from auth.users where id = invited_user_id for update;
  if not found or invited_user.email_confirmed_at is null then
    raise exception 'Verified invitation required';
  end if;
  if coalesce(invited_user.raw_app_meta_data->>'mundus_invited_role', '') <> 'teacher'
     or (invited_user.raw_app_meta_data->>'mundus_invitation_accepted_at') is not null
     or coalesce((invited_user.raw_app_meta_data->>'mundus_invitation_expires_at')::timestamptz, '-infinity'::timestamptz) <= now() then
    raise exception 'Invitation is invalid, expired or already accepted';
  end if;
  update public.profiles set status = 'active'
    where id = invited_user_id and role = 'teacher' and status = 'pending';
  if not found then raise exception 'Pending teacher profile required'; end if;
  update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('mundus_invitation_accepted_at', now()) where id = invited_user_id;
end;
$$;
revoke all on function public.mundus_accept_teacher_invitation(uuid) from public, anon, authenticated;
grant execute on function public.mundus_accept_teacher_invitation(uuid) to service_role;

commit;
