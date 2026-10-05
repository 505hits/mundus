# Mundus strategy audit — 4 October 2026

Sources: original MUNDUS conversation retrieved on 4 October and current Mundus-master-notes version 39, compared against mundus-portal source. Code presence and automated checks do not establish live service behavior.

## Locked direction

Slovak market; personalized practical online teaching. Focus: acquisition/conversion 60%, follow-up/renewals 25%, operational automation 15%. Package-first sales, no default trial lesson. Recommend 5–10 lessons appropriately. Only individual 60-minute packages 1/5/10/20/30 priced EUR28/135/260/490/705; first package 10% once per person. No extra group prices restored. Student verified signup, teachers invited/admin-controlled. Continue solo, without Vercel connection; use existing Supabase rather than restarting Make lesson tracking.

## Comparison

| Original requirement | Current evidence | Remaining work |
| --- | --- | --- |
| Public package purchase and repeat purchase | Homepage cards, account prices, Checkout/webhook code and history | Real Stripe test checkout, webhook replay, discount/repurchase and deployment verification |
| Secure student/teacher/admin access | Auth flows, invites, role/RLS migrations, inactive session guards | Apply missing migrations in verified preview; real signup, confirmation, login, reset and teacher invite checks |
| Actual completed-lesson balance accounting | Completion controls and existing database accounting expected by plan | Inspect actual existing trigger and test exactly-once deduction, repeats, rescheduling and cancellation; do not add duplicate trigger |
| Owner attention dashboard | Active counts, 1–2 lesson package alerts, no-next-lesson and pending-request counts | Named renewal queue including exhausted packages now added; missing-report overview of the latest 50 completed lessons now added; private follow-up status/date/notes and date-ordered open follow-up queue now prepared with a required migration; teacher workload. Counts alone are partial coverage |
| Lead-to-customer pipeline | Contact via Instagram; account onboarding | No portal CRM stages, package-offer tracking, last/next follow-up, conversion analytics or deduplicated business pipeline found. Existing Communication workbook remains a separate foundation; not audited as current live data |
| Renewal at 2/1/0 actual lessons | Student low-balance warnings, admin package views, manual repurchase | Follow-up tracking and owner renewal workflow incomplete; no automatic renewal email delivery demonstrated |
| General level and later progress tests | English/German/Spanish/Italian/French/Portuguese banks with grammar/reading/listening and isolated comparisons | Russian remains a disabled review draft; other offered languages use teacher-led level confirmation. Teacher calibration, device voice checks and live storage still need verification. No certification claim |
| Homework/materials | Text reports, PDF/image/TXT uploads, private downloads and student submission | Explicit completion status, linked assignment-to-submission review/comments, external-link material type and office-document support absent. Decide these within V1 priorities rather than making a large LMS |
| Flexible schedule requests and notifications | Student requests, teacher proposals, accept/decline, email queue/worker | Live queue, scheduler/SMTP and recipient receipt checks; scheduling error guards fixed in this checkpoint |
| B2B acquisition | Business is covered in original plan; generic contact exists | Dedicated company enquiry collecting employee count/language/format/goal, company follow-up workflow and acquisition reporting absent; corporate HR portal remains deferred |
| Honest public content | Audit found universal native speakers, 24/7, instant matching, certificates, two-minute assessment and unverified social proof | Corrected visible claims; removed reviews from homepage pending provenance; replaced unverified teacher cards with teacher-selection explanation. Unused legacy components/data are not verified content |
| Brand and Slovak portal | Login/auth uses Mundus indigo/charcoal; Slovak portal labels | Operational portal palette now aligned with indigo/charcoal/warm-white brand; mobile/browser visual QA remains |
| Small groups | Original business offers small groups; locked checkout is individual only | No group enrollment/capacity/course scheduling flow. Do not invent prices or restore old offers; keep as separately planned business workflow |

## Launch order

1. Activate and verify the existing core in a preview: privacy/session migrations, authentication, payments and lesson accounting. These are release blockers.
2. Finish owner renewal/attention workflow and follow-up tracking before expanding optional automation. No outreach is sent by this audit.
3. Review the Russian draft and decide later which additional offered languages justify automated assessments; complete teacher/device reviews and clarify homework V1 review/completion scope.
4. Validate full desktop/mobile student, teacher and owner flows and the current deployed build. Until then, no new measured completion percentage or bug-free claim is justified.

Deferred by original plan: custom video, AI transcription, advanced flashcards, gamification, official certificates, corporate HR portal and a large LMS. Historical trial pages are not evidence of a required new trial funnel; current admin trial route redirects to lessons, and optional Calendly is Q&A.
