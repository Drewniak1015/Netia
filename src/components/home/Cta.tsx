"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, ChevronRight } from "lucide-react";

type ContactSectionProps = {
  advisorName?: string;
  advisorRole?: string;
  advisorPhotoUrl?: string;
  phoneNumber?: string;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function ContactSection({
  advisorName = "Jarosław Sitek",
  advisorRole = "Twój doradca w sprawie internetu",
  // TODO: podmień ścieżkę, jeśli plik leży gdzie indziej niż /public.
  advisorPhotoUrl = "/images/Jaroslaw.webp",
  phoneNumber = "+48 883 334 124",
}: ContactSectionProps) {
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect(); // animacja odpala się tylko raz
        }
      },
      { threshold: 0.25 } // sekcja musi być widoczna w ~25%
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:py-16">
        {/* Kolumna tekstowa */}
        <div className="relative z-10 text-center lg:text-left">
          {/* Badge */}
          <div
            className={`mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 transition-all duration-700 ease-out lg:mx-0 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Porozmawiajmy o Twoim internecie
            </span>
          </div>

          <h2
            className={`text-2xl font-extrabold leading-tight text-white transition-all duration-700 ease-out sm:text-3xl lg:text-4xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: mounted ? "80ms" : "0ms" }}
          >
            Skontaktuj się —{" "}
            <span className="text-teal-300">zadzwoń</span> lub{" "}
            <span className="text-teal-300">zostaw SMS</span>
          </h2>

          <h3
            className={`mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 transition-all duration-700 ease-out sm:text-base lg:mx-0 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: mounted ? "160ms" : "0ms" }}
          >
            Szybki kontakt. Zero formalności. Pomożemy dobrać{" "}
            <span className="font-semibold text-white">
              najlepszy internet
            </span>{" "}
            dla Ciebie.
          </h3>

          {/* CTA */}
          <div
            className={`mt-8 flex flex-col gap-3 transition-all duration-700 ease-out sm:flex-row sm:justify-center lg:justify-start ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: mounted ? "240ms" : "0ms" }}
          >
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
              className="group flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 active:translate-y-0 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-110">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    ZADZWOŃ
                  </span>
                  <span className="block text-xs text-white/85">
                    {phoneNumber}
                  </span>
                </span>
              </span>
              <ChevronRight
                size={18}
                className="text-white/70 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href={`sms:${phoneNumber.replace(/\s+/g, "")}?body=INTERNET`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 active:translate-y-0 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">
                    ZOSTAW SMS
                  </span>
                  <span className="block text-xs text-white/70">
                    Oddzwonimy w kilka minut
                  </span>
                </span>
              </span>
              <ChevronRight
                size={18}
                className="text-white/50 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        {/* Kolumna ze zdjęciem doradcy — tylko na desktopie, tak jak TvMockup w Hero */}
        {isDesktop && (
          <div
            className={`relative z-10 flex justify-center transition-all duration-700 ease-out lg:justify-end ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: mounted ? "300ms" : "0ms" }}
          >
            <div className="group relative w-full max-w-[280px] transition-transform duration-500 hover:-translate-y-1">
              {/* poświata pod kartą, ten sam odcień teal co reszta akcentów */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-2xl bg-teal-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors duration-300 group-hover:border-white/20">
                {/* dymek z wiadomością */}
                <div
                  className={`absolute left-4 top-4 z-10 rounded-xl rounded-bl-sm border border-white/10 bg-[#0B2A3D]/90 px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-500 ease-out ${
                    mounted
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-2 scale-95 opacity-0"
                  }`}
                  style={{ transitionDelay: mounted ? "550ms" : "0ms" }}
                >
                  Jestem tu, żeby Ci pomóc 👋
                </div>

                {/* zdjęcie */}
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-white/5">
                  {advisorPhotoUrl ? (
                    <img
                      src={advisorPhotoUrl}
                      alt={advisorName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                      Dodaj zdjęcie doradcy
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2A3D]/80 via-transparent to-transparent" />
                </div>

                {/* podpis */}
                <div className="px-2 pb-2 pt-3">
                  <p className="text-sm font-bold leading-tight text-white">
                    {advisorName}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                    {advisorRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}