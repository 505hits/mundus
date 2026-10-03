export type LessonCreation = {
  id: string;
  student_id: string;
  teacher_id: string;
  package_id: string;
  scheduled_at: string;
  duration_minutes: number;
  language: string;
  lesson_type: string;
  meet_link: string | null;
};

function sameCreation(saved: LessonCreation, expected: LessonCreation) {
  const keys = ["id", "student_id", "teacher_id", "package_id", "duration_minutes", "language", "lesson_type", "meet_link"] as const;
  return keys.every(key => saved[key] === expected[key]) &&
    Number.isFinite(Date.parse(expected.scheduled_at)) &&
    Date.parse(saved.scheduled_at) === Date.parse(expected.scheduled_at);
}

// A stable primary key lets a retry recover an insert whose response was lost.
// Never upsert: an existing lesson must not be overwritten by a retry.
export async function createLessonOnce(
  expected: LessonCreation,
  read: () => Promise<LessonCreation | null>,
  insert: () => Promise<void>,
) {
  const existing = await read();
  if (existing) {
    if (!sameCreation(existing, expected)) throw new Error("Lesson creation conflict");
    return;
  }
  try {
    await insert();
  } catch (error) {
    let saved: LessonCreation | null = null;
    try { saved = await read(); } catch { /* Retain the original save error. */ }
    if (saved && sameCreation(saved, expected)) return;
    throw error;
  }
}
