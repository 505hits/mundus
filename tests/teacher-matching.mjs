import assert from "node:assert/strict";
import { teacherMatchScore, canonicalLanguage } from "../src/lib/teacher-matching.ts";

assert.equal(canonicalLanguage("Nemčina"),"German");
const student={language:"Nemčina",level:"B2",preferred_days:["2","4"],preferred_time_from:"17:00",preferred_time_to:"20:00"};
const strong={teacher_id:"t1",accepting_students:true,languages:["German"],levels:["B1","B2"],days:["2"],time_from:"16:00",time_to:"19:00",max_new_students:3};
const weak={...strong,teacher_id:"t2",levels:["A1"],days:["1"],time_from:"08:00",time_to:"10:00"};
assert.ok(teacherMatchScore(student,strong,1)?.score>0);
assert.equal(teacherMatchScore(student,weak,1),null);
assert.equal(teacherMatchScore(student,{...strong,languages:["English"]},0),null);
assert.equal(teacherMatchScore(student,{...strong,accepting_students:false},0),null);
assert.equal(teacherMatchScore(student,strong,3),null);
console.log("PASS: teacher recommendations prioritize language, level, time, day and capacity");
