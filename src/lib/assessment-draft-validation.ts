import type { AssessmentQuestion } from './placement.ts';
export function validateAssessmentDraft(value: unknown): readonly AssessmentQuestion[] {
  const draft=value as {status?:unknown;teacher_review_required?:unknown;calibrated?:unknown;questions?:unknown};
  if(draft?.status!=='draft_not_live'||draft.teacher_review_required!==true||draft.calibrated!==false||!Array.isArray(draft.questions)||draft.questions.length!==24)throw Error('Invalid review draft');
  const seen=new Set<string>();
  const bands=['A1','A2','B1','B2','C1','C2'];
  const skills=['grammar','grammar','reading','listening'];
  for(const [index,q] of draft.questions.entries()) {
    if(!q||typeof q.id!=='string'||q.id!==`${bands[Math.floor(index/4)].toLowerCase()}-${index%4+1}`||seen.has(q.id)||q.band!==bands[Math.floor(index/4)]||q.skill!==skills[index%4]
      ||typeof q.prompt!=='string'||!q.prompt.trim()||!Array.isArray(q.options)||q.options.length!==4
      ||q.options.some((x:unknown)=>typeof x!=='string'||!x.trim())||new Set(q.options).size!==4
      ||!Number.isInteger(q.answer)||q.answer<0||q.answer>3
      ||(q.skill==='listening'?(typeof q.audio!=='string'||!q.audio.trim()):q.audio!==undefined))throw Error('Invalid review question');
    seen.add(q.id);
  }
  return draft.questions as readonly AssessmentQuestion[];
}
