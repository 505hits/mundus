import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base="https://munduslanguages.com";
  const now=new Date();
  return [
    {url:base,lastModified:now,changeFrequency:"weekly",priority:1},
    {url:base+"/group-lessons",lastModified:now,changeFrequency:"monthly",priority:0.85},
    {url:base+"/companies",lastModified:now,changeFrequency:"monthly",priority:0.9},
    {url:base+"/contact",lastModified:now,changeFrequency:"monthly",priority:0.7},
    {url:base+"/privacy",lastModified:now,changeFrequency:"yearly",priority:0.2},
    {url:base+"/terms",lastModified:now,changeFrequency:"yearly",priority:0.2},
    {url:base+"/cookies",lastModified:now,changeFrequency:"yearly",priority:0.2},
  ];
}
