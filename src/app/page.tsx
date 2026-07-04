import MainHero from "@/components/home/MainHero";
import Oferty from "@/components/home/Oferty";
import Benefity from "@/components/home/Benefity";
import OfertyInternet from "@/components/home/OfertyInternet";
import PoradnikTechnologie from "@/components/home/PoradnikTechnologie";

export default function HomePage() {
  return (
    <>
      <MainHero />
      <Oferty/>
      <OfertyInternet/>
      <PoradnikTechnologie/>
      <Benefity/>
    </>
  );
} 