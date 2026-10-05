export function formatLanguage(value: string | null | undefined) {
  if (!value) return "Jazyk";

  const labels: Record<string, string> = {
    english: "Angličtina",
    german: "Nemčina",
    spanish: "Španielčina",
    italian: "Taliančina",
    french: "Francúzština",
    portuguese: "Portugalčina",
    russian: "Ruština",
    hungarian: "Maďarčina",
    polish: "Poľština",
    slovak: "Slovenčina",
    chinese: "Čínština",
    ukrainian: "Ukrajinčina",
    hebrew: "Moderná hebrejčina",
    modern_hebrew: "Moderná hebrejčina",
  };

  return labels[value.trim().toLowerCase()] || value;
}

export function formatLessonType(value: string | null | undefined) {
  if (!value) return "Hodina";

  const labels: Record<string, string> = {
    regular: "Bežná hodina",
    trial: "Úvodná hodina",
    individual: "Individuálna hodina",
    group: "Skupinová hodina",
    conversation: "Konverzácia",
  };

  return labels[value.trim().toLowerCase()] || value.replaceAll("_", " ");
}

export function formatLessonStatus(value: string | null | undefined) {
  if (!value) return "Neznámy stav";

  const labels: Record<string, string> = {
    scheduled: "Naplánovaná",
    rescheduled: "Presunutá",
    completed: "Dokončená",
    student_no_show: "Študent sa nedostavil",
    teacher_cancelled: "Zrušená lektorom",
    student_cancelled: "Zrušená študentom",
    late_cancellation: "Neskoré zrušenie",
    cancelled: "Zrušená",
    pending: "Čaká na vybavenie",
    accepted: "Schválená",
    declined: "Zamietnutá",
  };

  return labels[value.trim().toLowerCase()] || value.replaceAll("_", " ");
}

export function formatPackageStatus(value: string | null | undefined) {
  if (!value) return "Neznámy";

  const labels: Record<string, string> = {
    active: "Aktívny",
    completed: "Dokončený",
    expired: "Po platnosti",
    cancelled: "Zrušený",
  };

  return labels[value.trim().toLowerCase()] || value.replaceAll("_", " ");
}


export function formatProgressLabel(value: string | null | undefined) {
  if (!value) return "";

  const labels: Record<string, string> = {
    "good progress": "Dobrý pokrok",
    good_progress: "Dobrý pokrok",
    "normal progress": "Bežný pokrok",
    normal_progress: "Bežný pokrok",
    "needs attention": "Vyžaduje pozornosť",
    needs_attention: "Vyžaduje pozornosť",
    improving: "Zlepšuje sa",
    stable: "Stabilný pokrok",
  };

  return labels[value.trim().toLowerCase()] || value;
}


export function formatProfileStatus(value: string | null | undefined) {
  if (!value) return "Neznámy stav";

  const labels: Record<string, string> = {
    active: "Aktívny",
    pending: "Čaká na schválenie",
    inactive: "Neaktívny",
    suspended: "Pozastavený",
  };

  return labels[value.trim().toLowerCase()] || value.replaceAll("_", " ");
}

export function formatPackageType(value: string | null | undefined) {
  if (!value) return "Balíček hodín";

  const normalized = value.trim().toLowerCase();
  const direct: Record<string, string> = {
    "1_lesson": "1 hodina",
    "5_lessons": "Balíček 5 hodín",
    "10_lessons": "Balíček 10 hodín",
    "20_lessons": "Balíček 20 hodín",
    "30_lessons": "Balíček 30 hodín",
  };

  if (direct[normalized]) return direct[normalized];

  const lessonMatch = normalized.match(/^(\d+)[_-]?(?:lessons?|hours?)$/);
  if (lessonMatch) return `Balíček ${lessonMatch[1]} hodín`;

  return value.replaceAll("_", " ");
}


export function formatLessonCount(count: number) {
  const absolute = Math.abs(count);
  if (absolute === 1) return `${count} hodina`;
  if (absolute >= 2 && absolute <= 4) return `${count} hodiny`;
  return `${count} hodín`;
}
