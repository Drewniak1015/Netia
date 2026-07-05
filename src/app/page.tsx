import MainHero from "@/components/home/MainHero";
import Oferty from "@/components/home/Oferty";
import Benefity from "@/components/home/Benefity";
import OfertyInternet from "@/components/home/OfertyInternet";
import PoradnikTechnologie from "@/components/home/PoradnikTechnologie";
import Opinie from "@/components/home/opinie";
import CTA from "@/components/home/Cta";
import Instrukcja from "@/components/home/Instrukcja";
import Miasta from "@/components/miasta/Miasta";

export default function HomePage() {
  return (
    <>
      <MainHero />
      <Oferty/>
      <OfertyInternet/>
      <PoradnikTechnologie/>
      <Instrukcja/>
      <Benefity/>
      <Opinie/>
      {/* Gwarancja */}
      <CTA/>
      <Miasta/>
    </>
  );
} 