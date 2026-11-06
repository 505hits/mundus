-- Mirrors production hardening applied on 2026-11-06.
-- Require a confirmed email anywhere the shared active-admin helper is used,
-- and add covering indexes for foreign keys flagged by Supabase advisors.

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
      and u.email_confirmed_at is not null
  );
$function$;

create index if not exists company_quote_email_outbox_recipient_id_idx
  on public.company_quote_email_outbox(recipient_id);

create index if not exists contact_request_email_outbox_recipient_id_idx
  on public.contact_request_email_outbox(recipient_id);

create index if not exists group_sessions_created_by_idx
  on public.group_sessions(created_by);

create index if not exists group_sessions_teacher_id_idx
  on public.group_sessions(teacher_id);
