import type { Metadata } from "next";
import type { Language } from "@/context/LanguageContext";

export function localizedPath(path:string,language:Language){
  const clean=path==="/"?"":path.startsWith("/")?path:`/${path}`;
  return `/${language}${clean}`||`/${language}`;
}

export function localizedAlternates(path:string,language:Language):Metadata["alternates"]{
  const clean=path==="/"?"":path.startsWith("/")?path:`/${path}`;
  return {
    canonical:`/${language}${clean}`,
    languages:{
      "sk-SK":`/sk${clean}`,
      "en-GB":`/en${clean}`,
      "x-default":clean||"/",
    },
  };
}
