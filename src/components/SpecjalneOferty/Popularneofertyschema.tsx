// PopularneOfertySchema.tsx
//
// JSON-LD schema.org dla sekcji PopularneOferty: FAQPage (z faqs) +
// OfferCatalog (z offers). Import jest bezpośrednio z ./popularneData —
// ten plik NIE ma "use client", więc nie ma tu ryzyka błędu
// ".map is not a function" znanego z OfferQuizSection.
//
// Umieść w tym samym folderze co PopularneOferty.tsx i popularneData.ts
// (wygląda na components/SpecjalneOferty/ na podstawie importu w Twoim
// komponencie), a w page.tsx tej trasy dodaj:
//
// import PopularneOferty from "@/components/SpecjalneOferty/PopularneOferty";
// import { PopularneOfertySchema } from "@/components/SpecjalneOferty/PopularneOfertySchema";
//
// export default function Page() {
//   return (
//     <>
//       <PopularneOfertySchema />
//       <PopularneOferty />
//     </>
//   );
// }

import { offers, faqs } from "./popularneData";

export function PopularneOfertySchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
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
    name: "Najpopularniejsze pakiety Netia",
    itemListElement: offers.map((offer) => ({
      "@type": "Offer",
      name: `Internet do ${offer.speedBold}${offer.speedSuffix ? ` ${offer.speedSuffix}` : ""}`,
      // offer.price bywa zapisane jako "70 zł" — schema.org oczekuje samej
      // liczby w polu price, więc wycinamy jednostkę przed zapisem.
      price: offer.price.replace(/[^\d.,]/g, ""),
      priceCurrency: "PLN",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: offer.price.replace(/[^\d.,]/g, ""),
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