-- READ ONLY: run in the existing Supabase SQL editor before applying changes.
-- No personal rows, secrets, balance updates or email sends.
begin read only;

-- Existing base tables and added feature tables.
select name, to_regclass('public.'||name) is not null as exists
from unnest(array['profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests',
 'student_onboarding','payment_orders','payment_discount_settings','placement_results','learning_files','notification_outbox','renewal_followups','teacher_preferences']) as name;

-- Verify row security and review existing policies, including old overlapping policies.
select c.relname as table_name,c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests',
 'student_onboarding','payment_orders','payment_discount_settings','placement_results','learning_files','notification_outbox','renewal_followups','teacher_preferences');
select tablename,policyname,roles,cmd from pg_policies where schemaname='public'
and tablename in ('profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests','placement_results','learning_files','notification_outbox','renewal_followups','teacher_preferences');

-- Teacher contact privacy must be active before launch.
select to_regprocedure('public.teacher_student_directory()') is not null as teacher_directory_exists,
 exists(select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='teacher_student_contact_privacy' and permissive='RESTRICTIVE') as teacher_contact_privacy_exists;

-- Student report access must use the safe own-account RPC, with direct private reads restricted.
select to_regprocedure('public.student_lesson_reports()') is not null as student_report_rpc_exists,
 exists(select 1 from pg_policies where schemaname='public' and tablename='lesson_reports'
   and policyname='Report private fields require staff access' and permissive='RESTRICTIVE') as report_privacy_policy_exists;

-- Every legacy portal table needs the restrictive session policy.
select tablename,policyname,permissive from pg_policies where schemaname='public'
and policyname='Active verified portal account required';

-- Identify existing package/accounting triggers BEFORE adding any deduction logic.
select c.relname as table_name,t.tgname as trigger_name,p.proname as function_name,t.tgenabled
from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
join pg_proc p on p.oid=t.tgfoid where not t.tgisinternal and n.nspname='public'
and c.relname in ('lessons','lesson_packages','profiles','schedule_change_requests') order by c.relname,t.tgname;
select distinct p.proname as accounting_candidate
from pg_trigger t join pg_proc p on p.oid=t.tgfoid join pg_class c on c.oid=t.tgrelid
join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and n.nspname='public' and c.relname='lessons'
and pg_get_functiondef(p.oid) ~* '(used_lessons|remaining_lessons|lesson_packages)';
-- Candidate names do not prove correct/idempotent deduction. Inspect the functions in Supabase.

-- Private learning bucket; query remains safe when the storage schema is missing.
do $$ declare bucket_public boolean; inconsistent bigint;
begin
 if to_regclass('storage.buckets') is not null then
  execute 'select public from storage.buckets where id=''mundus-learning''' into bucket_public;
  raise notice 'Learning bucket exists/private: %',case when bucket_public is null then 'missing' when bucket_public then 'PUBLIC - stop' else 'private' end;
 end if;
 if to_regclass('public.lesson_packages') is not null then
  execute 'select count(*) from public.lesson_packages where total_lessons is null or total_lessons<=0 or used_lessons<0 or remaining_lessons<0 or used_lessons+remaining_lessons<>total_lessons or used_lessons is null or remaining_lessons is null' into inconsistent;
  raise notice 'Packages with inconsistent counters: %',inconsistent;
 end if;
end $$;

-- Sensitive service functions should not be executable by clients.
select p.proname,has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as client_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
and p.proname in ('mundus_reserve_payment_order','mundus_fulfill_payment_order','mundus_attach_checkout_session',
 'claim_schedule_emails','retry_schedule_email','mundus_german_assessments_ready','mundus_spanish_assessments_ready','mundus_italian_assessments_ready','mundus_french_assessments_ready','mundus_portuguese_assessments_ready','mundus_complete_lesson','student_lesson_reports','mundus_active_portal_account');
commit;
