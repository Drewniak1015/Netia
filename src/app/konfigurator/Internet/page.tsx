// src/app/oferty/internet-tv/page.tsx
//
// PODMIEŃ import OfferInternetTvSection/OfferInternetTvSchema na realną
// ścieżkę, w której leżą te pliki w Twoim projekcie (nie znam jej —
// wcześniej wysłane pliki nie miały podanej lokalizacji docelowej).

import OfferInternetTvSection from "@/app/konfigurator/Internet/OfferInternetTvSection";
import { OfferInternetTvSchema } from "@/app/konfigurator/Internet/OfferInternetTvSchema";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyInternetTv;

export default function OfertyInternetTvPage() {
  return (
    <>
      <OfferInternetTvSchema />
      <OfferInternetTvSection />
    </>
  );
}