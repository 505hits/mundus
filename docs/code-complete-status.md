# Mundus V1 code-complete status — 5 October 2026

This file separates work that is complete in the repository from release work that requires external configuration or live integration testing.

## Complete in code

- Student, teacher and admin role routing, verified-email/session guards and invitation-only teacher activation.
- Student onboarding and the current 13-language teaching offer, including preferred days/times for matching.
- Admin lesson creation, ranked teacher recommendations, teacher matching/preferences, a central lesson calendar and a 7-day teacher workload overview.
- Fixed lesson packages, first-package discount rules, Stripe Checkout/webhook fulfillment logic, repurchase flow and refund-review workflow.
- Verified lesson completion around the existing package-accounting trigger, completed-lesson history protection and retry safeguards.
- Student dashboard, schedules, reschedule requests, lesson reports, progress views and renewal prompts.
- Private learning-file upload/download authorization and retry handling.
- Schedule-change notification outbox, assignment/renewal email queues, retry/recovery logic and worker authentication.
- English, German, Spanish, Italian, French and Portuguese placement/progress assessments; Russian remains a disabled teacher-review draft.
- Teacher-managed public profiles with photo, languages and bio, automatically surfaced on the main website when visible.
- Accessibility/error-state hardening for account flows.
- Current language catalog shared by lesson creation, teacher preferences and server validation.
- Launch preflight, migration ordering and regression tests.
- Database hardening for the current language constraints, teacher public profiles, notification queues and covering foreign-key indexes is applied and verified in the connected Supabase project.

## Verified in the connected Supabase project

Read-only checks against the connected Mundus Supabase project confirmed:

- Existing portal tables plus the new teacher-public-profile and portal-email-outbox tables have the expected RLS/service-only posture.
- The learning bucket is private.
- Existing lesson-package counters are internally consistent.
- Student report, teacher directory and verified lesson-completion RPCs exist.
- Report private-field and teacher-contact privacy policies exist.
- Existing accounting trigger is present.
- There are no stored teacher preferences using the retired Turkish value.
- Student onboarding stores current 13-language choices plus preferred days/times.
- Teacher public profile storage is a deliberate public-read image bucket with a 5 MB JPG/PNG/WebP limit; profile writes remain controlled server-side.
- Paid-order assignment and low-credit renewal triggers are installed.
- Notification queue foreign keys and pending-work lookup are indexed.

The live teacher-preference and student-onboarding constraints now match the current 13-language offer. `mundus_active_portal_account()` intentionally remains executable by `anon` because the restrictive RLS policy applies to `public` and needs to evaluate the helper for anonymous requests. With no authenticated `auth.uid()`, the helper returns `false`; regression coverage verifies anonymous table access remains blocked.

## External/integration work still required

These cannot be completed or honestly verified from repository work alone:

1. Enable leaked-password protection in Supabase Auth if desired for launch.
2. Verify real student signup, confirmation email, login, logout and password recovery.
3. Verify a real teacher invitation, profile completion/photo upload and password setup.
4. Configure the Stripe test webhook against the final deployed callback URL and run purchase, retry, repurchase, discount, delayed-payment and refund scenarios.
5. Configure SMTP plus the notification scheduler and verify actual assignment/renewal/schedule emails and retries.
6. Test real private upload/download flows with student, assigned teacher and unrelated accounts.
7. Test lesson accounting with disposable preview records and the existing trigger.
8. Run mobile/desktop/browser/device QA, including assessment audio and the central admin calendar.
9. Merge/promote the tested branch and enable production features only after the above checks.

Large CRM, corporate HR portal, advanced LMS features, additional automated assessment languages, AI transcription, gamification and certificates are intentionally outside the V1 launch scope.
