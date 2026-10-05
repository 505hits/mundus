# Mundus preview activation sequence

Code is merged to main. The reviewed database activation is applied. The current public domain still serves the older Vercel project until the correct `505hits-projects` team/domain is re-authorized and promoted; live payment/email enablement remains pending.

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
   - 202610040005_verified_lesson_completion.sql
   - 202610040006_completed_lesson_integrity.sql
   - 20261004120115_report_table_grants.sql
   - 202610050001_teacher_language_offer.sql
   - 202610050003_foreign_key_indexes.sql
   - 202610050004_student_matching_preferences.sql
   - 202610050005_teacher_public_profiles.sql
   - 202610050006_portal_email_notifications.sql
   - 202610050007_portal_email_indexes.sql
   - 202610050008_teacher_profile_visibility.sql
   - 202610050009_suppress_redundant_renewal.sql
   - 202610050010_require_teacher_photo.sql
   - 202610050011_teacher_monthly_feedback.sql
   - 202610050012_teacher_feedback_timezone.sql
   - 202610050013_operations_quality_layer.sql
   - 202610050014_sync_lesson_attendance.sql
   - 202610050015_feedback_read_policy_cleanup.sql
   `202610050001_teacher_language_offer.sql` removes the retired Turkish preference value from existing teacher preference rows and expands the allowed teacher-language list to the current 13-language offer. These augment an existing base schema, not an empty database. Check profile creation trigger compatibility and discounted pending-order identity duplicates before applying. Run preflight again afterward.
3. Run npm run launch:check in an environment with deployment variables, or npm run launch:check -- --env-file <local-env-file>. Never commit that file or paste secret values into chat. The command outputs only status, checks presence/shape, and does not validate credentials or prove launch readiness. Disabled optional features are reported as disabled, not missing. Public Supabase values must be supplied at build time and require a fresh deployment build.
4. Use docs/account-onboarding.md for Auth redirects, confirmed email and signup/invite checks; docs/payments.md for Stripe test mode; docs/placement-tests.md for language/audio tests; docs/learning-and-notifications.md for private files/SMTP/scheduler. Enable each feature only after its preview checks. SMTP and scheduling remain off until configured; no production cron is created by this work.
5. Verify a paid package is credited once, repeated purchase has correct price, one completed lesson changes the existing balance once, repeating completion does not double-charge, rescheduling/cancelling leaves accounting correct, and refund review preserves history. Check against existing database accounting; do not install a duplicate deduction trigger.
6. Validate desktop/mobile login, signup, reset links, onboarding, package choice through login, student/teacher isolation, file uploads/downloads, placement/progress results, lesson requests and actual email receipt. Build/lint/unit tests do not substitute for these integration checks.

Report privacy is a launch blocker until migration 202610030008 is applied and verified. Student dashboard, learning and progress use student_lesson_reports(), which returns only their shared fields. Direct report-table reads must return no rows for students, including explicit private_teacher_note queries. Check an assigned active teacher can still read/update the private note, an unrelated/inactive teacher cannot, and an active admin retains access. Existing notes are preserved. The restrictive policy blocks broad legacy SELECT policies; the RPC has no caller-selected student ID and requires a verified active student. Missing RPC shows a page load error rather than falling back to the private table.

Remaining product scope: Russian remains a disabled review draft; other offered languages can use teacher-led level confirmation until reviewed automated banks are prepared. Teacher review of approximate question levels, real device audio verification, and connected integration checks remain outstanding. The existing Supabase project received the explicitly approved activation and report-grant fix; website production/domain settings have not been changed. Production/live enablement remains a separate deliberate launch step after preview validation.

Apply session guards after the baseline schedule-response/validation triggers. Verify an inactive or unverified account with an existing token cannot read/write lessons, packages, reports, schedule requests, assessment results, learning-file metadata, onboarding or payment-order records through the API. Optional feature tables are guarded when present; rerun this migration if any are created afterward. The helper restricts legacy permissive policies; trusted service operations retain their bypass. A request must start pending with the actual requester ID. Test expired proposals can be declined by the other party, acceptance remains blocked for expired times, and a fresh valid acceptance moves the lesson exactly once. No lesson-credit deduction trigger is installed.

## Essential V1 acceptance

Focus on login → fixed-price purchase → admin-created first lesson → teacher completion → correct remaining balance. Sign-in must recover from a temporary profile lookup failure without bouncing a valid session back to login. Checkout after session expiry retains the selected package. Admin lesson creation reuses a primary key for unchanged in-page retries and confirms a matching saved row after a lost response; it never upserts an existing lesson. This retry protection does not survive closing/reloading the form or changing its details, so inspect the schedule before recreating a lesson after those actions.

Run supabase/preview-lesson-accounting-check.sql only in an isolated preview database with one disposable overdue scheduled lesson and a disposable consistent active package with at least two credits. Replace the fixture UUID and execute the complete file, retaining its final ROLLBACK. It probes the actual existing triggers: rescheduling and teacher cancellation preserve credits, completion deducts exactly one, and a repeated completion does not deduct again. The check fails when accounting is missing or duplicated; it does not add or replace triggers. Disable external preview workers/custom webhook effects first; database rollback cannot undo external requests from custom triggers. Do not run against a real client's lesson.

This SQL-editor check runs as the database owner and does not prove teacher RLS, concurrent final-credit behavior, late cancellation/no-show policy or actual payment fulfillment. Those still require the signed-in preview flows and original accounting-function review. If it fails, inspect existing triggers before any fix to avoid installing a second deduction path.

Apply 202610040005_verified_lesson_completion.sql before teacher completion. The teacher form uses mundus_complete_lesson() with no direct-update fallback for completion. This verified-owner/assigned-teacher RPC locks the lesson and its package, runs the existing lesson-status triggers and verifies exactly one credit was consumed; a missing or double deduction rolls back the entire completion. Already-completed calls return without another update. The wrapper installs no accounting trigger and does not certify historical completed lessons or cancellation/no-show accounting. Inspect existing triggers and run the isolated preview probe first. The assigned teacher must be active with a confirmed email; students/unrelated teachers/inactive accounts cannot invoke completion successfully. Final-credit use is serialized by the package lock; a later lesson cannot consume an exhausted package.

A restrictive lesson-update policy blocks teacher direct API completion, including broad legacy update policies, so teachers must use the verified RPC. Trusted admin correction access and service operations remain available; this does not certify a direct admin correction. The wrapper uses catalog-first/public/temporary-last lookup to preserve existing unqualified public trigger queries; inspect existing trigger security and behavior during preview activation.

Admin completion now also uses mundus_complete_lesson(), without a direct-update fallback. Save any time/link corrections with the original status before marking complete. Apply 202610040006_completed_lesson_integrity.sql: completed lessons cannot be reopened or reassigned to another student/teacher/package through portal accounts, including admins. Meeting-link/time corrections remain available to admins; trusted SQL/service corrections are outside this guard and must explicitly reconcile balances. Inspect triggers before those corrections. This prevents reopening a charged record and charging it again through normal portal completion.

## Deployment evidence — 2026-10-04

GitHub reports successful Vercel deployments for mundus and mundus-5at5 on portal commit 8a62e0bc163a5e6b1926c5721b9520d828c11a22. The associated branch preview links are https://mundus-git-mundus-portal-505hits-projects.vercel.app and https://mundus-5at5-git-mundus-portal-505hits-projects.vercel.app. Requests to their login routes redirect; the mundus-5at5 redirect was followed and ends at Vercel login, not the Mundus login page. Do not treat a successful deployment status or Vercel login HTTP 200 as a successful Mundus authentication check.

The older https://mundus-chi.vercel.app/login address returns HTTP 404. Do not give that address as a working portal preview. `main` now contains the Mundus V1 portal and subsequent launch safeguards. The remaining production blocker is Vercel scope/domain configuration under the `505hits-projects` team, not an unmerged Git branch. A read-only merge-tree check finds no merge conflict against the current portal branch.

Supabase is connected. All 24 reviewed sources were applied atomically as 20261004115305_mundus_v1_portal_activation, followed by report_table_grants. Existing 3 profiles / 1 lesson / 1 package were preserved; all 13 public tables have RLS. Read-only teacher/student/anonymous role checks pass. Auth browser tests and real checkout/email/upload checks remain pending. Preflight now audits table grants as well as RLS: teachers require authenticated SELECT/INSERT/UPDATE on lesson_reports; server-only feature tables must not grant client writes. No changes to Vercel access restrictions or live payment/email flags were made.


## New purchase → teacher assignment flow

After the 2026-10-05 migrations, onboarding stores preferred days/times, teacher profiles can publish safe website data and profile photos, and the portal can rank accepting teachers by language, level, availability and capacity. A paid order creates an admin assignment email job; the admin dashboard also keeps a persistent in-app assignment alert until the student has a lesson.

## Renewal notifications

When an active package drops to two remaining lessons, admins receive a renewal reminder job. For a five-lesson package, when the fourth lesson is used and one remains, the student receives a renewal reminder job. These messages are only delivered when SMTP notifications are configured and enabled; the student/admin dashboard warnings remain available independently.


## Connected Supabase evidence — 2026-10-05

The connected project now records the following additional migrations after the original V1 activation and report grants: teacher_language_offer, foreign_key_indexes, student_matching_preferences, teacher_public_profiles, portal_email_notifications, portal_email_indexes, teacher_profile_visibility, suppress_redundant_renewal, and require_teacher_photo. Read-back verification confirms the 13-language constraints, matching preference columns, teacher profile table/RLS, intentional public teacher-photo bucket, service-only portal notification queue, assignment trigger, renewal trigger, and zero retained Turkish teacher preferences.

Supabase performance advisors report no remaining unindexed foreign keys from the new notification queue. Existing RLS init-plan and multiple-permissive-policy advisories predate this feature pass and are not being broadly refactored immediately before V1 launch. The service-only outbox tables intentionally have RLS enabled with no client policies. Leaked-password protection remains an Auth setting to enable separately if desired.


## Monthly teacher quality feedback

Students can rate each teacher once per calendar month after at least one completed lesson with that teacher in the same Europe/Bratislava month. Ratings are 1–5 with optional feedback up to 1500 characters and can be updated during the month. Database RLS enforces student ownership and completed-lesson eligibility. Admins can review historical monthly rankings with average rating, response count, completed lesson count, unique students and written comments. Students receive a dashboard reminder when a completed teacher/month remains unrated.


## Operations and quality layer

Admin now has:
- student retention signals (0–2 credits, no upcoming lesson, 14/30-day inactivity),
- private student/teacher notes,
- monthly teacher payout reports with month-specific rates and CSV export,
- Teacher Performance with quality alerts, six-month rating/lesson trends and structured feedback categories.

Attendance is stored separately from package accounting and is synchronized from the existing lesson closeout status. Completed lessons map to attended; no-show/cancellation outcomes retain their existing lesson statuses and are mirrored into attendance metadata. This does not install a second credit-deduction path.

Teachers see only their own aggregate monthly summary (completed lessons, unique students, average rating, response count and prior-month comparison). Student identities and written feedback are not exposed through the teacher summary.
