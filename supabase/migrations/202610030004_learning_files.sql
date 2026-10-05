begin;
create table public.learning_files (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id),
 uploaded_by uuid not null references public.profiles(id), kind text not null check(kind in ('material','homework_assignment','homework_submission')),
 title text not null check(length(title) between 1 and 150), object_path text not null unique,
 file_name text not null, mime_type text not null, size_bytes integer not null check(size_bytes between 1 and 3145728),
 created_at timestamptz not null default now()
);
alter table public.learning_files enable row level security;
create policy learning_files_read on public.learning_files for select to authenticated using (
 student_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.status='active' and
 (p.role='admin' or (p.role='teacher' and exists(select 1 from public.lessons l where l.teacher_id=p.id and l.student_id=learning_files.student_id))))
);
revoke all on public.learning_files from anon,authenticated;
grant select on public.learning_files to authenticated;
grant all on public.learning_files to service_role;
create index learning_files_student_recent on public.learning_files(student_id,created_at desc);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('mundus-learning','mundus-learning',false,3145728,array['application/pdf','image/png','image/jpeg','text/plain'])
on conflict(id) do nothing;
do $$ begin
 if exists(select 1 from storage.buckets where id='mundus-learning' and public=true) then raise exception 'Learning bucket must be private'; end if;
end $$;
-- No public/client storage policies: server authorizes uploads and short-lived downloads.
commit;
