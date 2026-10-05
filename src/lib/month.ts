export const BRATISLAVA_TIME_ZONE = "Europe/Bratislava";

function offsetMinutesAt(date: Date) {
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: BRATISLAVA_TIME_ZONE,
    timeZoneName: "longOffset",
  }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";
  const match = zone.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

function bratislavaMonthStartUtc(year: number, month: number) {
  const utcGuess = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  return new Date(utcGuess.getTime() - offsetMinutesAt(utcGuess) * 60_000);
}

export function currentBratislavaMonth() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BRATISLAVA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const key = `${year}-${String(month).padStart(2, "0")}-01`;
  const start = bratislavaMonthStartUtc(year, month);
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const end = bratislavaMonthStartUtc(nextYear, nextMonth);
  return { key, year, month, start: start.toISOString(), end: end.toISOString() };
}
