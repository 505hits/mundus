import type { Language } from "@/context/LanguageContext";

const choose = (language: Language, sk: string, en: string) => language === "en" ? en : sk;

export function formatLanguage(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language, "Jazyk", "Language");
  const labels: Record<string, [string,string]> = {
    english: ["Angličtina","English"], german: ["Nemčina","German"], spanish: ["Španielčina","Spanish"],
    italian: ["Taliančina","Italian"], french: ["Francúzština","French"], portuguese: ["Portugalčina","Portuguese"],
    russian: ["Ruština","Russian"], hungarian: ["Maďarčina","Hungarian"], polish: ["Poľština","Polish"],
    slovak: ["Slovenčina","Slovak"], chinese: ["Čínština","Chinese"], ukrainian: ["Ukrajinčina","Ukrainian"],
    hebrew: ["Moderná hebrejčina","Modern Hebrew"], modern_hebrew: ["Moderná hebrejčina","Modern Hebrew"],
  };
  const pair = labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value;
}

export function formatLessonType(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language, "Hodina", "Lesson");
  const labels: Record<string,[string,string]> = {
    regular:["Bežná hodina","Regular lesson"], trial:["Úvodná hodina","Intro lesson"],
    individual:["Individuálna hodina","Individual lesson"], group:["Skupinová hodina","Group lesson"],
    conversation:["Konverzácia","Conversation"],
  };
  const pair=labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value.replaceAll("_"," ");
}

export function formatLessonStatus(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language,"Neznámy stav","Unknown status");
  const labels: Record<string,[string,string]> = {
    scheduled:["Naplánovaná","Scheduled"], rescheduled:["Presunutá","Rescheduled"], completed:["Dokončená","Completed"],
    student_no_show:["Študent sa nedostavil","Student no-show"], teacher_cancelled:["Zrušená lektorom","Cancelled by teacher"],
    student_cancelled:["Zrušená študentom","Cancelled by student"], late_cancellation:["Neskoré zrušenie","Late cancellation"],
    cancelled:["Zrušená","Cancelled"], pending:["Čaká na vybavenie","Pending"], accepted:["Schválená","Approved"], declined:["Zamietnutá","Declined"],
  };
  const pair=labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value.replaceAll("_"," ");
}

export function formatPackageStatus(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language,"Neznámy","Unknown");
  const labels: Record<string,[string,string]> = {
    active:["Aktívny","Active"], completed:["Dokončený","Completed"], expired:["Po platnosti","Expired"], cancelled:["Zrušený","Cancelled"],
  };
  const pair=labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value.replaceAll("_"," ");
}

export function formatProgressLabel(value: string | null | undefined, language: Language = "sk") {
  if (!value) return "";
  const labels: Record<string,[string,string]> = {
    "good progress":["Dobrý pokrok","Good progress"], good_progress:["Dobrý pokrok","Good progress"],
    "normal progress":["Bežný pokrok","Normal progress"], normal_progress:["Bežný pokrok","Normal progress"],
    "needs attention":["Vyžaduje pozornosť","Needs attention"], needs_attention:["Vyžaduje pozornosť","Needs attention"],
    improving:["Zlepšuje sa","Improving"], stable:["Stabilný pokrok","Stable progress"],
  };
  const pair=labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value;
}

export function formatProfileStatus(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language,"Neznámy stav","Unknown status");
  const labels: Record<string,[string,string]> = {
    active:["Aktívny","Active"], pending:["Čaká na schválenie","Pending approval"],
    inactive:["Neaktívny","Inactive"], suspended:["Pozastavený","Suspended"],
  };
  const pair=labels[value.trim().toLowerCase()];
  return pair ? choose(language,pair[0],pair[1]) : value.replaceAll("_"," ");
}

export function formatPackageType(value: string | null | undefined, language: Language = "sk") {
  if (!value) return choose(language,"Balíček hodín","Lesson package");
  const normalized=value.trim().toLowerCase();
  const direct: Record<string,[string,string]> = {
    "1_lesson":["1 hodina","1 lesson"], "5_lessons":["Balíček 5 hodín","5-lesson package"],
    "10_lessons":["Balíček 10 hodín","10-lesson package"], "20_lessons":["Balíček 20 hodín","20-lesson package"],
    "30_lessons":["Balíček 30 hodín","30-lesson package"],
  };
  const pair=direct[normalized];
  if(pair) return choose(language,pair[0],pair[1]);
  const match=normalized.match(/^(\d+)[_-]?(?:lessons?|hours?)$/);
  if(match) return language==="en" ? `${match[1]}-lesson package` : `Balíček ${match[1]} hodín`;
  return value.replaceAll("_"," ");
}

export function formatLessonCount(count:number, language: Language = "sk") {
  if(language==="en") return `${count} ${Math.abs(count)===1?"lesson":"lessons"}`;
  const absolute=Math.abs(count);
  if(absolute===1) return `${count} hodina`;
  if(absolute>=2&&absolute<=4) return `${count} hodiny`;
  return `${count} hodín`;
}
