"use client";

import { MapPin, ArrowRight, Wifi } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/cities";

const VISIBLE_LIMIT = 25;

function formatPopulation(n: number): string {
  return n.toLocaleString("pl-PL").replace(/,/g, " ");
}

interface MiastaProps {
  /** Baza adresu strony docelowej dla miasta, np. "/internet" -> /internet/warszawa */
  baseHref?: string;
  onShowFullList?: () => void;
}

/**
 * Hook: zwraca ref + flagę "widoczny", ustawianą raz, gdy element
 * wjedzie w viewport. Respektuje prefers-reduced-motion (od razu widoczny).
 */
function useRevealOnScroll<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/**
 * Pojedyncza karta miasta — wydzielona, żeby nie duplikować JSX
 * pomiędzy siatką "zawsze widoczną" a siatką "rozwijaną".
 */
function CityCard({
  city,
  index,
  visible,
  baseHref,
}: {
  city: (typeof CITIES)[number];
  index: number;
  visible: boolean;
  baseHref: string;
}) {
  return (
    <a
      href={`${baseHref}/${city.slug}`}
      title={`Internet i telewizja w ${city.locative} — sprawdź ofertę`}
      aria-label={`Sprawdź dostępność internetu i telewizji w ${city.locative}`}
      className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-all duration-200 hover:border-teal-400/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A3D]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform, border-color, background-color",
        transitionDuration: "600ms, 600ms, 200ms, 200ms",
        transitionTimingFunction: "ease-out",
        transitionDelay: visible ? `${index * 60}ms` : "0ms",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-teal-300">
          <MapPin size={18} strokeWidth={2} />
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-white">{city.name}</span>
          <span className="block text-sm text-white/60">{formatPopulation(city.population)}</span>
        </span>
      </div>
      <ArrowRight
        size={18}
        className="shrink-0 text-teal-300 transition-transform duration-200 group-hover:translate-x-1"
      />
    </a>
  );
}

export default function Miasta({ baseHref = "/internet-miasta", onShowFullList }: MiastaProps) {
  const header = useRevealOnScroll<HTMLDivElement>();
  const grid = useRevealOnScroll<HTMLDivElement>();
  const footer = useRevealOnScroll<HTMLDivElement>();

  const [expanded, setExpanded] = useState(false);
  const visibleCities = CITIES.slice(0, VISIBLE_LIMIT);
  const restCities = CITIES.slice(VISIBLE_LIMIT);
  const hasMore = restCities.length > 0;

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto max-w-320 px-5 py-16 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
        {/* Badge + Header */}
        <div
          ref={header.ref}
          className="mb-10 transition-all duration-700 ease-out"
          style={{
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Dostępność w Twoim mieście
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Wybierz swoje <span className="text-teal-300">miasto</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base">
            Sprawdź dostępność szybkiego internetu i telewizji w Twojej okolicy.
          </p>
        </div>

        {/* City grid — pierwsze 25 zawsze widoczne */}
        <div ref={grid.ref} className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {visibleCities.map((city, i) => (
            <CityCard
              key={city.slug}
              city={city}
              index={i}
              visible={grid.visible}
              baseHref={baseHref}
            />
          ))}
        </div>

        {/* Reszta miast — zawsze w DOM (SEO), wizualnie zwijana grid-rows trickiem */}
        {hasMore && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateRows: expanded ? "1fr" : "0fr",
                transition: "grid-template-rows .25s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div
                  className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transition: `opacity ${expanded ? ".2s ease .05s" : ".1s ease"}`,
                  }}
                >
                  {restCities.map((city, i) => (
                    <CityCard
                      key={city.slug}
                      city={city}
                      index={i}
                      visible={expanded}
                      baseHref={baseHref}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {expanded ? "Pokaż mniej miast" : `Pokaż więcej miast (${restCities.length})`}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300"
                  style={{ transform: expanded ? "rotate(-90deg)" : "rotate(90deg)" }}
                />
              </button>
            </div>
          </>
        )}

        {/* Footer callout */}
      </div>
    </section>
  );
}