import "server-only";

export function accountOrigin() {
  const configured = process.env.MUNDUS_SITE_URL?.trim();
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = configured || (vercelProduction ? `https://${vercelProduction}` : "");

  const url = new URL(raw);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) {
    throw new Error("Invalid account site URL");
  }
  return url.origin;
}
