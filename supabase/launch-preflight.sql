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

-- Payment/package integrity. Notices should all report zero when the related tables exist.
do $payment_integrity$ declare
 bad_package_counters bigint:=0; cross_student_package_links bigint:=0; paid_without_package bigint:=0;
 stale_unattached_pending bigint:=0; duplicate_pending_students bigint:=0; duplicate_sessions bigint:=0;
 duplicate_payment_intents bigint:=0;
begin
 if to_regclass('public.lesson_packages') is not null then
  execute 'select count(*) from public.lesson_packages where used_lessons < 0 or remaining_lessons < 0 or used_lessons + remaining_lessons <> total_lessons'
   into bad_package_counters;
 end if;
 if to_regclass('public.lessons') is not null and to_regclass('public.lesson_packages') is not null then
  execute 'select count(*) from public.lessons l join public.lesson_packages p on p.id=l.package_id where l.student_id<>p.student_id'
   into cross_student_package_links;
 end if;
 if to_regclass('public.payment_orders') is not null then
  execute 'select count(*) from public.payment_orders where status=''paid'' and lesson_package_id is null' into paid_without_package;
  execute 'select count(*) from public.payment_orders where status=''pending'' and stripe_session_id is null and created_at < now()-interval ''30 minutes'''
   into stale_unattached_pending;
  execute 'select count(*) from (select student_id from public.payment_orders where status=''pending'' group by student_id having count(*)>1) s'
   into duplicate_pending_students;
  execute 'select count(*) from (select stripe_session_id from public.payment_orders where stripe_session_id is not null group by stripe_session_id having count(*)>1) s'
   into duplicate_sessions;
  execute 'select count(*) from (select stripe_payment_intent_id from public.payment_orders where stripe_payment_intent_id is not null group by stripe_payment_intent_id having count(*)>1) s'
   into duplicate_payment_intents;
 end if;
 raise notice 'Payment/package integrity bad counters/cross links/paid without package/stale pending/duplicate students/sessions/intents: %/%/%/%/%/%/%',
  bad_package_counters,cross_student_package_links,paid_without_package,stale_unattached_pending,duplicate_pending_students,duplicate_sessions,duplicate_payment_intents;
end $payment_integrity$;

do $schedule_integrity$ declare
 bad_student_links bigint:=0; invalid_statuses bigint:=0; expired_pending bigint:=0;
 completed_without_time bigint:=0; time_on_noncompleted bigint:=0; mismatched_reports bigint:=0;
begin
 if to_regclass('public.schedule_change_requests') is not null and to_regclass('public.lessons') is not null then
  execute 'select count(*) from public.schedule_change_requests r join public.lessons l on l.id=r.lesson_id where r.student_id<>l.student_id'
   into bad_student_links;
  execute 'select count(*) from public.schedule_change_requests where status not in (''pending'',''accepted'',''declined'')'
   into invalid_statuses;
  execute 'select count(*) from public.schedule_change_requests where status=''pending'' and preferred_at<=now()'
   into expired_pending;
 end if;
 if to_regclass('public.lessons') is not null then
  execute 'select count(*) from public.lessons where status=''completed'' and completed_at is null' into completed_without_time;
  execute 'select count(*) from public.lessons where status<>''completed'' and completed_at is not null' into time_on_noncompleted;
 end if;
 if to_regclass('public.lesson_reports') is not null and to_regclass('public.lessons') is not null then
  -- Only run the relationship check when the current lesson_reports shape has these columns.
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='lesson_reports' and column_name='lesson_id')
     and exists(select 1 from information_schema.columns where table_schema='public' and table_name='lesson_reports' and column_name='student_id')
     and exists(select 1 from information_schema.columns where table_schema='public' and table_name='lesson_reports' and column_name='teacher_id') then
   execute 'select count(*) from public.lesson_reports r join public.lessons l on l.id=r.lesson_id where r.student_id<>l.student_id or r.teacher_id<>l.teacher_id'
    into mismatched_reports;
  end if;
 end if;
 raise notice 'Schedule/report integrity bad links/statuses/expired pending/completion timestamps/mismatched reports: %/%/%/%/%/%',
  bad_student_links,invalid_statuses,expired_pending,completed_without_time,time_on_noncompleted,mismatched_reports;
end $schedule_integrity$;

do $queue_integrity$ declare
 schedule_sent_without_time bigint:=0; schedule_time_without_sent bigint:=0;
 portal_sent_without_time bigint:=0; portal_time_without_sent bigint:=0;
 expired_schedule_leases bigint:=0; expired_portal_leases bigint:=0;
 schedule_over_limit bigint:=0; portal_over_limit bigint:=0;
begin
 if to_regclass('public.notification_outbox') is not null then
  execute 'select count(*) from public.notification_outbox where status=''sent'' and sent_at is null' into schedule_sent_without_time;
  execute 'select count(*) from public.notification_outbox where status<>''sent'' and sent_at is not null' into schedule_time_without_sent;
  execute 'select count(*) from public.notification_outbox where status=''sending'' and lease_until<now()' into expired_schedule_leases;
  execute 'select count(*) from public.notification_outbox where attempts>5' into schedule_over_limit;
 end if;
 if to_regclass('public.portal_email_outbox') is not null then
  execute 'select count(*) from public.portal_email_outbox where status=''sent'' and sent_at is null' into portal_sent_without_time;
  execute 'select count(*) from public.portal_email_outbox where status<>''sent'' and sent_at is not null' into portal_time_without_sent;
  execute 'select count(*) from public.portal_email_outbox where status=''sending'' and lease_until<now()' into expired_portal_leases;
  execute 'select count(*) from public.portal_email_outbox where attempts>5' into portal_over_limit;
 end if;
 raise notice 'Queue integrity sent timestamps/expired leases/attempt limits: %/%/%/%/%/%/%/%',
  schedule_sent_without_time,schedule_time_without_sent,portal_sent_without_time,portal_time_without_sent,
  expired_schedule_leases,expired_portal_leases,schedule_over_limit,portal_over_limit;
end $queue_integrity$;

do $assessment_integrity$ declare
 bad_scores bigint:=0; bad_kind bigint:=0; unexpected_language bigint:=0; missing_skills bigint:=0;
begin
 if to_regclass('public.placement_results') is not null then
  execute 'select count(*) from public.placement_results where score<0 or total_questions<=0 or score>total_questions' into bad_scores;
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='placement_results' and column_name='assessment_kind') then
   execute 'select count(*) from public.placement_results where assessment_kind not in (''placement'',''progress'')' into bad_kind;
  end if;
  execute 'select count(*) from public.placement_results where language not in (''Angličtina'',''Nemčina'',''Španielčina'',''Taliančina'',''Francúzština'',''Portugalčina'')'
   into unexpected_language;
  execute 'select count(*) from public.placement_results where skill_scores is null' into missing_skills;
 end if;
 raise notice 'Assessment integrity bad score/kind/language/missing skills: %/%/%/%',
  bad_scores,bad_kind,unexpected_language,missing_skills;
end $assessment_integrity$;

-- Identity-discount and duplicate-checkout guardrails, when payments exist.
do $payment_guards$ declare guard_count bigint:=0; index_count bigint:=0;
begin
 if to_regclass('public.payment_orders') is not null then
  select count(*) into guard_count from pg_trigger t
   where t.tgrelid='public.payment_orders'::regclass and not t.tgisinternal
   and t.tgenabled<>'D' and t.tgname in ('guard_discount_identity','queue_paid_student_assignment_email');
  select count(*) into index_count from pg_indexes where schemaname='public' and tablename='payment_orders'
   and indexname in ('payment_discount_pending_name','payment_discount_pending_email','payment_orders_one_pending_per_student');
  raise notice 'Payment guard triggers enabled / expected: %/2; unique checkout indexes present / expected: %/3',guard_count,index_count;
 end if;
end $payment_guards$;

-- Sensitive service functions should not be executable by clients.
select p.proname,has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as client_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
and p.proname in ('mundus_reserve_payment_order','mundus_fulfill_payment_order','mundus_attach_checkout_session',
 'claim_schedule_emails','retry_schedule_email','claim_portal_emails','mundus_german_assessments_ready','mundus_spanish_assessments_ready','mundus_italian_assessments_ready','mundus_french_assessments_ready','mundus_portuguese_assessments_ready','mundus_complete_lesson','student_lesson_reports','mundus_active_portal_account');
commit;
