// Reuse a stable ID and recover only a matching saved request.
export async function createRequestOnce(confirm: () => Promise<boolean>, insert: () => Promise<void>) {
  if (await confirm()) return;
  try { await insert(); } catch (error) {
    if (!await confirm()) throw error;
  }
}
