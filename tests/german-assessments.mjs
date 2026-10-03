import assert from 'node:assert/strict';
import {assessmentBank} from '../src/lib/assessment-catalog.ts';
import {scorePlacement} from '../src/lib/placement.ts';
const initial=assessmentBank('de','placement'),progress=assessmentBank('de','progress');
for(const bank of [initial,progress]) {
 assert.equal(bank.language,'Nemčina');assert.equal(bank.voice,'de-DE');assert.equal(bank.questions.length,24);
 assert.equal(new Set(bank.questions.map(q=>q.id)).size,24);
 for(const band of ['A1','A2','B1','B2','C1','C2']){assert.equal(bank.questions.filter(q=>q.band===band).length,4);assert.equal(bank.questions.filter(q=>q.band===band&&q.audio).length,1);}
 assert.equal(scorePlacement(bank.questions.map(q=>q.answer),bank.questions).recommendation,'C2');
 assert.deepEqual(scorePlacement(bank.questions.map(q=>q.answer),bank.questions).skillScores,{grammar:12,reading:6,listening:6});
 assert.equal(scorePlacement(bank.questions.map(q=>(q.answer+1)%4),bank.questions).score,0);
}
assert.ok(progress.questions.every(q=>initial.questions.every(p=>p.prompt!==q.prompt)));
assert.notEqual(initial.version,progress.version);assert.notEqual(initial.version,assessmentBank('en','placement').version);
assert.throws(()=>assessmentBank('fr','placement'));assert.throws(()=>assessmentBank(null,'placement'));
console.log('PASS: separate German placement/progress banks, all levels, native-language voice and unsupported language rejection');
