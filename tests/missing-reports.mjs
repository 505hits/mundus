import assert from 'node:assert/strict';
import { missingLessonReports } from '../src/lib/missing-reports.ts';
const lesson=(id,status='completed',scheduled_at='2026-10-01T10:00:00Z')=>({id,status,scheduled_at});
const rows=[lesson('missing'),lesson('saved'),lesson('cancelled','teacher_cancelled'),lesson('upcoming','scheduled'),lesson('future','completed','2026-10-05T10:00:00Z'),lesson('invalid','completed','bad')];
assert.deepEqual(missingLessonReports(rows,[{lesson_id:'saved'},{lesson_id:'unrelated'}],Date.parse('2026-10-04T00:00:00Z')).map(x=>x.id),['missing']);
assert.deepEqual(missingLessonReports(rows,[{lesson_id:'saved'},{lesson_id:'missing'}],Date.parse('2026-10-04T00:00:00Z')),[]);
console.log('PASS: missing reports use completed elapsed lessons, saved report IDs and valid dates');
