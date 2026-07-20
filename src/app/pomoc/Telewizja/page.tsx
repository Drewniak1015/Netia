import { pagesMetadata } from "@/lib/seo/pages-metadata";
import TelewizjaClient from "./TelewizjaClient";

const decodersSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Netia Soundbox 4K",
    brand: { "@type": "Brand", name: "Netia" },
    description:
      "Dekoder Android TV 4K z wbudowanym soundbarem (Bang & Olufsen), Wi-Fi 6, Dolby Atmos. Obsługuje telewizję w 4K, nagrywanie i aplikację Netia GO.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Netia EvoBox 4K",
    brand: { "@type": "Brand", name: "Netia" },
    description:
      "Kompaktowy dekoder IPTV Ultra HD/4K z pilotem Bluetooth, obsługą multimediów z USB/DLNA oraz dostępem do Netia GO i Disney+.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Netia EvoBox HD",
    brand: { "@type": "Brand", name: "Netia" },
    description:
      "Lekki, ekonomiczny dekoder IPTV oferujący odbiór telewizji w jakości HD, z obsługą multimediów przez USB i DLNA.",
  },
];

const tvPackagesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Pakiety telewizyjne Netia",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pakiet XS", description: "Najmniejszy zestaw kanałów z kompletem kanałów regionalnych TVP." },
    { "@type": "ListItem", position: 2, name: "Pakiet S", description: "Podstawowy zestaw najpopularniejszych polskich stacji ogólnotematycznych, informacyjnych i rozrywkowych." },
    { "@type": "ListItem", position: 3, name: "Pakiet M", description: "Rozszerzenie pakietu S o kanały filmowe, sportowe, dokumentalne i lifestyle." },
    { "@type": "ListItem", position: 4, name: "Pakiet L", description: "Najpełniejszy pakiet telewizyjny Netii, z kanałami premium, sportowymi, filmowymi i dla dzieci." },
  ],
};

export const metadata = pagesMetadata.pomocTelewizja;

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(decodersSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvPackagesSchema) }} />
      <TelewizjaClient />
    </>
  );
}