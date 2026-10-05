begin;
create table public.placement_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  language text not null check (language='Angličtina'),
  test_version text not null,
  score integer not null check(score between 0 and 24),
  total_questions integer not null default 24 check(total_questions=24),
  band_scores jsonb not null,
  skill_scores jsonb not null,
  recommendation text not null,
  created_at timestamptz not null default now()
);
alter table public.placement_results enable row level security;
create policy placement_read on public.placement_results for select to authenticated using (
  student_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.status='active' and (
    p.role='admin' or (p.role='teacher' and exists(select 1 from public.lessons l where l.teacher_id=p.id and l.student_id=placement_results.student_id))
  ))
);
revoke all on public.placement_results from anon, authenticated;
grant select on public.placement_results to authenticated;
grant all on public.placement_results to service_role;
create index placement_student_recent on public.placement_results(student_id,created_at desc);
commit;
