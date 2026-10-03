# Mundus preview activation sequence

Code is on mundus-portal. These tools do not deploy, alter the database, send mail or enable live payments.

1. Run supabase/launch-preflight.sql in the EXISTING project's SQL editor. It is read-only and reports missing tables, RLS/policies, trigger names, accounting candidates, counter inconsistencies and private storage. Inspect candidate trigger functions before adding any lesson-credit logic; candidate names alone do not prove correct accounting. Stop if counters are inconsistent or the learning bucket is public. Do not reset existing users, packages or balances.
2. In an isolated verified preview database, apply only missing migrations in this dependency order (inspect migration history first; do not rerun creation migrations blindly):
   - 20260929_portal_admin_and_reports_rls.sql
   - 20260929_portal_update_hardening.sql
   - 20260929_schedule_and_package_guardrails.sql
   - 20260929_schedule_request_integrity.sql
   - 202609290001_account_onboarding.sql
   - 202609290002_payments.sql
   - 202610030001_first_package_identity.sql
   - 202610030002_placement_results.sql
   - 202610030003_progress_assessments.sql
   - 202610030004_learning_files.sql
   - 202610030005_schedule_email_outbox.sql
   - 202610030006_notification_recovery.sql
   - 202610030007_german_assessments.sql
   - 202610030008_report_privacy.sql
   - 202610030009_portal_session_guards.sql
   - 202610030010_spanish_assessments.sql
   - 202610030011_italian_assessments.sql
   - 202610030012_french_assessments.sql
   - 202610040001_renewal_followups.sql
   - 202610040002_teacher_preferences.sql
   - 202610040003_teacher_student_privacy.sql
   - 202610040004_portuguese_assessments.sql
   These augment an existing base schema, not an empty database. Check profile creation trigger compatibility and discounted pending-order identity duplicates before applying. Run preflight again afterward.
3. Run npm run launch:check in an environment with deployment variables, or npm run launch:check -- --env-file <local-env-file>. Never commit that file or paste secret values into chat. The command outputs only status, checks presence/shape, and does not validate credentials or prove launch readiness. Disabled optional features are reported as disabled, not missing. Public Supabase values must be supplied at build time and require a fresh deployment build.
4. Use docs/account-onboarding.md for Auth redirects, confirmed email and signup/invite checks; docs/payments.md for Stripe test mode; docs/placement-tests.md for language/audio tests; docs/learning-and-notifications.md for private files/SMTP/scheduler. Enable each feature only after its preview checks. SMTP and scheduling remain off until configured; no production cron is created by this work.
5. Verify a paid package is credited once, repeated purchase has correct price, one completed lesson changes the existing balance once, repeating completion does not double-charge, rescheduling/cancelling leaves accounting correct, and refund review preserves history. Check against existing database accounting; do not install a duplicate deduction trigger.
6. Validate desktop/mobile login, signup, reset links, onboarding, package choice through login, student/teacher isolation, file uploads/downloads, placement/progress results, lesson requests and actual email receipt. Build/lint/unit tests do not substitute for these integration checks.

Report privacy is a launch blocker until migration 202610030008 is applied and verified. Student dashboard, learning and progress use student_lesson_reports(), which returns only their shared fields. Direct report-table reads must return no rows for students, including explicit private_teacher_note queries. Check an assigned active teacher can still read/update the private note, an unrelated/inactive teacher cannot, and an active admin retains access. Existing notes are preserved. The restrictive policy blocks broad legacy SELECT policies; the RPC has no caller-selected student ID and requires a verified active student. Missing RPC shows a page load error rather than falling back to the private table.

Remaining product scope: two language question banks beyond English/German/Spanish/Italian/French/Portuguese, teacher review of approximate question levels, real device audio verification, and connected integration checks. The original production project/domain have not been changed. Production/live enablement remains a separate deliberate launch step after preview validation.

Apply session guards after the baseline schedule-response/validation triggers. Verify an inactive or unverified account with an existing token cannot read/write lessons, packages, reports, schedule requests, assessment results, learning-file metadata, onboarding or payment-order records through the API. Optional feature tables are guarded when present; rerun this migration if any are created afterward. The helper restricts legacy permissive policies; trusted service operations retain their bypass. A request must start pending with the actual requester ID. Test expired proposals can be declined by the other party, acceptance remains blocked for expired times, and a fresh valid acceptance moves the lesson exactly once. No lesson-credit deduction trigger is installed.
