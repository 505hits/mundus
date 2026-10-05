# Mundus database activation review — 4 October 2026

Target: existing Supabase project `mundus` (`weemheibdrqloghigokg`, Frankfurt, PostgreSQL 17). The connection is now working.

Read-only inspection found:

- Five original public tables; no recorded Supabase migrations.
- Three active, email-confirmed accounts (one student, teacher and admin), one lesson and one package.
- Consistent package counters. The existing `lesson_package_usage_trigger` already deducts a credit on transition to completed and does not deduct again for unchanged completed status. It also reverses credits on reopening/package reassignment; portal history guards therefore matter.
- Missing onboarding, orders/discounts, assessments, learning-file metadata/private bucket, notification outbox, follow-ups, teacher preferences and safe-directory/report RPCs.
- Old report INSERT/UPDATE policies only check teacher_id. The prepared report-privacy migration now adds restrictive assignment/student/completed-lesson checks so a broad old policy cannot admit forged reports.
- Security advisor warnings about public execution of privileged trigger functions. The prepared final integrity migration now revokes client execution of public trigger/event-trigger functions while retaining ordinary trigger behavior. Isolated completion tests verify trigger execution still works.
- Leaked-password protection is disabled in Auth. This review does not change Auth settings or plan features.

## Proposed change

Apply the 24 source migrations listed in `docs/launch-sequence.md` in their dependency order, as one atomic reviewed activation. Rebuild the bundle from the current committed files; do not reuse an earlier cached batch, because report-write restrictions and trigger permissions were strengthened after the live inspection.

This adds the missing feature tables/private storage and replaces specified portal policies/triggers. It does not reset users, delete lessons/packages, install another credit-deduction trigger, enable live Stripe payments, enable email sending, promote the Vercel deployment or merge main. Existing accounts and balances are intended to remain unchanged. Permissions will change: students lose direct private-report reads, teachers lose raw student-contact access and direct completion/reopening, and clients lose trigger-function execution.

After application, verify table/RLS/grant/bucket readiness, unchanged record counts/counters, advisors and migration history. Then run isolated fixture checks of the real accounting and role policies; actual signup, checkout, uploads and email still require an accessible configured preview. No destructive user-data reset or actual outreach is part of this proposal.

## Activation result — 4 October 2026

User explicitly approved the reviewed activation. All24 sources applied atomically as `20261004115305_mundus_v1_portal_activation`. Verified3 profiles/1lesson/1package retained, consistent counters,13 public tables with RLS,50 policies and private learning storage. Teacher role sees assigned names/lessons and zero student contact profiles; anonymous role sees no lessons/packages. Subsequent grant audit found missing authenticated SELECT/INSERT/UPDATE privileges on lesson_reports, blocking staff reports despite correct RLS. Follow-up migration restores these three privileges; restrictive staff/verified-account policies retain student privacy. No DELETE privilege is added.

## Historical approval-review block

The initial production batch was rejected by automatic approval review because it spans authentication, RLS, payments, storage, notifications, assessments and accounting, including policy/trigger replacements, and broad continuation instructions did not clearly authorize that combined production mutation. At that initial attempt nothing was applied, and migration history was empty. The explicitly approved activation above supersedes that initial blocked status. Do not evade the rejection by splitting the same batch or executing it through another interface. Obtain explicit approval for this reviewed production activation before attempting it again.
