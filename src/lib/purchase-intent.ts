export const PACKAGE_LESSONS = [1, 5, 10, 20, 30] as const;
export const PACKAGE_DURATIONS = [45, 60] as const;
export const PURCHASE_LANGUAGES = ["English","German","Spanish","Italian","French","Portuguese","Hungarian","Polish","Russian","Chinese","Slovak","Ukrainian","Modern Hebrew"] as const;

export function purchaseReturnPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url=new URL(value,"https://munduslanguages.com");
    if(url.origin!=="https://munduslanguages.com"||url.pathname!=="/packages") return null;
    const allowed=new Set(["selected","duration","language"]);
    for(const key of url.searchParams.keys()) if(!allowed.has(key)) return null;
    if(url.searchParams.getAll("selected").length!==1||url.searchParams.getAll("duration").length!==1||url.searchParams.getAll("language").length>1) return null;
    const selected=url.searchParams.get("selected");
    const duration=url.searchParams.get("duration");
    const language=url.searchParams.get("language");
    if(!PACKAGE_LESSONS.some(item=>String(item)===selected)) return null;
    if(!PACKAGE_DURATIONS.some(item=>String(item)===duration)) return null;
    if(language && !PURCHASE_LANGUAGES.includes(language as (typeof PURCHASE_LANGUAGES)[number])) return null;
    const params=new URLSearchParams({selected:selected!,duration:duration!});
    if(language) params.set("language",language);
    return `/packages?${params.toString()}`;
  } catch {
    return null;
  }
}
