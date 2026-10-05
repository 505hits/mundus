import { cookies } from "next/headers";
import type { Language } from "@/context/LanguageContext";

export async function currentLanguage(): Promise<Language> {
  const store = await cookies();
  return store.get("mundus_language")?.value === "en" ? "en" : "sk";
}

export function localeFor(language: Language) {
  return language === "en" ? "en-GB" : "sk-SK";
}

export function pick<T>(language: Language, values: { en: T; sk: T }): T {
  return values[language];
}
