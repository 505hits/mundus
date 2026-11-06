export const MUNDUS_LANGUAGE_OPTIONS = [
  { value: "English", label: "Angličtina" },
  { value: "German", label: "Nemčina" },
  { value: "Spanish", label: "Španielčina" },
  { value: "Italian", label: "Taliančina" },
  { value: "French", label: "Francúzština" },
  { value: "Portuguese", label: "Portugalčina" },
  { value: "Hungarian", label: "Maďarčina" },
  { value: "Polish", label: "Poľština" },
  { value: "Russian", label: "Ruština" },
  { value: "Chinese", label: "Čínština" },
  { value: "Slovak", label: "Slovenčina" },
  { value: "Ukrainian", label: "Ukrajinčina" },
  { value: "Modern Hebrew", label: "Moderná hebrejčina" },
] as const;

export const MUNDUS_LANGUAGE_VALUES = MUNDUS_LANGUAGE_OPTIONS.map((language) => language.value);
export const MUNDUS_LANGUAGE_LABELS = MUNDUS_LANGUAGE_OPTIONS.map((language) => language.label);


export const MUNDUS_STUDENT_LANGUAGE_BY_VALUE: Record<string,string> = Object.fromEntries(
  MUNDUS_LANGUAGE_OPTIONS.map(item => [item.value,item.label]),
);
