begin;
alter table public.placement_results drop constraint placement_results_language_check;
alter table public.placement_results add constraint placement_results_language_check check(language in ('Angličtina','Nemčina'));
create function public.mundus_german_assessments_ready() returns boolean language sql set search_path='' as $$ select true $$;
revoke all on function public.mundus_german_assessments_ready() from public,anon,authenticated;
grant execute on function public.mundus_german_assessments_ready() to service_role;
commit;
