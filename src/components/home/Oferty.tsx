"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
import { Flame, Shield } from "lucide-react";
import { offers, maxOffers } from "@/components/home/Offersdata";
import OfferCard from "@/components/home/Offercard";
import MaxOfferCard from "@/components/home/Maxoffercard";
import { SzczegolyOferty } from "@/components/home/Promocena";
import {
  SMOOTH_EASE,
  gridVariants,
  headerGroupVariants,
  headerItemVariants,
} from "@/components/home/Motionconfig";

/* [PODZIAŁ] InfoModal (i cały jego duży zestaw danych INFO_ITEMS —
   opisy routerów, tabele specyfikacji, tabele porównawcze) trafia teraz
   do osobnego chunku, pobieranego przez przeglądarkę dopiero po
   kliknięciu w pozycję z `infoId`. Wcześniej cały ten balast trafiał do
   initial JS bundle strony głównej, nawet jeśli nikt nigdy nie otworzył
   popupu. `ssr: false`, bo modal jest czysto interaktywny — nie jest
   potrzebny w wygenerowanym przez serwer HTML-u i nie wpływa na SEO. */
const InfoModal = dynamic(() => import("@/components/home/Infomodal"), {
  ssr: false,
});

interface OfertyProps {
  cityLocative?: string;
  defaultOferta?: "podstawa" | "max";
}

export default function Oferty({ cityLocative, defaultOferta = "max" }: OfertyProps = {}) {
  const reduceMotion = useReducedMotion();
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [tryb, setTryb] = useState<"podstawa" | "max">(defaultOferta);

  const handlePokazInfo = useCallback((infoId: string) => setAktywnyInfoId(infoId), []);
  const handleCloseModal = useCallback(() => setAktywnyInfoId(null), []);
  const handleWybierzPodstawa = useCallback(() => setTryb("podstawa"), []);
  const handleWybierzMax = useCallback(() => setTryb("max"), []);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        className="relative w-full py-8 px-8 overflow-hidden"
        style={{ backgroundColor: "#0B2A3D" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(45,212,191,0.06), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(236,72,153,0.05), transparent 60%)",
          }}
        />

        <div className="relative max-w-305 mx-auto">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headerGroupVariants}
            className="text-center mb-10"
          >
            <m.div
              variants={headerItemVariants}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70"
            >
              <Shield size={13} className="text-teal-300" />
              14 dni na rezygnację, zero pytań
            </m.div>
            <m.h2
              variants={headerItemVariants}
              className="text-4xl md:text-5xl font-extrabold text-white"
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
            </m.h2>
            <m.p variants={headerItemVariants} className="mt-3 text-slate-400 text-base">
              <span className="font-semibold text-white/80">Podstawa</span> — szybki, stabilny
              internet od 70 zł/mies.
              <br />
              <span className="font-semibold text-white/80">MAX</span> — internet + telewizja L
              4K + pełna ochrona. Abonament 12 miesięcy za 0 zł po rabatach.
            </m.p>

            <m.div
              variants={headerItemVariants}
              role="tablist"
              aria-label="Wybór trybu oferty"
              className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1"
            >
              <m.span
                aria-hidden="true"
                animate={{
                  x: tryb === "max" ? "calc(100% + 8px)" : 0,
                }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full ${
                  tryb === "max"
                    ? "bg-gradient-to-r from-pink-500 to-pink-400"
                    : "bg-gradient-to-r from-teal-500 to-teal-400"
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
            </m.div>
          </m.div>

          <AnimatePresence mode="wait">
            {tryb === "podstawa" ? (
              <m.div
                key="podstawa"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              >
                <m.div
                  initial="hidden"
                  animate="visible"
                  variants={gridVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
                >
                  {offers.map((offer) => (
                    <OfferCard
                      key={`${offer.speed}-${offer.pkg}`}
                      offer={offer}
                      reduceMotion={!!reduceMotion}
                      onPokazInfo={handlePokazInfo}
                    />
                  ))}
                </m.div>

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
              </m.div>
            ) : (
              <m.div
                key="max"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              >
                <m.div
                  initial="hidden"
                  animate="visible"
                  variants={gridVariants}
                  className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 items-stretch"
                >
                  {maxOffers.map((offer) => (
                    <MaxOfferCard
                      key={offer.name}
                      offer={offer}
                      reduceMotion={!!reduceMotion}
                      onPokazInfo={handlePokazInfo}
                    />
                  ))}
                </m.div>

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
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <InfoModal infoId={aktywnyInfoId} onClose={handleCloseModal} />
      </section>
    </LazyMotion>
  );
}