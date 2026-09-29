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
    turkish: "Turečtina",
    slovak: "Slovenčina",
    chinese: "Čínština",
    ukrainian: "Ukrajinčina",
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
    expired: "Expirovaný",
    cancelled: "Zrušený",
  };

  return labels[value.trim().toLowerCase()] || value.replaceAll("_", " ");
}


export function formatProgressLabel(value: string | null | undefined) {
  if (!value) return "";

  const labels: Record<string, string> = {
    "good progress": "Dobrý pokrok",
    "normal progress": "Bežný pokrok",
    "needs attention": "Vyžaduje pozornosť",
    "improving": "Zlepšuje sa",
    "stable": "Stabilný pokrok",
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
