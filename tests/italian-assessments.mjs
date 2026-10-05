import assert from 'node:assert/strict';
import { assessmentBank } from '../src/lib/assessment-catalog.ts';
import { scorePlacement } from '../src/lib/placement.ts';
const placement=assessmentBank('it','placement'),progress=assessmentBank('it','progress');
for(const bank of [placement,progress]) {
  assert.equal(bank.language,'Taliančina');assert.equal(bank.voice,'it-IT');
  assert.equal(bank.questions.length,24);assert.equal(new Set(bank.questions.map(q=>q.id)).size,24);
  for(const band of ['A1','A2','B1','B2','C1','C2']) {
    assert.equal(bank.questions.filter(q=>q.band===band).length,4);
    assert.equal(bank.questions.filter(q=>q.band===band&&q.audio).length,1);
  }
  for(const question of bank.questions) {
    assert.equal(question.options.length,4);assert.equal(new Set(question.options).size,4);
    assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<4);
  }
  const perfect=scorePlacement(bank.questions.map(q=>q.answer),bank.questions);
  assert.equal(perfect.recommendation,'C2');assert.equal(perfect.score,24);
  assert.deepEqual(perfect.skillScores,{grammar:12,reading:6,listening:6});
  assert.equal(scorePlacement(bank.questions.map(q=>(q.answer+1)%4),bank.questions).score,0);
  const foundationGap=bank.questions.map(q=>q.band==='A1'?(q.answer+1)%4:q.answer);
  assert.equal(scorePlacement(foundationGap,bank.questions).recommendation,'Začiatočník / preveriť A1');
}
assert.ok(progress.questions.every(q=>placement.questions.every(p=>p.prompt!==q.prompt)));
assert.ok(progress.questions.filter(q=>q.audio).every(q=>placement.questions.every(p=>p.audio!==q.audio)));
assert.notEqual(placement.version,progress.version);
for(const code of ['en','de','es'])assert.notEqual(placement.version,assessmentBank(code,'placement').version);
assert.throws(()=>assessmentBank('ru','placement'));
console.log('PASS: Italian placement/progress separation, all bands/skills, voices, answer structure and foundation-gap scoring');
