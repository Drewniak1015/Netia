import { pagesMetadata } from "@/lib/seo/pages-metadata";
import FaqClient from "@/app/pomoc/faq/FaqClient";
import { FAQ_ITEMS } from "@/app/pomoc/faq/faqPomocData";

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

export const metadata = pagesMetadata.pomocFaq;

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FaqClient />
    </>
  );
}