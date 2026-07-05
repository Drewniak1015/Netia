import type { Metadata } from "next";
import OfertaMax from "@/components/SpecjalneOferty/Max";
import NetiaFAQ from "@/components/SpecjalneOferty/Faq";

export const metadata: Metadata = {
  title: "Oferta Max — 12 miesięcy za 0 zł",
  description:
    "Internet Max z Telewizją L.4K + Bezpieczny Internet Ultra. Wybierz swój pakiet MAX 1000 lub MAX 2000.",
};

export default function OfertaMaxPage() {
  return <><OfertaMax /><NetiaFAQ /></>;
}