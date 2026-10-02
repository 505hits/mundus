import assert from 'node:assert/strict';
import { preparePasswordRecovery } from '../src/lib/password-recovery.ts';

function fixture({ exchangeError = null, user = { id: 'student' } } = {}) {
  const calls = [];
  return { calls, auth: {
    async exchangeCodeForSession(code) { calls.push(['exchange', code]); return { error: exchangeError }; },
    async setSession(tokens) { calls.push(['session', tokens]); return { error: null }; },
    async getUser() { calls.push(['user']); return { data: { user }, error: null }; },
  } };
}
let f = fixture();
await preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password?code=one-time-code'));
assert.deepEqual(f.calls, [['exchange', 'one-time-code'], ['user']]);
f = fixture({ exchangeError: new Error('expired') });
await assert.rejects(preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password?code=expired')));
assert.equal(f.calls.length, 1, 'failed code must not fall back to the currently signed-in account');
f = fixture();
await preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password#type=recovery&access_token=access&refresh_token=refresh'));
assert.equal(f.calls[0][0], 'session');
assert.equal(f.calls[1][0], 'user');
for (const suffix of ['?error=access_denied', '#error=expired', '#type=invite&access_token=a&refresh_token=b', '#type=recovery&access_token=a']) {
  f = fixture();
  await assert.rejects(preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password' + suffix)));
  assert.equal(f.calls.length, 0);
}
f = fixture({ user: null });
await assert.rejects(preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password')));
f = fixture();
await preparePasswordRecovery(f.auth, new URL('https://mundus.example/reset-password'));
assert.deepEqual(f.calls, [['user']], 'server-confirmed token-hash recovery already has a session');
console.log('PASS: recovery code exchange, fragment sessions, expired link isolation and verified-user requirement');
