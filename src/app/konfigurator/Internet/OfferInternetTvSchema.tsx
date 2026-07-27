// OfferInternetTvSchema.tsx
//
// JSON-LD schema.org dla sekcji OfferInternetTvSection: FAQPage (z faqItems)
// + Product/Offer (z plans). Umieść w tym samym folderze co
// OfferInternetTvSection.tsx i internet-tv-data.ts.
//
// Import jest z ./internet-tv-data (plik BEZ "use client"), a NIE z
// OfferInternetTvSection.tsx — z tego samego powodu co w OfferQuizSchema.

import { faqItems, plans } from "./internet-tv-data";

export function OfferInternetTvSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Pakiety Internet + Telewizja XS Netia",
    itemListElement: plans.map((plan) => ({
      "@type": "Offer",
      name: `Internet ${plan.speed} + Telewizja XS`,
      price: plan.price,
      priceCurrency: "PLN",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price,
        priceCurrency: "PLN",
        unitText: "MONTH",
      },
      itemOffered: {
        "@type": "Service",
        name: "Internet światłowodowy + Telewizja",
        provider: {
          "@type": "Organization",
          name: "Netia S.A.",
          url: "https://netia.vercel.app",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
      />
    </>
  );
}