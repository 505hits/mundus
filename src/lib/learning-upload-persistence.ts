// A failed response may follow a committed metadata write. Confirm before cleanup.
export async function persistLearningMetadata<T extends { error: unknown }>(
  save: () => PromiseLike<T>,
  cleanup: () => PromiseLike<unknown>,
  confirm: () => PromiseLike<boolean> = async () => false,
): Promise<T | { error: null }> {
  let result: T | undefined;
  let failure: unknown;
  try {
    result = await save();
    if (!result.error) return result;
  } catch (error) { failure = error; }
  let absent = false;
  try {
    if (await confirm()) return { error: null };
    absent = true;
  } catch { /* Uncertain commit: retain storage until it can be reconciled. */ }
  if (absent) {
    try { await cleanup(); } catch { /* Preserve the original save error. */ }
  }
  if (result) return result;
  throw failure;
}
