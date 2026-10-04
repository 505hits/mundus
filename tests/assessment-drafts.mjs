import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assessmentBank} from '../src/lib/assessment-catalog.ts';
for(const code of ['ru','tr']) {
 assert.throws(()=>assessmentBank(code,'placement'),/Unsupported language/);
 assert.throws(()=>assessmentBank(code,'progress'),/Unsupported language/);
 const banks=['placement','progress'].map(kind=>JSON.parse(readFileSync(new URL(`../docs/assessment-review/${code}-${kind}-draft.json`,import.meta.url),'utf8')));
 for(const bank of banks) {
  assert.equal(bank.status,'draft_not_live');assert.equal(bank.teacher_review_required,true);assert.equal(bank.calibrated,false);
  const q=bank.questions;assert.equal(q.length,24);assert.equal(new Set(q.map(x=>x.id)).size,24);
  for(const band of ['A1','A2','B1','B2','C1','C2'])assert.deepEqual(q.filter(x=>x.band===band).map(x=>x.skill),['grammar','grammar','reading','listening']);
  for(const x of q){assert.equal(new Set(x.options).size,4);assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4);assert.equal(Boolean(x.audio),x.skill==='listening');}
 }
 for(const x of banks[1].questions)assert.ok(banks[0].questions.every(y=>y.prompt!==x.prompt&&(!x.audio||x.audio!==y.audio)));
}
console.log('PASS: Russian/Turkish draft structure, provisional review status and distinct placement/progress prompts/audio; not linguistic validation');
