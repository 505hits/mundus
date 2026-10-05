import { MUNDUS_LANGUAGE_OPTIONS } from "./language-offer.ts";

export type StudentMatchInput = {
  language: string;
  level: string;
  preferred_days?: string[] | null;
  preferred_time_from?: string | null;
  preferred_time_to?: string | null;
};

export type TeacherMatchInput = {
  teacher_id: string;
  accepting_students: boolean;
  languages: string[];
  levels: string[];
  days: string[];
  time_from?: string | null;
  time_to?: string | null;
  max_new_students: number;
};

const levelMap: Record<string, string | null> = {
  "Neviem posúdiť": null,
  "Úplný začiatočník": "A1",
  A1: "A1", A2: "A2", B1: "B1", B2: "B2", C1: "C1", C2: "C2",
};

export function canonicalLanguage(label: string) {
  return MUNDUS_LANGUAGE_OPTIONS.find((item) => item.label === label || item.value === label)?.value ?? label;
}

function minutes(value?: string | null) {
  if (!value) return null;
  const match=/^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return null;
  return Number(match[1])*60+Number(match[2]);
}

export function teacherMatchScore(student: StudentMatchInput, teacher: TeacherMatchInput, assignedStudents = 0) {
  if (!teacher.accepting_students || teacher.max_new_students <= assignedStudents) return null;
  const language=canonicalLanguage(student.language);
  if (!teacher.languages.includes(language)) return null;

  let score=60;
  const reasons=["jazyk"];
  const desiredLevel=levelMap[student.level] ?? null;
  if (desiredLevel && teacher.levels.length && !teacher.levels.includes(desiredLevel)) return null;
  score+=20;
  reasons.push(desiredLevel ? "úroveň" : "flexibilná úroveň");

  const wantedDays=student.preferred_days ?? [];
  if (!wantedDays.length) {
    score+=5;
  } else if (teacher.days.some(day=>wantedDays.includes(day))) {
    score+=10;
    reasons.push("deň");
  }

  const studentFrom=minutes(student.preferred_time_from), studentTo=minutes(student.preferred_time_to);
  const teacherFrom=minutes(teacher.time_from), teacherTo=minutes(teacher.time_to);
  if (studentFrom==null || studentTo==null) {
    score+=5;
  } else if (teacherFrom!=null && teacherTo!=null && Math.max(studentFrom,teacherFrom)<Math.min(studentTo,teacherTo)) {
    score+=10;
    reasons.push("čas");
  }

  const free=Math.max(0,teacher.max_new_students-assignedStudents);
  score+=Math.min(5,free);
  return { score, reasons, freeCapacity: free };
}
