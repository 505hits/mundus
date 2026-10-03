import type {AssessmentQuestion} from "./placement.ts";
import {PLACEMENT_QUESTIONS,PLACEMENT_VERSION} from "./placement.ts";
import {PROGRESS_QUESTIONS,PROGRESS_VERSION} from "./progress-assessment.ts";
import {GERMAN_PLACEMENT,GERMAN_PROGRESS} from "./german-assessments.ts";
import { SPANISH_PLACEMENT, SPANISH_PROGRESS } from "./spanish-assessments.ts";
export function assessmentBank(code:unknown,kind:"placement"|"progress"): {code:string;language:string;voice:string;version:string;questions:readonly AssessmentQuestion[]} {
 if(code==="es")return {code:"es",language:"Španielčina",voice:"es-ES",version:kind==="placement"?"spanish-placement-1":"spanish-progress-1",questions:kind==="placement"?SPANISH_PLACEMENT:SPANISH_PROGRESS};
 if(code==="de")return {code:"de",language:"Nemčina",voice:"de-DE",version:kind==="placement"?"german-placement-1":"german-progress-1",questions:kind==="placement"?GERMAN_PLACEMENT:GERMAN_PROGRESS};
 if(code!=="en")throw new Error("Unsupported language");
 return {code:"en",language:"Angličtina",voice:"en-GB",version:kind==="placement"?PLACEMENT_VERSION:PROGRESS_VERSION,questions:kind==="placement"?PLACEMENT_QUESTIONS:PROGRESS_QUESTIONS};
}
