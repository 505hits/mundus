# Student signup and teacher invitations

Implemented on `mundus-portal`. Do not merge/deploy to production solely to test this feature.

## Account rules

- Public signup creates a student only. There is no public teacher/admin role selector.
- Students confirm their email and provide language, approximate level and goal.
- Signup never creates a lesson package or grants lesson credits. Payments use a separate Checkout and verified webhook flow.
- Existing student/profile/package IDs and balances are unchanged. Do not invite existing students as teachers.
- An active admin sends teacher invitations from `/admin/teachers`. Sending an invitation is the admin's approval; no second approval is needed after password setup.
- Invitation authority is in Auth `app_metadata`, never user-editable `user_metadata`.
- Activation checks verified email, trusted invitation, expiry and pending teacher role, then consumes the invitation atomically.
- Admin access is assigned privately by the database/account administrator. No UI promotes anyone to admin.
- No invitations are sent during development or build checks.

## Deployment prerequisites (not applied automatically)

1. Inspect the existing database's `auth.users` profile creation trigger and `profiles` policies. The new migration augments this trigger rather than replacing it. Apply `supabase/migrations/202609290001_account_onboarding.sql` in a test environment first. New profiles are always initialized as active students; trusted server code assigns an invited teacher as pending afterward. Existing rows are untouched.
2. Configure server-only `SUPABASE_SERVICE_ROLE_KEY`. Never expose it as `NEXT_PUBLIC_*` or commit it. The admin client is protected by `server-only`.
3. Set `MUNDUS_SITE_URL` to the actual environment's origin. Add `/auth/callback`, `/auth/confirm` and `/set-password` URLs to the Supabase Auth redirect allowlist. Do not change the production domain to get a preview working.
4. Enable email/password signup and **Confirm email** in Supabase. Configure and verify SMTP delivery for actual customers. Auth's link expiry may be shorter than the application's seven-day invitation window; the earlier expiry wins.
5. Recommended confirmation email URL (cross-device, no PKCE-verifier dependency): `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`. Recommended invite email URL: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite`. Set Site URL to the correct environment. For isolated preview projects use their preview origin. Never mix production and preview email destinations.
6. Default invite emails with token fragments are also accepted by `/set-password`; fragments are removed from browser history after session handling. Default signup PKCE redirects use `/auth/callback` and require the original browser.
7. Only after the migration and email settings are verified, set `MUNDUS_SELF_SIGNUP_ENABLED=true` and `MUNDUS_INVITATIONS_ENABLED=true`. Both are off by default. This prevents exposing signup before role protections exist.

## Required integration checks before enabling

- New student signup, received verification email, verification, onboarding, login and logout; no credits created.
- Signup metadata claiming `teacher` or `admin` still creates a student.
- Direct client edits cannot change profile ID/email/role/status, insert a profile or delete/recreate a profile to bypass restrictions.
- A student cannot read/update another student's onboarding record.
- A student/teacher cannot invoke the admin invitation server action or activation RPC directly.
- Admin invitation, received email, password setup, one-time activation, expired/reused link, wrong-account session.
- Existing student email invitation is rejected without role/package changes.
- Partial delivery/setup failure is surfaced without granting active teacher access. Repair the existing account privately rather than repeatedly inviting it or deleting it.
- Test session refresh, mobile forms and desktop forms against the configured preview.

## Local validation

- `npm run build`
- `node tests/account-database.mjs` (isolated PGlite fixture: roles, RLS, activation, replay and expiry)
- Node 22.18+ / Node 24: `node --test tests/account-policy.test.mjs`

Build and policy tests do not prove email delivery, real RLS behavior, or compatibility with unseen production triggers. Full integration requires access to the configured Mundus Supabase project.

Browser visual QA could not be completed in this execution environment because the Chromium download failed. Check the signup and invitation screens at mobile and desktop widths in the configured preview.

## Password recovery

- Allow `/reset-password` in Supabase Auth redirect URLs for the deployed environment.
- Default PKCE reset links exchange the code before the password form is enabled. They need the browser that requested the email.
- For cross-device email recovery, use `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery` in the reset-password email template. The confirmation route verifies the recovery token and redirects only to `/reset-password`.
- Older recovery token fragments are accepted and removed from browser history. Failed/expired links never fall back to another signed-in account.
- Password length is consistently 10–128 characters. Test received email, expired link, different browser and successful login after reset before launch.
