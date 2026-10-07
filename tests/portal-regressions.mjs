import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const lessons = read("src/app/(portal)/lessons/page.tsx");
assert.match(lessons, /\{formatLanguage\(lesson\.language, language\)\} · \{sk \? "hodina" : "lesson"\}/);
assert.match(lessons, /role="alert" aria-live="polite"/);

const learning = read("src/app/(portal)/learning/page.tsx");
assert.ok(learning.indexOf("<header") < learning.indexOf("<LearningFiles"), "learning files must render below the page header");

const progress = read("src/app/(portal)/progress/page.tsx");
assert.match(progress, /role="progressbar"/);
assert.match(progress, /aria-valuenow=\{packageProgress\}/);

const feedback = read("src/app/(portal)/feedback/page.tsx");
assert.doesNotMatch(feedback, /throw new Error\("Monthly teacher feedback is unavailable"\)/);
assert.match(feedback, /Teacher feedback could not be loaded right now/);

const teacherReports = read("src/app/(teacher)/teacher/reports/page.tsx");
assert.doesNotMatch(teacherReports, /throw new Error\("Teacher lesson reports are unavailable"\)/);
assert.match(teacherReports, /role="alert" aria-live="polite"/);

const lessonStatus = read("src/app/(teacher)/teacher/schedule/LessonStatusActions.tsx");
assert.match(lessonStatus, /aria-label=\{sk \? "Stav hodiny" : "Lesson status"\}/);

const assessment = read("src/app/(portal)/level-test/TestForm.tsx");
assert.match(assessment, /const audioQuestions = questions\.filter\(q => q\.audio\)/);
assert.match(assessment, /\$\{audioQuestions\.length\}/);
assert.doesNotMatch(assessment, /all six audio samples|všetkých šesť zvukových/);

const studentAdmin = read("src/app/(admin)/admin/students/StudentStatusAction.tsx");
const teacherAdmin = read("src/app/(admin)/admin/teachers/TeacherApprovalAction.tsx");
assert.match(studentAdmin, /role="alert"/);
assert.match(teacherAdmin, /role="alert"/);

const notFound = read("src/app/not-found.tsx");
assert.match(notFound, /We couldn’t find this page/);
assert.match(notFound, /Túto stránku sme nenašli/);

console.log("PASS: portal regression safeguards");
