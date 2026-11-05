# Installer Mundus sur votre projet Supabase vide

Projet concerne : `https://hwhxyjzwjmqkgbldlbno.supabase.co`.
Les anciennes notes du depot concernent un autre projet ; cette installation est reservee a votre base publique vide.

1. Dans ce projet Supabase, ouvrir **SQL Editor > New query**.
2. Ouvrir `02-installation-mundus-base-vide.sql`, copier TOUT le contenu et le coller dans l'editeur. Executer une seule fois, en une seule requete. Le resultat final doit etre **MUNDUS_INSTALL_OK**. Le fichier refuse une base publique deja installee ; toute erreur annule l'installation entiere.
3. Creer votre compte Auth si necessaire (site Mundus ou Authentication > Users). Confirmer votre adresse email. L'installation cree un profil etudiant pour les comptes Auth deja presents et pour les futurs comptes ; elle ne cree aucun mot de passe et ne donne pas automatiquement les droits admin.
4. Ouvrir `03-definir-compte-admin.sql`, remplacer `REMPLACER_PAR_VOTRE_EMAIL` par l'adresse exacte de votre compte Auth confirme, puis executer le fichier complet. Resultat attendu : **MUNDUS_ADMIN_OK**.
5. Dans Vercel, verifier que URL et cles viennent toutes de ce meme projet Supabase. `NEXT_PUBLIC_SUPABASE_URL` doit valoir exactement `https://hwhxyjzwjmqkgbldlbno.supabase.co`. Garder la cle `SUPABASE_SERVICE_ROLE_KEY` en Secret, sans prefixe NEXT_PUBLIC_. Les variables publiques restent en Config.
6. Les trois variables Supabase sont actuellement presentes pour Production ; les ajouter aussi a Preview pour tester la branche de correctifs. `MUNDUS_SITE_URL` de production vaut `https://munduslanguages.com`.
7. Supabase > Authentication > URL Configuration : definir Site URL sur `https://munduslanguages.com` et autoriser `https://munduslanguages.com/auth/callback`, `https://munduslanguages.com/auth/confirm` et `https://munduslanguages.com/reset-password` et `https://munduslanguages.com/set-password`. Les domaines preview utilises pour les tests doivent etre autorises separement.
8. Reconstruire le deploiement Vercel apres la configuration des variables. Les correctifs de visibilite du portail sont proposes dans https://github.com/505hits/mundus/pull/4 ; ils ne sont pas encore fusionnes.
9. Verifier avec un compte admin et un compte etudiant distinct : connexion, creation d'un forfait et d'une lecon par l'admin, affichage chez l'etudiant, rapport du professeur, solde et deconnexion/reconnexion. Une base neuve n'a pas de cours ni de forfaits historiques ; ceux d'un ancien projet ne sont pas copies automatiquement.

## Ce qui est installe

Les cinq tables de base, toutes les migrations presentes dans le depot lors de la generation, les politiques RLS, les fonctions du portail, le stockage pedagogique prive, le stockage des photos publiques, la creation des profils Auth et un unique decompte de credit lors de la completion d'une lecon. Les demandes du formulaire de contact sont stockees pour consultation admin.

Le script SQL n'active pas Stripe, n'envoie pas d'emails et ne configure pas de scheduler. Les paiements en ligne, SMTP et inscriptions/invitations reglees par des feature flags demandent leur propre configuration et des tests reels. Ne pas activer les paiements live avant leur verification.

## Verification realisee

Installation complete executee en PostgreSQL compatible isole (PGlite), avec schemas Auth/Storage de test. Controle des colonnes SELECT de l'application, creation/backfill des profils, lecture et ecriture admin, isolation des etudiants, confidentialite des contacts/notes, stockage prive, completion repetee ne debitant qu'un credit, privileges et refus d'une deuxieme installation. Cela ne remplace pas une verification sur votre projet Supabase ni des essais navigateur connectes.
