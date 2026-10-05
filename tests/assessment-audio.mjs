import assert from "node:assert/strict";
import { createAssessmentAudioPlayer } from "../src/lib/assessment-audio.ts";
const clips=[]; let completed=0, errors=0, latest=null;
const german={lang:"de-DE"}, english={lang:"en-GB"};
const engine={
  cancel(){ latest?.onend?.(); }, // Some implementations deliver a late completion on cancellation.
  getVoices(){return [english,german];},
  speak(clip){latest=clip; clips.push(clip);},
};
const player=createAssessmentAudioPlayer(engine,(text)=>({text}));
const complete=()=>completed++,failed=()=>errors++;
player.play("First", "de-DE", complete, failed);
assert.equal(clips[0].voice,german);assert.equal(clips[0].rate,0.9);
player.play("Second", "en-US", complete, failed);
assert.equal(completed,0,"cancelled clip cannot complete listening");
assert.equal(clips[1].voice,english,"select same-language regional fallback");
clips[0].onend();clips[0].onerror({error:"network"});
assert.equal(completed,0);assert.equal(errors,0,"old callbacks cannot replace current feedback");
clips[1].onerror({error:"interrupted"});assert.equal(errors,0);
clips[1].onend();assert.equal(completed,0,"interrupted clip cannot complete later");
player.play("Third", "de-DE", complete, failed);clips[2].onend();clips[2].onend();assert.equal(completed,1,"completion is counted once");
player.play("Fourth", "de-DE", complete, failed);player.stop();clips[3].onend();assert.equal(completed,1,"unmount/stop cannot complete listening");
const broken=createAssessmentAudioPlayer({...engine,speak(){throw Error("Unavailable");}},()=>({}));
broken.play("Text","de-DE",complete,failed);assert.equal(errors,1,"synchronous playback failure gets retry feedback");
console.log("PASS: cancelled/stale audio callbacks, complete listening, matching voices, stop cleanup and playback failures");
