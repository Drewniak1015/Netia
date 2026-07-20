import MainHero from "@/components/home/MainHero";
import Oferty from "@/components/home/Oferty";
import Benefity from "@/components/home/Benefity";
import OfertyInternet from "@/components/home/OfertyInternet";
import PoradnikTechnologie from "@/components/home/PoradnikTechnologie";
import Opinie from "@/components/home/opinie";
import CTA from "@/components/home/Cta";
import Instrukcja from "@/components/home/Instrukcja";
import Miasta from "@/components/miasta/Miasta";
import MaxxBanner from "@/components/home/Banner";
import NetiaFAQ from "@/components/home/Faq";
import { pagesMetadata } from "@/lib/seo/pages-metadata";
import { FAQ_ITEMS } from "@/components/home/homeFaqData";
import { REVIEWS } from "@/components/home/homeReviewsData";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Netia",
  url: "https://netia.vercel.app",
  telephone: "+48883334124",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.filter(
    (item) => item.a !== "Uzupełnij odpowiedź przed publikacją."
  ).map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const reviewsSchema = REVIEWS.map((r) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  reviewRating: { "@type": "Rating", ratingValue: "5" },
  author: { "@type": "Person", name: r.name },
  reviewBody: r.text,
  itemReviewed: { "@type": "Organization", name: "Netia" },
}));

export const metadata = pagesMetadata.home;

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }} />
      <MainHero />
      <MaxxBanner />
      <Oferty />
      <OfertyInternet />
      <PoradnikTechnologie />
      <Instrukcja />
      <Benefity />
      <Opinie />
      <CTA />
      <NetiaFAQ />
      <Miasta />
    </>
  );
}