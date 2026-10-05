import assert from 'node:assert/strict';
import { PLACEMENT_QUESTIONS,scorePlacement } from '../src/lib/placement.ts';
import { PROGRESS_QUESTIONS as questions } from '../src/lib/progress-assessment.ts';
assert.equal(questions.length,24);
for(const q of questions){assert.ok(!PLACEMENT_QUESTIONS.some(p=>p.prompt===q.prompt));assert.equal(q.options.length,4);assert.ok(q.answer>=0 && q.answer<4);}
for(const band of ['A1','A2','B1','B2','C1','C2'])assert.equal(questions.filter(q=>q.band===band).length,4);
assert.equal(questions.filter(q=>q.audio).length,6);
assert.equal(scorePlacement(questions.map(q=>q.answer),questions).recommendation,'C2');
assert.equal(scorePlacement(questions.map(q=>(q.answer+1)%4),questions).score,0);
assert.deepEqual(scorePlacement(questions.map(q=>q.answer),questions).skillScores,{grammar:12,reading:6,listening:6});
console.log('PASS: distinct progress questions, all levels, listening and server scoring');
