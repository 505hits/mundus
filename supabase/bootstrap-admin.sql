-- A executer APRES 02-installation-mundus-base-vide.sql.
-- Remplacer seulement l'adresse ci-dessous par celle de VOTRE compte Auth Mundus.
-- Le compte doit deja exister dans Authentication > Users et son email etre confirme.
begin;
set local request.jwt.claim.role = 'service_role';

do $$
declare
  admin_email text := 'REMPLACER_PAR_VOTRE_EMAIL';
  admin_id uuid;
begin
  if admin_email = 'REMPLACER_PAR_VOTRE_EMAIL' then
    raise exception 'Remplacez REMPLACER_PAR_VOTRE_EMAIL par votre adresse email avant de lancer le script.';
  end if;
  select id into strict admin_id from auth.users
    where lower(email)=lower(trim(admin_email)) and email_confirmed_at is not null;
  update public.profiles set role='admin', status='active', updated_at=now() where id=admin_id;
  if not found then raise exception 'Profil manquant : executer installation complete avant ce script.'; end if;
exception when no_data_found then
  raise exception 'Compte Auth confirme introuvable. Creez votre compte et confirmez votre email, puis reessayez.';
end $$;

commit;
select 'MUNDUS_ADMIN_OK' as configuration;
