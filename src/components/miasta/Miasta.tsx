import { MapPin, ArrowRight, Wifi } from "lucide-react";
import { CITIES } from "./miasta-dane";

function formatPopulation(n: number): string {
  return n.toLocaleString("pl-PL").replace(/,/g, " ");
}

interface MiastaProps {
  /** Baza adresu strony docelowej dla miasta, np. "/internet" -> /internet/warszawa */
  baseHref?: string;
  onShowFullList?: () => void;
}

export default function Miasta({ baseHref = "/internet", onShowFullList }: MiastaProps) {
  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto max-w-320 px-5 py-16 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
            Dostępność w Twoim mieście
          </span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Wybierz swoje <span className="text-teal-300">miasto</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base">
            Sprawdź dostępność szybkiego internetu i telewizji w Twojej okolicy.
          </p>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CITIES.map((city) => (
            <a
              key={city.slug}
              href={`${baseHref}/${city.slug}`}
              title={`Internet i telewizja w ${city.locative} — sprawdź ofertę`}
              aria-label={`Sprawdź dostępność internetu i telewizji w ${city.locative}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-colors duration-200 hover:border-teal-400/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-teal-300">
                  <MapPin size={18} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-white">
                    {city.name}
                  </span>
                  <span className="block text-sm text-white/60">
                    {formatPopulation(city.population)}
                  </span>
                </span>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-teal-300 transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          ))}
        </div>

        {/* Footer callout */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-teal-300">
              <Wifi size={18} strokeWidth={2} />
            </span>
            <p className="text-sm font-normal text-white/70 sm:text-[15px]">
              Nie znalazłeś swojego miasta? Sprawdź pełną listę dostępności w Twojej
              okolicy.
            </p>
          </div>
          <button
            type="button"
            onClick={onShowFullList}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-teal-300 transition-colors hover:text-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D]"
          >
            Zobacz pełną listę
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}