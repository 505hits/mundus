import { currentLanguage } from "@/lib/i18n";
import { localizedPath } from "@/lib/seo-locales";

export default async function MundusStructuredData(){
 const language=await currentLanguage();const sk=language==="sk";
 const data={
  "@context":"https://schema.org",
  "@graph":[
   {
    "@type":"EducationalOrganization",
    "@id":"https://munduslanguages.com/#organization",
    name:"Mundus Languages",
    url:"https://munduslanguages.com",
    sameAs:["https://www.instagram.com/mundus.languages/"],
    areaServed:[{"@type":"Country",name:"Slovakia"},{"@type":"Country",name:"Czechia"}],
    description:sk
      ?"Online jazyková škola pre individuálne hodiny 1:1, súkromné skupiny a firemné jazykové vzdelávanie."
      :"Online language school for 1:1 lessons, private groups and company language training."
   },
   {
    "@type":"WebSite",
    "@id":"https://munduslanguages.com/#website",
    url:"https://munduslanguages.com",
    name:"Mundus Languages",
    publisher:{"@id":"https://munduslanguages.com/#organization"},
    inLanguage:sk?"sk":"en"
   },
   {
    "@type":"Service",
    "@id":"https://munduslanguages.com/#individual-lessons",
    name:sk?"Individuálne online jazykové hodiny 1:1":"Individual 1:1 online language lessons",
    provider:{"@id":"https://munduslanguages.com/#organization"},
    serviceType:sk?"Online jazykové hodiny":"Online language lessons",
    url:`https://munduslanguages.com${localizedPath("/pricing",language)}`,
    description:sk?"Individuálne online jazykové hodiny v dĺžke 45 alebo 60 minút.":"Individual online language lessons in 45- or 60-minute formats.",
    offers:{
      "@type":"OfferCatalog",
      name:sk?"Balíčky individuálnych hodín":"Individual lesson packages",
      itemListElement:[
       {"@type":"Offer",priceCurrency:"EUR",price:"24",name:"1 × 45 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"115",name:"5 × 45 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"220",name:"10 × 45 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"415",name:"20 × 45 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"595",name:"30 × 45 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"28",name:"1 × 60 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"135",name:"5 × 60 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"260",name:"10 × 60 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"490",name:"20 × 60 min"},
       {"@type":"Offer",priceCurrency:"EUR",price:"705",name:"30 × 60 min"}
      ]
    }
   },
   {
    "@type":"Service",
    "@id":"https://munduslanguages.com/#group-lessons",
    name:sk?"Súkromné skupinové jazykové hodiny":"Private group language lessons",
    provider:{"@id":"https://munduslanguages.com/#organization"},
    url:`https://munduslanguages.com${localizedPath("/group-lessons",language)}`,
    description:sk?"Súkromné online skupiny pre 2–5 priateľov alebo kolegov s podobnou úrovňou.":"Private online groups for 2–5 friends or colleagues at a similar level."
   },
   {
    "@type":"Service",
    "@id":"https://munduslanguages.com/#company-training",
    name:sk?"Firemné jazykové vzdelávanie":"Company language training",
    provider:{"@id":"https://munduslanguages.com/#organization"},
    url:`https://munduslanguages.com${localizedPath("/companies",language)}`,
    description:sk?"Individuálne a skupinové jazykové vzdelávanie pre firmy s cenou na mieru a firemným portálom.":"Individual and group language training for companies with custom pricing and a company portal."
   }
  ]
 };
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/>;
}
