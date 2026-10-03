import type {AssessmentQuestion} from "./placement.ts";
import {PLACEMENT_QUESTIONS,PLACEMENT_VERSION} from "./placement.ts";
import {PROGRESS_QUESTIONS,PROGRESS_VERSION} from "./progress-assessment.ts";
import {GERMAN_PLACEMENT,GERMAN_PROGRESS} from "./german-assessments.ts";
import { SPANISH_PLACEMENT, SPANISH_PROGRESS } from "./spanish-assessments.ts";
import { ITALIAN_PLACEMENT, ITALIAN_PROGRESS } from "./italian-assessments.ts";
export function assessmentBank(code:unknown,kind:"placement"|"progress"): {code:string;language:string;voice:string;version:string;questions:readonly AssessmentQuestion[]} {
 if(code==="it")return {code:"it",language:"Taliančina",voice:"it-IT",version:kind==="placement"?"italian-placement-1":"italian-progress-1",questions:kind==="placement"?ITALIAN_PLACEMENT:ITALIAN_PROGRESS};
 if(code==="es")return {code:"es",language:"Španielčina",voice:"es-ES",version:kind==="placement"?"spanish-placement-1":"spanish-progress-1",questions:kind==="placement"?SPANISH_PLACEMENT:SPANISH_PROGRESS};
 if(code==="de")return {code:"de",language:"Nemčina",voice:"de-DE",version:kind==="placement"?"german-placement-1":"german-progress-1",questions:kind==="placement"?GERMAN_PLACEMENT:GERMAN_PROGRESS};
 if(code!=="en")throw new Error("Unsupported language");
 return {code:"en",language:"Angličtina",voice:"en-GB",version:kind==="placement"?PLACEMENT_VERSION:PROGRESS_VERSION,questions:kind==="placement"?PLACEMENT_QUESTIONS:PROGRESS_QUESTIONS};
}
