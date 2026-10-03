type Student = { id:string;full_name?:string|null;email?:string|null };
type Record = {student_id:string;status:string;next_followup:string|null;last_contact:string|null;note:string;updated_at:string};
export function followupQueue(students:readonly Student[],records:readonly Record[],today:string) {
 return records.flatMap(record=>{
  const student=students.find(student=>student.id===record.student_id);
  if(!student||record.status==='closed')return [];
  return [{student,record,due:!!record.next_followup&&record.next_followup<=today}];
 }).sort((a,b)=>(a.record.next_followup||'9999-12-31').localeCompare(b.record.next_followup||'9999-12-31') || (a.student.full_name||a.student.id).localeCompare(b.student.full_name||b.student.id,'sk'));
}
