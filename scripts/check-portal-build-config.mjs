// Public variables are embedded in the browser bundle: validate before Next builds.
const missing = [];
try {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (url.protocol !== "https:") missing.push("NEXT_PUBLIC_SUPABASE_URL (HTTPS required)");
} catch { missing.push("NEXT_PUBLIC_SUPABASE_URL"); }
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
if (missing.length) {
  console.error(`Mundus portal build blocked: configure ${missing.join(", ")} in this deployment environment, then rebuild. Values are never printed.`);
  process.exitCode = 1;
}
