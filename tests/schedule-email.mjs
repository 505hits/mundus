import assert from 'node:assert/strict';import {scheduleEmail} from '../src/lib/schedule-email.ts';
const when='2026-11-01T14:00:00Z';
assert.match(scheduleEmail('pending',when,'https://example.com/lessons').text,/do prijatia/);
assert.match(scheduleEmail('declined',when,'https://example.com/lessons').text,/Pôvodný termín/);
assert.match(scheduleEmail('accepted',when,'https://example.com/lessons').subject,/prijatá/);
assert.match(scheduleEmail('pending',when,'https://example.com/lessons').text,/15:00/);
console.log('PASS: schedule email outcomes and Bratislava timezone');
