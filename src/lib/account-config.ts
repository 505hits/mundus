import "server-only";

export function accountOrigin() {
  const url = new URL(process.env.MUNDUS_SITE_URL || "");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) {
    throw new Error("Invalid account site URL");
  }
  return url.origin;
}
