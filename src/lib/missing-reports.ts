type Lesson = {id:string;status:string;scheduled_at:string};
export function missingLessonReports<T extends Lesson>(lessons:readonly T[],reports:readonly {lesson_id:string}[],now:number) {
 const reported=new Set(reports.map(report=>report.lesson_id));
 return lessons.filter(lesson=>lesson.status==='completed'&&Number.isFinite(Date.parse(lesson.scheduled_at))&&Date.parse(lesson.scheduled_at)<=now&&!reported.has(lesson.id));
}
