begin;
alter table public.placement_results drop constraint if exists placement_results_language_check;
alter table public.placement_results add constraint placement_results_language_check
  check(language in ('Angličtina','Nemčina','Španielčina'));
create or replace function public.mundus_spanish_assessments_ready()
returns boolean language sql set search_path='' as $$ select true $$;
revoke all on function public.mundus_spanish_assessments_ready() from public,anon,authenticated;
grant execute on function public.mundus_spanish_assessments_ready() to service_role;
commit;
