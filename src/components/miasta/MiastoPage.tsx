import { getCityBySlug } from "./miasta-dane";

interface MiastoPageProps {
  /** Slug miasta z adresu URL, np. z /internet/[slug] */
  slug: string;
}

export default function MiastoPage({ slug }: MiastoPageProps) {
  const city = getCityBySlug(slug);
  const locative = city?.locative ?? slug;

  return (
    <h1 className="text-3xl font-bold text-white sm:text-4xl">
      Internet i telewizja w <span className="text-[#2dd4bf]">{locative}</span>
    </h1>
  );
}