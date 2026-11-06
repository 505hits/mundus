import { currentLanguage } from "@/lib/i18n";

export default async function MundusStructuredData() {
  const language = await currentLanguage();
  const sk = language === "sk";

  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Mundus Languages",
    url: "https://munduslanguages.com",
    inLanguage: sk ? "sk" : "en",
    sameAs: ["https://www.instagram.com/mundus.languages/"],
    description: sk
      ? "Individuálne online jazykové hodiny s možnosťou 45- alebo 60-minútových lekcií, flexibilnými termínmi, online platbou a študentským portálom."
      : "Personal online language lessons with 45- or 60-minute options, flexible scheduling, online payment and a student portal.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: sk ? "Balíčky individuálnych online jazykových hodín" : "Individual online language lesson packages",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: sk ? "45-minútové hodiny" : "45-minute lessons",
          itemListElement: [
            { "@type": "Offer", priceCurrency: "EUR", price: "24", name: "1 × 45 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "115", name: "5 × 45 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "220", name: "10 × 45 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "415", name: "20 × 45 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "595", name: "30 × 45 min" },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: sk ? "60-minútové hodiny" : "60-minute lessons",
          itemListElement: [
            { "@type": "Offer", priceCurrency: "EUR", price: "28", name: "1 × 60 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "135", name: "5 × 60 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "260", name: "10 × 60 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "490", name: "20 × 60 min" },
            { "@type": "Offer", priceCurrency: "EUR", price: "705", name: "30 × 60 min" },
          ],
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
