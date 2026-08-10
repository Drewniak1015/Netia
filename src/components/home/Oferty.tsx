"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import dynamic from "next/dynamic";
import { Flame, Shield } from "lucide-react";
import { offers, maxOffers } from "@/components/home/Offersdata";
import OfferCard from "@/components/home/Offercard";
import MaxOfferCard from "@/components/home/Maxoffercard";
import { SzczegolyOferty } from "@/components/home/Promocena";

/* [PODZIAŁ] InfoModal (i cały jego duży zestaw danych INFO_ITEMS) trafia
   do osobnego chunku, pobieranego dopiero po kliknięciu w pozycję z
   `infoId`. `ssr: false`, bo modal jest czysto interaktywny.

   UWAGA: dopasuj tę ścieżkę do faktycznej lokalizacji pliku InfoModal w
   Twoim projekcie (@/components/home/...), jeśli różni się od poniższej —
   nie mam wglądu w Twoją rzeczywistą strukturę folderów dla tego pliku. */
const InfoModal = dynamic(() => import("@/components/home/Infomodal"), {
  ssr: false,
});

/* [OPTYMALIZACJA] Ten plik nie używa już framer-motion w ogóle —
   InfoModal (jedyne miejsce, które go nadal potrzebuje) jest lazy-
   loadowany osobno, więc framer-motion nie trafia do głównego bundla
   sekcji Oferty. Animacje wejścia to IntersectionObserver + CSS
   @keyframes (ten sam wzorzec co w NetiaSocialProof.tsx), a przełącznik
   zakładek Podstawa/MAX to zwykły `transition-transform` CSS zamiast
   spring z frameru. */

// Hook: returns true once the element has scrolled into view (fires once)
function useInView(
  options: IntersectionObserverInit = {}
): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isVisible];
}

interface OfertyProps {
  cityLocative?: string;
  defaultOferta?: "podstawa" | "max";
}

export default function Oferty({ cityLocative, defaultOferta = "podstawa" }: OfertyProps = {}) {
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [tryb, setTryb] = useState<"podstawa" | "max">(defaultOferta);
  const [sectionRef, sectionInView] = useInView();

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);
  const handleWybierzPodstawa = useCallback(() => setTryb("podstawa"), []);
  const handleWybierzMax = useCallback(() => setTryb("max"), []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-8 px-8 overflow-hidden"
      style={{ backgroundColor: "#0B2A3D" }}
    >
      <style>{`
        @keyframes ofertyFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ofertyPanelFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .oferty-reveal { opacity: 0; }
        .oferty-reveal.in-view {
          animation: ofertyFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .oferty-panel {
          animation: ofertyPanelFadeIn 0.35s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .oferty-reveal { opacity: 1; animation: none !important; }
          .oferty-panel { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
        }}
      />

      <div className="relative max-w-305 mx-auto">
        <div className="text-center mb-10">
          <div
            className={`oferty-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 ${
              sectionInView ? "in-view" : ""
            }`}
          >
            <Shield size={13} className="text-teal-300" />
            14 dni na rezygnację, zero pytań
          </div>
          <h2
            className={`oferty-reveal text-4xl md:text-5xl font-extrabold text-white ${
              sectionInView ? "in-view" : ""
            }`}
            style={{ animationDelay: "80ms" }}
          >
            {cityLocative ? (
              <>
                Internet w <span className="text-teal-400">{cityLocative}</span>, który nie
                zawodzi. Dwa plany,<br /> jedna decyzja.
              </>
            ) : (
              <>
                Dwa plany, jedna decyzja:{" "} <br />
                <span className="text-teal-400">70 zł</span> albo{" "}
                <span className="text-pink-400">0 zł</span>.
              </>
            )}
          </h2>
          <p
            className={`oferty-reveal mt-3 text-slate-400 text-base ${
              sectionInView ? "in-view" : ""
            }`}
            style={{ animationDelay: "140ms" }}
          >
            <span className="font-semibold text-white/80">Podstawa</span> — szybki, stabilny
            internet od 70 zł/mies.
            <br />
            <span className="font-semibold text-white/80">MAX</span> — internet + telewizja L
            4K + pełna ochrona. Abonament 12 miesięcy za 0 zł po rabatach.
          </p>

          <div
            className={`oferty-reveal relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1 ${
              sectionInView ? "in-view" : ""
            }`}
            style={{ animationDelay: "200ms" }}
            role="tablist"
            aria-label="Wybór trybu oferty"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out ${
                tryb === "max"
                  ? "translate-x-[calc(100%+8px)] bg-gradient-to-r from-pink-500 to-pink-400"
                  : "translate-x-0 bg-gradient-to-r from-teal-500 to-teal-400"
              }`}
            />
            <button
              type="button"
              role="tab"
              aria-selected={tryb === "podstawa"}
              onClick={handleWybierzPodstawa}
              className={`relative z-10 flex-1 rounded-full px-6 py-2.5 text-center text-sm font-bold transition-colors ${
                tryb === "podstawa" ? "text-[#0B2A3D]" : "text-white/70 hover:text-white"
              }`}
            >
              Podstawa
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tryb === "max"}
              onClick={handleWybierzMax}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${
                tryb === "max" ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <Flame size={14} className={tryb === "max" ? "fill-current" : ""} />
              MAX
            </button>
          </div>
        </div>

        {/* key={tryb} wymusza remount przy przełączeniu zakładki, więc
            @keyframes ofertyPanelFadeIn odgrywa się od nowa za każdym razem */}
        <div key={tryb} className="oferty-panel">
          {tryb === "podstawa" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {offers.map((offer) => (
                  <OfferCard
                    key={`${offer.speed}-${offer.pkg}`}
                    offer={offer}
                    onPokazInfo={handlePokazInfo}
                  />
                ))}
              </div>

              <SzczegolyOferty>
                Prezentowana oferta dotyczy mieszkań. W przypadku budynków jednorodzinnych obowiązuje inna oferta.
                Prezentowana oferta Netii S.A.: „Wybierz szybszy Internet 12 mies. 1/2Gb/s (PON, HFC, ETTH)”
                obowiązuje przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy
                jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku
                rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą
                fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję.
                Po 24 miesiącach cena abonamentu wzrasta o 10 zł. „Szybki Internet Max (1000, 2000)” stanowi
                wyłącznie nazwę marketingową. Usługa Internetowa oparta jest na parametrach jakości wynikających
                z maksymalnych parametrów technicznych danej technologii, w jakiej świadczona jest Usługa
                Internetowa lub wynikających z ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest
                dostępna na technologii PON. Parametry świadczenia Usługi Internetowej, w szczególności
                parametry prędkości oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie
                netia.pl. Oferta jest ograniczona terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH
                Operatora.
              </SzczegolyOferty>
            </>
          ) : (
            <>
              <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 items-stretch">
                {maxOffers.map((offer) => (
                  <MaxOfferCard
                    key={offer.name}
                    offer={offer}
                    onPokazInfo={handlePokazInfo}
                  />
                ))}
              </div>

              <SzczegolyOferty>
                Prezentowana oferta Netii S.A.: „Wybierz rabat 12 miesięcy” (PON, HFC, ETTH) obowiązuje przy
                zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy jednoczesnym
                korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W przypadku rezygnacji
                lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą fakturą
                zostanie naliczona opłata aktywacyjna w wysokości 79 zł za Internet i 2 zł za Telewizję. Po 24
                miesiącach cena abonamentu wzrasta o 10 zł. „Wybierz rabat 12 miesięcy” stanowi wyłącznie nazwę
                marketingową. Usługa Internetowa oparta jest na parametrach jakości wynikających z maksymalnych
                parametrów technicznych danej technologii, w jakiej świadczona jest Usługa Internetowa, lub
                wynikających z ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest dostępna na
                technologii PON. Parametry świadczenia Usługi Internetowej, w szczególności parametry prędkości
                oraz wpływu innych Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest
                ograniczona terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.
              </SzczegolyOferty>
            </>
          )}
        </div>
      </div>

      <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
    </section>
  );
}