import { guides } from "@/data/mundus-guides";
import type { MetadataRoute } from "next";
import { LANGUAGE_SEO_PAGES } from "@/data/language-seo-pages";
import { INTENT_SEO_PAGES } from "@/data/intent-seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base="https://munduslanguages.com";
  const core=[
    ["",1,"weekly"],
    ["/languages",0.95,"monthly"],
    ["/pricing",0.95,"weekly"],
    ["/group-lessons",0.85,"monthly"],
    ["/companies",0.9,"monthly"],
    ["/teachers",0.85,"monthly"],
    ["/community",0.72,"monthly"],
    ["/contact",0.7,"monthly"],
    ["/privacy",0.2,"yearly"],
    ["/terms",0.2,"yearly"],
    ["/cookies",0.2,"yearly"],
  ] as const;
  const languagePaths=LANGUAGE_SEO_PAGES.map((page,index)=>[`/languages/${page.slug}`,Math.max(0.82,0.9-index*0.01),"monthly"] as const);
  const intentPaths=INTENT_SEO_PAGES.map(page=>[`/learn/${page.slug}`,0.84,"monthly"] as const);
  const guidePaths=Object.keys(guides).map(slug=>[`/blog/${slug}`,0.75,"monthly"] as const);
  const publicPaths=[...core,...languagePaths,...intentPaths,...guidePaths];

  return [
    ...publicPaths.flatMap(([path,priority,changeFrequency])=>(["sk","en"] as const).map(locale=>({
      url:`${base}/${locale}${path}`,
      changeFrequency,
      priority,
      alternates:{languages:{"sk-SK":`${base}/sk${path}`,"en-GB":`${base}/en${path}`,"x-default":`${base}/sk${path}`}},
    }))),
  ];
}
