-- READ ONLY: run in the existing Supabase SQL editor before and after changes.
-- No personal rows, secrets, balance updates or email sends.
begin read only;

-- Existing base tables and added feature tables.
select name, to_regclass('public.'||name) is not null as exists
from unnest(array['profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests',
 'student_onboarding','payment_orders','payment_discount_settings','placement_results','learning_files','notification_outbox','portal_email_outbox','renewal_followups','teacher_preferences','teacher_public_profiles']) as name;

-- Verify row security and review existing policies, including old overlapping policies.
select c.relname as table_name,c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests',
 'student_onboarding','payment_orders','payment_discount_settings','placement_results','learning_files','notification_outbox','portal_email_outbox','renewal_followups','teacher_preferences','teacher_public_profiles');
select tablename,policyname,roles,cmd from pg_policies where schemaname='public'
and tablename in ('profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests','placement_results','learning_files','notification_outbox','renewal_followups','teacher_preferences');

-- RLS policies do not grant table access. Catch missing staff permissions too.
select c.relname as table_name,
 has_table_privilege('authenticated',c.oid,'SELECT') as client_select,
 has_table_privilege('authenticated',c.oid,'INSERT') as client_insert,
 has_table_privilege('authenticated',c.oid,'UPDATE') as client_update,
 has_table_privilege('service_role',c.oid,'SELECT') as server_select,
 has_table_privilege('service_role',c.oid,'INSERT') as server_insert,
 has_table_privilege('service_role',c.oid,'UPDATE') as server_update
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r'
 and c.relname in ('profiles','lessons','lesson_packages','lesson_reports','schedule_change_requests',
 'student_onboarding','payment_orders','payment_discount_settings','placement_results','learning_files',
 'notification_outbox','portal_email_outbox','renewal_followups','teacher_preferences','teacher_public_profiles') order by c.relname;
-- Expected authenticated report SELECT/INSERT/UPDATE; private rows still restricted by RLS.
-- Server-only payment/files/assessment/outbox writes must remain inaccessible to clients.
-- Server grants on tables not used by service operations need not be enabled.

-- Teacher-language preferences must match the current offer before matching is enabled.
do $language_check$ declare retired_languages bigint; unsupported_languages bigint;
begin
 if to_regclass('public.teacher_preferences') is not null then
  execute 'select count(*) from public.teacher_preferences where languages @> array[''Turkish'']::text[]' into retired_languages;
  execute 'select count(*) from public.teacher_preferences where not (languages <@ array[''English'',''German'',''Spanish'',''Italian'',''French'',''Portuguese'',''Hungarian'',''Polish'',''Russian'',''Chinese'',''Slovak'',''Ukrainian'',''Modern Hebrew'']::text[])' into unsupported_languages;
  raise notice 'Teacher preferences containing retired Turkish: %',retired_languages;
  raise notice 'Teacher preferences containing unsupported languages: %',unsupported_languages;
 end if;
end $language_check$;

-- Public teacher photos are intentionally public; profile editing remains authenticated/service-controlled.
do $teacher_public_bucket$ declare bucket_public boolean; bucket_limit bigint;
begin
 if to_regclass('storage.buckets') is not null then
  execute 'select public,file_size_limit from storage.buckets where id=''teacher-public''' into bucket_public,bucket_limit;
  raise notice 'Teacher public bucket exists/public/5MB: %',case when bucket_public and bucket_limit=5242880 then 'ready' else 'missing or misconfigured' end;
 end if;
end $teacher_public_bucket$;

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

-- Payment/package integrity: every result should be zero.
select
 (select count(*) from public.lesson_packages where used_lessons < 0 or remaining_lessons < 0
   or used_lessons + remaining_lessons <> total_lessons) as bad_package_counters,
 (select count(*) from public.lessons l join public.lesson_packages p on p.id=l.package_id
   where l.student_id<>p.student_id) as cross_student_package_links,
 (select count(*) from public.payment_orders where status='paid' and lesson_package_id is null) as paid_without_package,
 (select count(*) from public.payment_orders where status='pending' and stripe_session_id is null
   and created_at < now()-interval '30 minutes') as stale_unattached_pending,
 (select count(*) from (select student_id from public.payment_orders where status='pending'
   group by student_id having count(*)>1) s) as duplicate_pending_students,
 (select count(*) from (select stripe_session_id from public.payment_orders where stripe_session_id is not null
   group by stripe_session_id having count(*)>1) s) as duplicate_sessions,
 (select count(*) from (select stripe_payment_intent_id from public.payment_orders where stripe_payment_intent_id is not null
   group by stripe_payment_intent_id having count(*)>1) s) as duplicate_payment_intents;

-- Lesson/schedule/report integrity: every result should be zero.
select
 (select count(*) from public.schedule_change_requests r join public.lessons l on l.id=r.lesson_id
   where r.student_id<>l.student_id) as bad_schedule_student_links,
 (select count(*) from public.schedule_change_requests
   where status not in ('pending','accepted','declined')) as invalid_schedule_statuses,
 (select count(*) from public.schedule_change_requests
   where status='pending' and preferred_at<=now()) as expired_pending_requests,
 (select count(*) from public.lessons where status='completed' and completed_at is null) as completed_without_timestamp,
 (select count(*) from public.lessons where status<>'completed' and completed_at is not null) as timestamp_on_noncompleted,
 (select count(*) from public.lesson_reports r join public.lessons l on l.id=r.lesson_id
   where r.student_id<>l.student_id or r.teacher_id<>l.teacher_id) as mismatched_reports;

-- Notification queue integrity: every result should be zero.
select
 (select count(*) from public.notification_outbox where status='sent' and sent_at is null) as schedule_sent_without_time,
 (select count(*) from public.notification_outbox where status<>'sent' and sent_at is not null) as schedule_time_without_sent,
 (select count(*) from public.portal_email_outbox where status='sent' and sent_at is null) as portal_sent_without_time,
 (select count(*) from public.portal_email_outbox where status<>'sent' and sent_at is not null) as portal_time_without_sent,
 (select count(*) from public.notification_outbox where status='sending' and lease_until<now()) as expired_schedule_leases,
 (select count(*) from public.portal_email_outbox where status='sending' and lease_until<now()) as expired_portal_leases,
 (select count(*) from public.notification_outbox where attempts>5) as schedule_over_attempt_limit,
 (select count(*) from public.portal_email_outbox where attempts>5) as portal_over_attempt_limit;

-- Assessment result integrity: every result should be zero.
select
 (select count(*) from public.placement_results where score<0 or total_questions<=0 or score>total_questions) as bad_assessment_scores,
 (select count(*) from public.placement_results where assessment_kind not in ('placement','progress')) as bad_assessment_kind,
 (select count(*) from public.placement_results where language not in
   ('Angličtina','Nemčina','Španielčina','Taliančina','Francúzština','Portugalčina')) as unexpected_assessment_language,
 (select count(*) from public.placement_results where skill_scores is null) as missing_assessment_skill_scores;

-- Identity-discount and duplicate-checkout guardrails must stay enabled.
select t.tgname,t.tgenabled,pg_get_triggerdef(t.oid) as definition
from pg_trigger t
where t.tgrelid='public.payment_orders'::regclass and not t.tgisinternal
and t.tgname in ('guard_discount_identity','queue_paid_student_assignment_email')
order by t.tgname;
select indexname,indexdef from pg_indexes where schemaname='public' and tablename='payment_orders'
and indexname in ('payment_discount_pending_name','payment_discount_pending_email','payment_orders_one_pending_per_student')
order by indexname;

-- Sensitive service functions should not be executable by clients.
select p.proname,has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as client_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
and p.proname in ('mundus_reserve_payment_order','mundus_fulfill_payment_order','mundus_attach_checkout_session',
 'claim_schedule_emails','retry_schedule_email','claim_portal_emails','mundus_german_assessments_ready','mundus_spanish_assessments_ready','mundus_italian_assessments_ready','mundus_french_assessments_ready','mundus_portuguese_assessments_ready','mundus_complete_lesson','student_lesson_reports','mundus_active_portal_account');
commit;
