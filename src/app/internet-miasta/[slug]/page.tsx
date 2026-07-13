import MiastoPage from "@/components/miasta/MiastoPage"; // Dostosuj ścieżkę do swojego komponentu MiastoPage
import Link from "next/link";
import { ArrowLeft, Wifi, Tv, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-[#0B2A3D] text-white font-sans">
      {/* Górny pasek nawigacji / Powrót */}
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-teal-300"
        >
          <ArrowLeft size={16} />
          Powrót do listy miast
        </Link>
      </div>

      {/* Główna sekcja z nagłówkiem */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
          
          {/* Wywołanie Twojego komponentu nagłówka */}
          <MiastoPage slug={slug} />
          
          <p className="mt-4 max-w-2xl text-base text-white/70">
            Wybierz najlepszy pakiet światłowodu i telewizji cyfrowej dopasowany do Twoich potrzeb. 
            Sprawdź parametry techniczne i zamów instalację online.
          </p>

          {/* Przykładowy placeholder na dalszy content (cokolwiek po przeklikaniu) */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-6 border border-white/5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                <Wifi size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Internet Światłowodowy</h3>
              <p className="text-sm text-white/60">Prędkości aż do 1 Gb/s bez limitu danych i spadków stabilności.</p>
            </div>

            <div className="rounded-xl bg-white/5 p-6 border border-white/5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                <Tv size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Telewizja 4K</h3>
              <p className="text-sm text-white/60">Ponad 180 kanałów, w tym sport i film w najwyższej jakości obrazu.</p>
            </div>

            <div className="rounded-xl bg-white/5 p-6 border border-white/5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bezpieczna sieć</h3>
              <p className="text-sm text-white/60">Ochrona przed cyberzagrożeniami i kontrola rodzicielska w cenie.</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}