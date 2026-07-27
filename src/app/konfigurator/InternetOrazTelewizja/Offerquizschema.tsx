// src/app/konfigurator/InternetOrazTelewizja/Offerquizschema.tsx
//
// JSON-LD schema.org: FAQPage (z pytań kwizu) + OfferCatalog (z ofert).
// Renderuje wyłącznie tagi <script>, bez widocznego UI.
//
// WAŻNE: import jest z ./offer-data (plik BEZ "use client"), a NIE z
// Offerquizsection.tsx. Import z pliku "use client" powodował błąd
// "QUIZ_FAQ_ITEMS.map is not a function" w serwerowym page.tsx, bo Next.js
// traktuje eksporty z modułu klienckiego jako nieprzezroczyste referencje,
// a nie zwykłe wartości, gdy są importowane po stronie serwera.

import { QUIZ_FAQ_ITEMS, OFFER_SECTIONS } from "@/app/konfigurator/InternetOrazTelewizja/offer-data";

export function OfferQuizSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUIZ_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Oferty Internetu i Telewizji Netia",
    itemListElement: OFFER_SECTIONS.flatMap((section) =>
      section.offers.map((offer) => ({
        "@type": "Offer",
        name: offer.name,
        price: offer.price,
        priceCurrency: "PLN",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: offer.price,
          priceCurrency: "PLN",
          unitText: "MONTH",
        },
        category: section.title,
        itemOffered: {
          "@type": "Service",
          name: "Internet światłowodowy + Telewizja",
          provider: {
            "@type": "Organization",
            name: "Netia S.A.",
            url: "https://netia.vercel.app",
          },
        },
      }))
    ),
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