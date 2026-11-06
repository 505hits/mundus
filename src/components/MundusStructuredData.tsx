export default function MundusStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Mundus Languages",
    url: "https://munduslanguages.com",
    sameAs: ["https://www.instagram.com/mundus.languages/"],
    description:
      "Individual 1:1 online language lessons with 45- or 60-minute lesson options, flexible scheduling, online payment and a student portal.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Individual online language lesson packages",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "45-minute lessons",
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
          name: "60-minute lessons",
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
