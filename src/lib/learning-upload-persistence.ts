// Storage is already written. Keep it only when metadata was saved successfully.
export async function persistLearningMetadata<T extends { error: unknown }>(
  save: () => PromiseLike<T>,
  cleanup: () => PromiseLike<unknown>,
): Promise<T> {
  let committed = false;
  try {
    const result = await save();
    committed = !result.error;
    return result;
  } finally {
    if (!committed) {
      try { await cleanup(); } catch { /* Preserve the original save error. */ }
    }
  }
}
