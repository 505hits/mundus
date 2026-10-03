import assert from 'node:assert/strict';
import { PLACEMENT_QUESTIONS as questions, scorePlacement } from '../src/lib/placement.ts';
const correct = questions.map(q => q.answer);
assert.equal(questions.length,24);
assert.equal(new Set(questions.map(q=>q.id)).size,24);
for(const band of ['A1','A2','B1','B2','C1','C2']) {
 assert.equal(questions.filter(q=>q.band===band).length,4);
 assert.equal(questions.filter(q=>q.band===band && q.audio).length,1);
}
assert.equal(scorePlacement(correct).recommendation,'C2');
assert.deepEqual(scorePlacement(correct).skillScores,{grammar:12,reading:6,listening:6});
const wrong=questions.map(q=>(q.answer+1)%q.options.length);
assert.equal(scorePlacement(wrong).score,0);
assert.equal(scorePlacement(wrong).recommendation,'Začiatočník / preveriť A1');
const gap=correct.map((a,i)=>questions[i].band==='A2'?(a+1)%4:a);
assert.equal(scorePlacement(gap).recommendation,'A1','upper-level answers do not erase a foundation gap');
assert.throws(()=>scorePlacement([]));
assert.throws(()=>scorePlacement(correct.map((a,i)=>i===0?-1:a)));
assert.throws(()=>scorePlacement(correct.map((a,i)=>i===0?4:a)));
assert.throws(()=>scorePlacement(correct.map((a,i)=>i===0?'1':a)));
console.log('PASS: all six bands, skill scores, foundation gaps and invalid answers');
