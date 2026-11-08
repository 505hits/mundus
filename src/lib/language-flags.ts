// Flags indicate a familiar national association with each language;
// they do not imply the language is spoken only in that country.
export const languageFlags: Record<string, { code: string; emoji: string }> = {
  English:{code:"gb",emoji:"🇬🇧"},
  German:{code:"de",emoji:"🇩🇪"},
  Spanish:{code:"es",emoji:"🇪🇸"},
  Italian:{code:"it",emoji:"🇮🇹"},
  French:{code:"fr",emoji:"🇫🇷"},
  Portuguese:{code:"pt",emoji:"🇵🇹"},
  Hungarian:{code:"hu",emoji:"🇭🇺"},
  Polish:{code:"pl",emoji:"🇵🇱"},
  Russian:{code:"ru",emoji:"🇷🇺"},
  Chinese:{code:"cn",emoji:"🇨🇳"},
  Slovak:{code:"sk",emoji:"🇸🇰"},
  Ukrainian:{code:"ua",emoji:"🇺🇦"},
  "Modern Hebrew":{code:"il",emoji:"🇮🇱"}
};
export function flagForLanguage(value: string) {return languageFlags[value] ?? {code:"un",emoji:"🌍"};}
