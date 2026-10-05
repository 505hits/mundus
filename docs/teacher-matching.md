# Teacher matching and student contact privacy — V1

Teachers use /teacher/availability to set accepting new students, supported languages/levels, preferred weekdays, an optional same-day time window in Europe/Bratislava, capacity for new students and notes. Empty days mean by agreement. Missing preferences default to not accepting. Preferences are not bookable slots and capacity is self-reported, not automatically decremented.

Owner uses /admin/matching to review active teachers and preferences. Only teachers marked accepting appear in this page's first-lesson form. Admin agrees a suitable teacher and time, chooses an active package and schedules the first lesson. Existing admin lesson tools remain available for deliberate overrides. No teacher self-assignment or automatic pairing is introduced.

Assignments continue to be represented by lessons in the existing model. There is no independent pairing before the first scheduled lesson and no new formal unassignment lifecycle; historical assignment access remains governed by existing policies. Reassignment/termination of access requires a separate reviewed design rather than silently deleting lesson history.

Apply missing migrations 202610040002_teacher_preferences and 202610040003_teacher_student_privacy in verified preview, following launch-sequence. These have NOT been applied by this development work. Preference forms fail closed when unavailable. Teacher names use a safe directory with no fallback to student contact profiles.

Contact protection: restrictive profiles SELECT policy prevents a teacher role, including inactive teachers, from directly reading student profile rows despite permissive older policies. Security-definer directory exposes id/full_name only for assigned active students to verified active teachers. Admin retains existing profile access. All teacher student-name displays use this directory and no longer request student email fields. No phone/address/payment contact fields are exposed by the directory. Other table permissions remain separately governed by existing RLS.

Before launch test an actual teacher token against profiles for student email/phone fields and select(*), verify no student rows; verify own teacher profile still readable, assigned names appear, unrelated/inactive teachers cannot get names, admins retain necessary contacts. Also verify onboarding/payments/storage policies and broad legacy grants; this migration is not a substitute for the full live permission audit.

Teachers necessarily meet and speak with students, and students may choose to disclose contact information in conversation or free text. Technical controls reduce exposure but cannot guarantee against off-platform solicitation. No automatic outreach, consent changes or teacher contract terms are created by this work.
