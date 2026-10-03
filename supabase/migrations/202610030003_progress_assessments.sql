begin;
alter table public.placement_results add column assessment_kind text not null default 'placement' check(assessment_kind in ('placement','progress'));
create index assessment_student_kind_recent on public.placement_results(student_id,assessment_kind,created_at desc);
commit;
