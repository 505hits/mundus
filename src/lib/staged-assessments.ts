import 'server-only';
import ruPlacement from '../../docs/assessment-review/ru-placement-draft.json';
import ruProgress from '../../docs/assessment-review/ru-progress-draft.json';
import {validateAssessmentDraft} from './assessment-draft-validation';
// Review preparation only. Never used by assessmentBank or student submission actions.
export function stagedAssessmentBank(code:'ru',kind:'placement'|'progress') {
 if(code!=='ru'||!['placement','progress'].includes(kind))throw Error('Unsupported review bank');
 const raw=kind==='placement'?ruPlacement:ruProgress;
 return {code,kind,enabled:false as const,reviewRequired:true as const,
  language:'Ruština',voice:'ru-RU',
  version:`${code}-${kind}-draft-1`,questions:validateAssessmentDraft(raw)};
}
