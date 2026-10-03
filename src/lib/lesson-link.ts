// Permit provider-independent HTTPS meeting links without embedded credentials.
export function safeLessonLink(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim();
  if (!/^https:\/\//i.test(trimmed) || /[\s\\\u0000-\u001f\u007f]/.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
