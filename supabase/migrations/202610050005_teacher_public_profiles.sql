begin;

create table if not exists public.teacher_public_profiles (
  teacher_id uuid primary key references public.profiles(id) on delete cascade,
  headline text not null default '' check (char_length(headline) <= 120),
  bio text not null default '' check (char_length(bio) <= 1000),
  languages text[] not null default '{}' check (languages <@ array['English','German','Spanish','Italian','French','Portuguese','Hungarian','Polish','Russian','Chinese','Slovak','Ukrainian','Modern Hebrew']::text[]),
  photo_path text check (photo_path is null or char_length(photo_path) <= 300),
  website_visible boolean not null default true,
  updated_at timestamptz not null default clock_timestamp()
);

alter table public.teacher_public_profiles enable row level security;
revoke all on public.teacher_public_profiles from anon, authenticated;
grant select, insert, update on public.teacher_public_profiles to authenticated;
grant all on public.teacher_public_profiles to service_role;

drop policy if exists teacher_public_profiles_own_read on public.teacher_public_profiles;
create policy teacher_public_profiles_own_read on public.teacher_public_profiles for select to authenticated
 using (teacher_id=(select auth.uid()) or public.mundus_matching_role('admin'));
drop policy if exists teacher_public_profiles_own_insert on public.teacher_public_profiles;
create policy teacher_public_profiles_own_insert on public.teacher_public_profiles for insert to authenticated
 with check (teacher_id=(select auth.uid()) and public.mundus_matching_role('teacher'));
drop policy if exists teacher_public_profiles_own_update on public.teacher_public_profiles;
create policy teacher_public_profiles_own_update on public.teacher_public_profiles for update to authenticated
 using (teacher_id=(select auth.uid()) and public.mundus_matching_role('teacher'))
 with check (teacher_id=(select auth.uid()) and public.mundus_matching_role('teacher'));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('teacher-public','teacher-public',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

commit;
