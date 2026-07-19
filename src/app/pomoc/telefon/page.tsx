import { pagesMetadata } from "@/lib/seo/pages-metadata";
import TelefonClient from "@/app/pomoc/telefon/NetiaUslugiMobilnePomocPage";

const mobilePlansSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Netia Mobile 5G",
  brand: { "@type": "Brand", name: "Netia" },
  description: "Telefonia komórkowa 5G na sieci Plus z nielimitowanymi rozmowami i SMS w kraju.",
  offers: [
    {
      "@type": "Offer",
      name: "SUPER 5G — 60 GB",
      price: "30",
      priceCurrency: "PLN",
      description: "60 GB internetu w Polsce, 8.5 GB w roamingu UE",
    },
    {
      "@type": "Offer",
      name: "VIP 5G — 100 GB",
      price: "40",
      priceCurrency: "PLN",
      description: "100 GB internetu w Polsce, 11 GB w roamingu UE",
    },
    {
      "@type": "Offer",
      name: "GIGA 5G — 200 GB",
      price: "60",
      priceCurrency: "PLN",
      description: "200 GB internetu w Polsce, 15 GB w roamingu UE",
    },
  ],
};

const portingHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Jak przenieść numer telefonu do Netii",
  step: [
    { "@type": "HowToStep", name: "Złóż zamówienie", text: "Złóż zamówienie na usługę mobilną Netia." },
    { "@type": "HowToStep", name: "Podaj dane", text: "Podaj swój obecny numer telefonu i dane operatora." },
    { "@type": "HowToStep", name: "Formalności", text: "Netia zajmie się formalnościami przeniesienia." },
    { "@type": "HowToStep", name: "Nowa karta SIM", text: "Otrzymasz nową kartę SIM i zachowasz dotychczasowy numer." },
  ],
};

export const metadata = pagesMetadata.pomocTelefon;

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mobilePlansSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portingHowToSchema) }} />
      <TelefonClient />
    </>
  );
}