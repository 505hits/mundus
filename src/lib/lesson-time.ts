const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Bratislava",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localTimestamp(date: Date) {
  const parts = Object.fromEntries(formatter.formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, Number(part.value)]));
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

// Invalid, skipped and repeated clock-change times must not silently move a lesson.
export function bratislavaLocalToUtc(value: string): Date {
  const invalid = new Date(NaN);
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return invalid;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  if (year < 1900 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return invalid;
  const local = Date.UTC(year, month - 1, day, hour, minute);
  const calendar = new Date(local);
  if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return invalid;

  // Sample both sides of a transition, then round-trip each candidate to the typed time.
  const offsets = new Set<number>();
  for (const hours of [-36, 0, 36]) {
    const timestamp = local + hours * 60 * 60 * 1000;
    offsets.add(localTimestamp(new Date(timestamp)) - timestamp);
  }
  const candidates = [...offsets].map((offset) => local - offset)
    .filter((timestamp) => localTimestamp(new Date(timestamp)) === local);
  return candidates.length === 1 ? new Date(candidates[0]) : invalid;
}

export const INVALID_LESSON_TIME = "Zvoľte platný dátum a jednoznačný čas v pásme Bratislava. Pri zmene času vyberte termín mimo opakovanej alebo preskočenej hodiny.";
