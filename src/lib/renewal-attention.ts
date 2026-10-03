type Student = { id: string; full_name?: string | null; email?: string | null };
type Package = { student_id: string; status: string; remaining_lessons: number | null };

// Renewals are per student: an exhausted old package must not outweigh a renewal.
export function renewalAttention(students: readonly Student[], packages: readonly Package[]) {
  return students.flatMap(student => {
    const own = packages.filter(pkg => pkg.student_id === student.id);
    const active = own.filter(pkg => pkg.status === "active");
    if (active.some(pkg => pkg.remaining_lessons === null || !Number.isInteger(pkg.remaining_lessons) || pkg.remaining_lessons! < 0)) return [];
    const remaining = active.reduce((sum, pkg) => sum + pkg.remaining_lessons!, 0);
    const hasExhausted = own.some(pkg => ["active", "completed"].includes(pkg.status) && pkg.remaining_lessons === 0);
    if (remaining > 2 || (remaining === 0 && !hasExhausted)) return [];
    return [{ ...student, remaining }];
  }).sort((a,b) => a.remaining - b.remaining || (a.full_name || a.email || a.id).localeCompare(b.full_name || b.email || b.id, "sk"));
}
