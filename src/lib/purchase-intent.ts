export const PACKAGE_LESSONS = [1, 5, 10, 20, 30] as const;
export const PACKAGE_DURATIONS = [45, 60] as const;

// Only this internal route may survive login or an email confirmation link.
export function purchaseReturnPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^\/packages\?selected=(1|5|10|20|30)&duration=(45|60)$/.exec(value);
  return match ? `/packages?selected=${match[1]}&duration=${match[2]}` : null;
}
