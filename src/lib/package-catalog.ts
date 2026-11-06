export const PACKAGE_LESSONS = [1, 5, 10, 20, 30] as const;
export const PACKAGE_DURATIONS = [45, 60] as const;

export type PackageLessons = typeof PACKAGE_LESSONS[number];
export type PackageDuration = typeof PACKAGE_DURATIONS[number];

const SIXTY_MINUTE_PRICES: Record<PackageLessons, number> = {
  1: 2800,
  5: 13500,
  10: 26000,
  20: 49000,
  30: 70500,
};

export function packageAmountCents(lessons: PackageLessons, durationMinutes: PackageDuration) {
  const sixtyMinuteAmount = SIXTY_MINUTE_PRICES[lessons];
  return durationMinutes === 60
    ? sixtyMinuteAmount
    : Math.round(sixtyMinuteAmount * 0.75);
}

export function firstPackageAmountCents(amountCents: number) {
  return Math.round(amountCents * 0.9);
}

export const PACKAGE_PRICES = PACKAGE_DURATIONS.flatMap((durationMinutes) =>
  PACKAGE_LESSONS.map((lessons) => ({
    lessons,
    durationMinutes,
    amountCents: packageAmountCents(lessons, durationMinutes),
  })),
);
