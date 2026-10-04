import 'server-only';
import ruPlacement from '../../docs/assessment-review/ru-placement-draft.json';
import ruProgress from '../../docs/assessment-review/ru-progress-draft.json';
import trPlacement from '../../docs/assessment-review/tr-placement-draft.json';
import trProgress from '../../docs/assessment-review/tr-progress-draft.json';
import {validateAssessmentDraft} from './assessment-draft-validation';
// Review preparation only. Never used by assessmentBank or student submission actions.
export function stagedAssessmentBank(code:'ru'|'tr',kind:'placement'|'progress') {
 if(!['ru','tr'].includes(code)||!['placement','progress'].includes(kind))throw Error('Unsupported review bank');
 const raw=code==='ru'?(kind==='placement'?ruPlacement:ruProgress):(kind==='placement'?trPlacement:trProgress);
 return {code,kind,enabled:false as const,reviewRequired:true as const,
  language:code==='ru'?'Ruština':'Turečtina',voice:code==='ru'?'ru-RU':'tr-TR',
  version:`${code}-${kind}-draft-1`,questions:validateAssessmentDraft(raw)};
}
