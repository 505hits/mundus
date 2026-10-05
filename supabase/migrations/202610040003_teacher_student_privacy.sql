begin;
create or replace function public.mundus_is_teacher_user() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='teacher') $$;
revoke all on function public.mundus_is_teacher_user() from public,anon;
grant execute on function public.mundus_is_teacher_user() to authenticated;
alter table public.profiles enable row level security;
drop policy if exists teacher_student_contact_privacy on public.profiles;
create policy teacher_student_contact_privacy on public.profiles as restrictive for select to authenticated using(not public.mundus_is_teacher_user() or role<>'student');
create or replace function public.teacher_student_directory() returns table(id uuid,full_name text) language sql stable security definer set search_path='' as $$
 select p.id,p.full_name from public.profiles p where p.role='student' and p.status='active' and public.mundus_matching_role('teacher')
 and exists(select 1 from public.lessons l where l.teacher_id=auth.uid() and l.student_id=p.id);
$$;
revoke all on function public.teacher_student_directory() from public,anon;
grant execute on function public.teacher_student_directory() to authenticated;
commit;
