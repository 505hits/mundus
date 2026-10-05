// Redacted configuration check. No network calls, writes or emails.
if (process.argv.includes('--env-file')) {
  const path=process.argv[process.argv.indexOf('--env-file')+1];
  if(!path){process.stderr.write('Provide an environment file path.\n');process.exit(2);}
  try{process.loadEnvFile(path);}catch{process.stderr.write('Could not load the environment file.\n');process.exit(2);}
}
const env=process.env;
const missing=[];
function check(label,ready){process.stdout.write(`${ready?'PASS':'MISSING'} ${label}\n`);if(!ready)missing.push(label);}
function https(value){try{return new URL(value).protocol==='https:';}catch{return false;}}
check('Supabase URL',https(env.NEXT_PUBLIC_SUPABASE_URL));
check('Supabase public publishable key',!!env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
check('Server Supabase service key',!!env.SUPABASE_SERVICE_ROLE_KEY);
check('Canonical HTTPS site URL',https(env.MUNDUS_SITE_URL));
for (const flag of ['MUNDUS_SELF_SIGNUP_ENABLED','MUNDUS_INVITATIONS_ENABLED','MUNDUS_PAYMENTS_ENABLED','MUNDUS_PAYMENTS_LIVE_ENABLED','MUNDUS_EMAIL_NOTIFICATIONS_ENABLED']) {
 if(env[flag]!==undefined) check(`${flag} is true or false`,['true','false'].includes(env[flag]));
}
process.stdout.write(`INFO Student signup ${env.MUNDUS_SELF_SIGNUP_ENABLED==='true'?'enabled':'disabled'}\n`);
process.stdout.write(`INFO Teacher invitations ${env.MUNDUS_INVITATIONS_ENABLED==='true'?'enabled':'disabled'}\n`);
const payments=env.MUNDUS_PAYMENTS_ENABLED==='true';
process.stdout.write(`INFO Payments ${payments?'enabled':'disabled'}\n`);
if(payments){
 const live=env.MUNDUS_PAYMENTS_LIVE_ENABLED==='true';
 check('Stripe key matches payment mode',!!env.STRIPE_RESTRICTED_KEY?.startsWith(live?'rk_live_':'rk_test_'));
 check('Stripe webhook signing secret',!!env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'));
 process.stdout.write(`INFO Stripe mode ${live?'LIVE':'TEST'}\n`);
}
const emails=env.MUNDUS_EMAIL_NOTIFICATIONS_ENABLED==='true';
process.stdout.write(`INFO Schedule emails ${emails?'enabled':'disabled'}\n`);
if(emails){
 check('SMTP host and credentials',!!env.MUNDUS_SMTP_HOST&&!!env.MUNDUS_SMTP_USER&&!!env.MUNDUS_SMTP_PASSWORD);
 check('SMTP TLS port', [465,587].includes(Number(env.MUNDUS_SMTP_PORT||587)));
 check('SMTP sender address', /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(env.MUNDUS_EMAIL_FROM||''));
 check('Notification worker secret length',(env.MUNDUS_NOTIFICATION_SECRET||env.CRON_SECRET||'').length>=32);
}
process.stdout.write('MANUAL Verify migrations, Auth email delivery/redirects, private storage, lesson-credit triggers and enabled integration flows.\n');
process.stdout.write('MANUAL Public Supabase values must exist when the deployment is built; runtime configuration alone cannot repair an old client build.\n');
process.stdout.write('INFO This checks configuration presence/shape, not credential validity or launch readiness. Values are never printed.\n');
process.exitCode=missing.length?1:0;
