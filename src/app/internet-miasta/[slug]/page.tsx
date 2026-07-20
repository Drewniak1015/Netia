import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, getCityBySlug } from "@/lib/cities";
import { getCityDistricts } from "@/lib/cityDistricts";
import { getNearbyCities, generateCityFaq } from "@/lib/cityHelpers";
import CityPageClient from "@/components/miasta/CityPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Generuje statyczne ścieżki dla wszystkich miast na etapie builda (SSG). */
export function generateStaticParams() {
  return CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Internet Netia w ${city.locative} — oferty, ceny, montaż`;
  const description =
    city.description?.slice(0, 155) ??
    `Sprawdź ofertę Internetu światłowodowego i telewizji Netii w ${city.locative}. Szybki montaż, elastyczne umowy.`;

  return {
    title,
    description,
    alternates: { canonical: `/internet-miasta/${city.slug}` },
  };
}

export default async function InternetMiastoPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const districts = getCityDistricts(city.slug);
  const nearbyCities = getNearbyCities(city.slug, 6);
  const faq = generateCityFaq(city);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Internet światłowodowy i telewizja",
    provider: { "@type": "Organization", name: "Netia" },
    areaServed: { "@type": "City", name: city.name },
    offers: {
      "@type": "Offer",
      price: "40",
      priceCurrency: "PLN",
      url: `https://netia.vercel.app/internet-miasta/${city.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://netia.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "Miasta", item: "https://netia.vercel.app/internet-miasta" },
      { "@type": "ListItem", position: 3, name: city.name, item: `https://netia.vercel.app/internet-miasta/${city.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CityPageClient city={city} districts={districts} nearbyCities={nearbyCities} faq={faq} />
    </>
  );
}