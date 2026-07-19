import { pagesMetadata } from "@/lib/seo/pages-metadata";
import InternetClient from "@/app/pomoc/internet/InternetClient";

const routersSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Huawei HG8245Q",
    brand: { "@type": "Brand", name: "Huawei" },
    description: "Terminal optyczny GPON, instalowany przy prędkościach do 600 Mb/s. Router Wi-Fi, przełącznik gigabitowy i brama VoIP w jednej obudowie.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Huawei HG8245X6-10",
    brand: { "@type": "Brand", name: "Huawei" },
    description: "Terminal GPON z Wi-Fi 6, instalowany przy prędkościach do 1 Gb/s.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Huawei HG8145B7N",
    brand: { "@type": "Brand", name: "Huawei" },
    description: "Router z Wi-Fi 7 i portem LAN 2.5 Gb/s, instalowany przy prędkościach do 2 Gb/s.",
  },
];

export const metadata = pagesMetadata.pomocInternet;

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routersSchema) }} />
      <InternetClient />
    </>
  );
}