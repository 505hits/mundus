-- Explicit grants for new Supabase projects, regardless of their default privileges.
-- RLS policies from the migrations still decide which rows each user may access.
revoke all on all tables in schema public from public, anon, authenticated;
grant usage on schema public to authenticated, service_role;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.lessons, public.lesson_packages,
  public.lesson_reports, public.schedule_change_requests, public.admin_profile_notes to authenticated;
grant select, insert, update on public.student_onboarding, public.renewal_followups,
  public.teacher_preferences, public.teacher_public_profiles, public.teacher_monthly_feedback,
  public.teacher_pay_rates to authenticated;
grant select on public.payment_orders, public.payment_discount_settings,
  public.placement_results, public.learning_files to authenticated;
grant all on all tables in schema public to service_role;

-- Revoke internal trigger entry points created by the later migrations too.
do $$ declare f record;
begin
  for f in select p.oid::regprocedure as signature from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.prorettype in ('pg_catalog.trigger'::regtype,'pg_catalog.event_trigger'::regtype)
  loop
    execute format('revoke execute on function %s from public, anon, authenticated',f.signature);
  end loop;
end $$;
