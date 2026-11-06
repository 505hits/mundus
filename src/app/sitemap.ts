import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base="https://munduslanguages.com";
  const now=new Date();
  return [
    {url:base,lastModified:now,changeFrequency:"weekly",priority:1},
    {url:base+"/group-lessons",lastModified:now,changeFrequency:"monthly",priority:0.85},
    {url:base+"/companies",lastModified:now,changeFrequency:"monthly",priority:0.9},
    {url:base+"/contact",lastModified:now,changeFrequency:"monthly",priority:0.7},
    {url:base+"/languages",lastModified:now,changeFrequency:"monthly",priority:0.95},
    {url:base+"/pricing",lastModified:now,changeFrequency:"weekly",priority:0.95},
    {url:base+"/languages/english",lastModified:now,changeFrequency:"monthly",priority:0.9},
    {url:base+"/languages/german",lastModified:now,changeFrequency:"monthly",priority:0.88},
    {url:base+"/languages/italian",lastModified:now,changeFrequency:"monthly",priority:0.86},
    {url:base+"/languages/spanish",lastModified:now,changeFrequency:"monthly",priority:0.86},
    {url:base+"/languages/french",lastModified:now,changeFrequency:"monthly",priority:0.84},
    {url:base+"/languages/slovak-for-foreigners",lastModified:now,changeFrequency:"monthly",priority:0.88},
    {url:base+"/privacy",lastModified:now,changeFrequency:"yearly",priority:0.2},
    {url:base+"/terms",lastModified:now,changeFrequency:"yearly",priority:0.2},
    {url:base+"/cookies",lastModified:now,changeFrequency:"yearly",priority:0.2},
  ];
}
