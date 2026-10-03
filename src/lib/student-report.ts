// Matches the explicitly shared fields of student_lesson_reports().
export type StudentLessonReport = {
  id: string;
  lesson_id: string;
  topic: string | null;
  progress: string | null;
  student_note: string | null;
  homework: string | null;
  next_focus: string | null;
  updated_at: string;
};
