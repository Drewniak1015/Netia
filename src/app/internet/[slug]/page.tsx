import { notFound } from "next/navigation";
import { getCityBySlug, CITIES } from "@/components/miasta/miasta-dane";
import MiastoPage from "@/components/miasta/MiastoPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generuje statyczne strony dla wszystkich miast (opcjonalne, ale dobre pod SEO)
export function generateStaticParams() {
  return CITIES.map((city) => ({ slug: city.slug }));
}

// Meta dane per miasto — tytuł i opis z odmienioną nazwą
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  return {
    title: `Internet i telewizja w ${city.locative} | Netia`,
    description: `Sprawdź dostępność szybkiego internetu światłowodowego i telewizji w ${city.locative}. Poznaj oferty i zamów online.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-[#071021] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <MiastoPage slug={slug} />
        {/* Tutaj dalsza treść strony miasta: oferty, formularz sprawdzenia adresu itd. */}
      </div>
    </div>
  );
}