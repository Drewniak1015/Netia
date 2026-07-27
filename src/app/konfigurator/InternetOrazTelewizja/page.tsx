// src/app/oferty/dobierz/page.tsx

import OfferQuizSection from "@/app/konfigurator/InternetOrazTelewizja/Offerquizsection";
import { OfferQuizSchema } from "@/app/konfigurator/InternetOrazTelewizja/Offerquizschema";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyDobierz;

export default function OfertyDobierzPage() {
  return (
    <>
      <OfferQuizSchema />
      <OfferQuizSection />
    </>
  );
}