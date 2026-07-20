import OfertaMax from "@/components/SpecjalneOferty/Max";
import NetiaFAQ from "@/components/SpecjalneOferty/Faq";
import { FAQ_ITEMS } from "@/components/SpecjalneOferty/FaqData";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

const maxOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Internet Max z Telewizją L 4K",
  brand: { "@type": "Brand", name: "Netia" },
  description:
    "Internet do 2000 Mb/s + Telewizja L 4K z Dekoderem + Bezpieczny Internet Ultra (ochrona 5 urządzeń + CyberEkspert). 12 miesięcy za 0 zł.",
  offers: [
    {
      "@type": "Offer",
      name: "MAX 1000",
      description: "Internet do 1000 Mb/s + Telewizja L 4K + Bezpieczny Internet Ultra",
      price: "140",
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: "https://netia.vercel.app/oferty/max",
    },
    {
      "@type": "Offer",
      name: "MAX 2000",
      description: "Internet do 2000 Mb/s + Telewizja L 4K + Bezpieczny Internet Ultra",
      price: "160",
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: "https://netia.vercel.app/oferty/max",
    },
  ],
};

const tvAddonsSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Pakiety telewizyjne Premium – dodatki do oferty Max",
  itemListElement: [
    { "@type": "Offer", name: "HBO + HBO Max", price: "25", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Canal+ Prestige", price: "50", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Canal+ Select", price: "35", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Polsat Sport Premium", price: "20", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Eleven Sports", price: "10", priceCurrency: "PLN" },
    { "@type": "Offer", name: "FilmBox", price: "10", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Dla Dorosłych", price: "10", priceCurrency: "PLN" },
    { "@type": "Offer", name: "Polsat Sport Premium + Eleven Sports", price: "20", priceCurrency: "PLN" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export const metadata = pagesMetadata.ofertyMax;

export default function OfertaMaxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(maxOfferSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvAddonsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OfertaMax />
      <NetiaFAQ />
    </>
  );
}