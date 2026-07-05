"use client";

import { useEffect, useState } from "react";
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
  advisorPhotoUrl,
  phoneNumber = "+48 883 334 124",
}: ContactSectionProps) {
  const isDesktop = useIsDesktop();

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden font-sans"
    >
      <div className="relative z-10 mx-auto grid max-w-320 grid-cols-1 items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:py-16">
        {/* Kolumna tekstowa */}
        <div className="relative z-10 text-center lg:text-left">
          {/* Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 lg:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Porozmawiajmy o Twoim internecie
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            Skontaktuj się —{" "}
            <span className="text-teal-300">zadzwoń</span> lub{" "}
            <span className="text-teal-300">zostaw SMS</span>
          </h2>

          <h3 className="mx-auto mt-2.5 max-w-xl text-sm font-normal text-white/65 sm:text-base lg:mx-0">
            Szybki kontakt. Zero formalności. Pomożemy dobrać{" "}
            <span className="font-semibold text-white">
              najlepszy internet
            </span>{" "}
            dla Ciebie.
          </h3>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white transition hover:bg-teal-400 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
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
              <ChevronRight size={18} className="text-white/70" />
            </a>

            <a
              href={`sms:${phoneNumber.replace(/\s+/g, "")}?body=INTERNET`}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition hover:bg-white/10 sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
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
              <ChevronRight size={18} className="text-white/50" />
            </a>
          </div>
        </div>

        {/* Kolumna ze zdjęciem doradcy — tylko na desktopie, tak jak TvMockup w Hero */}
        {isDesktop && (
          <div className="relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px]">
              {/* poświata pod kartą, ten sam odcień teal co reszta akcentów */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-2xl bg-teal-500/20 blur-2xl"
              />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                {/* dymek z wiadomością */}
                <div className="absolute left-4 top-4 z-10 rounded-xl rounded-bl-sm border border-white/10 bg-[#0B2A3D]/90 px-3 py-2 text-xs font-medium text-white shadow-lg">
                  Jestem tu, żeby Ci pomóc 👋
                </div>

                {/* zdjęcie */}
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-white/5">
                  {advisorPhotoUrl ? (
                    <img
                      src={advisorPhotoUrl}
                      alt={advisorName}
                      className="h-full w-full object-cover"
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