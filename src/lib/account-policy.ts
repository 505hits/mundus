export const STUDENT_LANGUAGES = ["Angličtina", "Nemčina", "Španielčina", "Taliančina", "Francúzština", "Portugalčina", "Ruština", "Turečtina"] as const;
export const STUDENT_LEVELS = ["Neviem posúdiť", "Úplný začiatočník", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type AccountFormState = { error?: string; success?: string };

export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validPassword(value: string) {
  return value.length >= 10 && value.length <= 128;
}

export function canAcceptTeacherInvitation(metadata: Record<string, unknown>, now = Date.now()) {
  return metadata.mundus_invited_role === "teacher" &&
    typeof metadata.mundus_invitation_expires_at === "string" &&
    Date.parse(metadata.mundus_invitation_expires_at) > now &&
    !metadata.mundus_invitation_accepted_at;
}

export function portalDestination(role: unknown, status: unknown) {
  if (role === "teacher" && status === "pending") return "/set-password";
  if (status !== "active") return "/auth/error";
  if (role === "admin") return "/admin/dashboard";
  if (role === "teacher") return "/teacher/dashboard";
  if (role === "student") return "/dashboard";
  return "/auth/error";
}
