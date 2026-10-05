export class ScheduleResponseError extends Error {}

export type ScheduleDecision = "accepted" | "declined";

// Recover a committed response without updating an already resolved request.
export async function confirmScheduleResponse(
  decision: ScheduleDecision,
  update: () => Promise<boolean>,
  read: () => Promise<string | null>,
) {
  let failure: unknown;
  try { if (await update()) return; } catch (error) { failure = error; }
  try {
    const current = await read();
    if (current === decision) return;
    if (current === "accepted" || current === "declined") {
      throw new ScheduleResponseError("Žiadosť už má inú odpoveď. Obnovte stránku a skontrolujte rozvrh.");
    }
  } catch (error) { throw error; }
  throw failure || new ScheduleResponseError("Odpoveď sa nepodarilo potvrdiť. Skontrolujte rozvrh a skúste znova.");
}
