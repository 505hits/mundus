# Mundus V1 code-complete status — 5 October 2026

This file separates work that is complete in the repository from release work that requires external configuration or live integration testing.

## Complete in code

- Student, teacher and admin role routing, verified-email/session guards and invitation-only teacher activation.
- Student onboarding and the current 13-language teaching offer.
- Admin lesson creation, teacher matching/preferences and a 7-day teacher workload overview.
- Fixed lesson packages, first-package discount rules, Stripe Checkout/webhook fulfillment logic, repurchase flow and refund-review workflow.
- Verified lesson completion around the existing package-accounting trigger, completed-lesson history protection and retry safeguards.
- Student dashboard, schedules, reschedule requests, lesson reports, progress views and renewal prompts.
- Private learning-file upload/download authorization and retry handling.
- Schedule-change notification outbox, retry/recovery logic and worker authentication.
- English, German, Spanish, Italian, French and Portuguese placement/progress assessments; Russian remains a disabled teacher-review draft.
- Accessibility/error-state hardening for account flows.
- Current language catalog shared by lesson creation, teacher preferences and server validation.
- Launch preflight, migration ordering and regression tests.
- Prepared database hardening for the current language constraint, anonymous helper privilege removal and covering foreign-key indexes.

## Verified without deployment changes

Read-only checks against the connected Mundus Supabase project confirmed:

- All 13 key public tables have RLS enabled.
- The learning bucket is private.
- Existing lesson-package counters are internally consistent.
- Student report, teacher directory and verified lesson-completion RPCs exist.
- Report private-field and teacher-contact privacy policies exist.
- Existing accounting trigger is present.
- There are no stored teacher preferences using the retired Turkish value.

The live teacher-preference database constraint still contains the old 8-language list. The repository contains the ordered migration that fixes it, but that migration has not been applied here because changing the live database requires separate approval.

## External/integration work still required

These cannot be completed or honestly verified from repository work alone:

1. Apply and verify the three latest prepared database migrations in the approved environment.
2. Enable leaked-password protection in Supabase Auth if desired for launch.
3. Verify real student signup, confirmation email, login, logout and password recovery.
4. Verify a real teacher invitation and password setup.
5. Configure Stripe test credentials/webhook and run purchase, retry, repurchase, discount, delayed-payment and refund scenarios.
6. Configure SMTP plus the notification scheduler and verify actual inbox receipt/retries.
7. Test real private upload/download flows with student, assigned teacher and unrelated accounts.
8. Test lesson accounting with disposable preview records and the existing trigger.
9. Run mobile/desktop/browser/device QA, including assessment audio.
10. Merge/promote the tested branch and enable production features only after the above checks.

Large CRM, corporate HR portal, advanced LMS features, additional automated assessment languages, AI transcription, gamification and certificates are intentionally outside the V1 launch scope.
