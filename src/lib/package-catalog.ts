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

const FORTY_FIVE_MINUTE_PRICES: Record<PackageLessons, number> = {
  1: 2400,
  5: 11500,
  10: 22000,
  20: 41500,
  30: 59500,
};

export function packageAmountCents(lessons: PackageLessons, durationMinutes: PackageDuration) {
  return durationMinutes === 60
    ? SIXTY_MINUTE_PRICES[lessons]
    : FORTY_FIVE_MINUTE_PRICES[lessons];
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
