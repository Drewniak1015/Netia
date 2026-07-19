"use client";

import { Suspense, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useReducedMotion, AnimatePresence } from "framer-motion";
import { Wifi, Tv, Smartphone, Gift, Flame } from "lucide-react";
import type { Tier } from "@/lib/channels";
import type { Oferta5G } from "@/components/Konfigurator/Oferta5G";
import DottedBackground from "@/components/ui/DottedBackground";

import { KonfiguratorProvider, useKonfigurator } from "./KonfiguratorContext";
import type { UmowaType } from "./types";
import { PAKIETY_24, PAKIETY_BEZ } from "./pakiety";
import { OFERTY_TV, OFERTY_5G, OFERTY_DODATKOWE, OFERTY_5G_BEZ, OFERTY_DODATKOWE_BEZ } from "./oferty";
import type { Pakiet, Oferta, OfertaDodatek } from "./types";

import KafelekPakietu from "./KafelekPakietu";
import KafelekOferty from "./KafelekOferty";
import KafelekTV from "./KafelekTV";
import PrzelacznikUmowy from "./PrzelacznikUmowy";
import NotaPrawna from "./NotaPrawna";

export { KonfiguratorProvider, useKonfigurator } from "./KonfiguratorContext";
export type { UmowaType, WybranaPozycja, Oferta } from "./types";

/* ---------------------------------------------------------------------- */
/*  FIX (TBT): wszystko poniżej nie jest potrzebne do pierwszego renderu — */
/*  widget stopki i WSZYSTKIE modale (otwierane dopiero po kliknięciu)     */
/*  ładujemy leniwie, żeby nie wchodziły w koszt Script Evaluation na      */
/*  starcie strony. To jest największa dźwignia optymalizacji: pięć        */
/*  osobnych komponentów modali (z ikonami, animacjami, listami kanałów)   */
/*  potrafiło ważyć więcej niż reszta strony razem wzięta, a 95% userów    */
/*  nigdy ich nie otwiera.                                                */
/* ---------------------------------------------------------------------- */
const PodsumowanieFixed = dynamic(
  () => import("@/components/Konfigurator/konfiguratorFixed"),
  { ssr: false }
);
const Uslugi5GModal = dynamic(
  () => import("@/components/Konfigurator/Oferta5G"),
  { ssr: false }
);
const RouterModal = dynamic(() => import("./RouterModal"), { ssr: false });
const InfoModal = dynamic(() => import("./InfoModal"), { ssr: false });
const KanalyModal = dynamic(() => import("./KanalyModal"), { ssr: false });
const AddonKanalyModal = dynamic(() => import("./AddonKanalyModal"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------------------------------------------------------------- */
/*  Główny komponent (czyta ?umowa=24 lub ?umowa=bez z URL)                */
/* ---------------------------------------------------------------------- */
function KonfiguratorZawartosc() {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const paramUmowa = searchParams.get("umowa");

  // Wybory (umowa + pakiet + oferty) żyją we wspólnym kontekście, a nie w
  // lokalnym useState — dzięki temu widget PodsumowanieFixed (osadzony np.
  // na innych stronach) widzi tę samą, wyłącznie sesyjną daną.
  const {
    umowa,
    pakiet: wybranyPakietObj,
    tv: wybranaTvObj,
    uslugi5g: wybrana5gObj,
    dodatki: wybraneDodatki,
    setUmowa,
    setPakiet,
    setTv,
    setUslugi5g,
    toggleDodatek,
  } = useKonfigurator();

  const [aktywnyRouterId, setAktywnyRouterId] = useState<string | null>(null);
  const [aktywnyInfoId, setAktywnyInfoId] = useState<string | null>(null);
  const [aktywnyKanalyTier, setAktywnyKanalyTier] = useState<Tier | null>(null);
  const [aktywnaOferta5G, setAktywnaOferta5G] = useState<Oferta5G | null>(null);
  const [aktywnyDodatekAddon, setAktywnyDodatekAddon] = useState<string | null>(null);

  const pakiety = umowa === "24" ? PAKIETY_24 : PAKIETY_BEZ;
  const oferty5g = umowa === "24" ? OFERTY_5G : OFERTY_5G_BEZ;
  const ofertyDodatkowe = umowa === "24" ? OFERTY_DODATKOWE : OFERTY_DODATKOWE_BEZ;

  // FIX (TBT): lista dodatków zależnych od TV filtrowana raz na zmianę
  // zależności, a nie tworzona od nowa w JSX przy każdym renderze.
  const widoczneDodatki = useMemo(
    () =>
      (ofertyDodatkowe as OfertaDodatek[]).filter(
        (oferta) => !oferta.addonKey || wybranaTvObj !== null
      ),
    [ofertyDodatkowe, wybranaTvObj]
  );

  const togglePakiet = useCallback(
    (pakiet: Pakiet) => {
      setPakiet(
        wybranyPakietObj?.id === pakiet.id
          ? null
          : { id: pakiet.id, nazwa: pakiet.nazwa, cena: pakiet.cena }
      );
    },
    [setPakiet, wybranyPakietObj]
  );

  const toggleTv = useCallback(
    (oferta: Oferta) => {
      setTv(
        wybranaTvObj?.id === oferta.id
          ? null
          : { id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }
      );
    },
    [setTv, wybranaTvObj]
  );

  const toggle5g = useCallback(
    (oferta: Oferta) => {
      setUslugi5g(
        wybrana5gObj?.id === oferta.id
          ? null
          : { id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }
      );
    },
    [setUslugi5g, wybrana5gObj]
  );

  const toggleDodatekHandler = useCallback(
    (oferta: OfertaDodatek) =>
      toggleDodatek({ id: oferta.id, nazwa: oferta.nazwa, cena: oferta.cena }),
    [toggleDodatek]
  );

  const zmienUmowe = useCallback(
    (nowaUmowa: UmowaType) => {
      setUmowa(nowaUmowa);
    },
    [setUmowa]
  );

  // Czy już zdążyliśmy choć raz zareagować na parametr z URL w tej sesji
  // komponentu — zapobiega to resetowi przy zwykłym ponownym wejściu na
  // stronę, gdy paramUmowa się nie zmienił względem tego, co user miał
  // wcześniej ustawione (i co jest już wczytane z sessionStorage).
  const poprzedniParamUmowa = useRef<string | null>(null);
  const pierwszyRender = useRef(true);

  useEffect(() => {
    if (paramUmowa !== "bez" && paramUmowa !== "24") {
      pierwszyRender.current = false;
      return;
    }

    if (pierwszyRender.current) {
      pierwszyRender.current = false;
      poprzedniParamUmowa.current = paramUmowa;
      if (paramUmowa !== umowa) {
        zmienUmowe(paramUmowa);
      }
      return;
    }

    if (paramUmowa !== poprzedniParamUmowa.current) {
      poprzedniParamUmowa.current = paramUmowa;
      if (paramUmowa !== umowa) {
        zmienUmowe(paramUmowa);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramUmowa]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        style={{ backgroundColor: "#0B2A3D" }}
        className="relative overflow-hidden font-sans py-16 sm:py-20 lg:py-24"
        id="konfigurator"
      >
        <div className="relative z-10 mx-auto max-w-320 px-5 sm:px-6 lg:px-8 pt-4 sm:pt-0">
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto flex max-w-310 flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12 mt-12"
            style={{
              background:
                "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
            }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

            <svg
              className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="150" cy="55" r="5" fill="#2DD4BF" />
              <circle cx="150" cy="55" r="28" stroke="#2DD4BF" strokeOpacity="0.55" strokeWidth="2" />
              <circle cx="150" cy="55" r="52" stroke="#2DD4BF" strokeOpacity="0.32" strokeWidth="2" />
              <circle cx="150" cy="55" r="76" stroke="#99F6E4" strokeOpacity="0.18" strokeWidth="2" />
              <path
                d="M35 165 L85 118 L115 136 L165 78"
                stroke="#99F6E4"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 7"
              />
              <circle cx="35" cy="165" r="3.5" fill="#99F6E4" />
              <circle cx="85" cy="118" r="3.5" fill="#99F6E4" />
              <circle cx="115" cy="136" r="3.5" fill="#99F6E4" />
              <circle cx="165" cy="78" r="3.5" fill="#2DD4BF" />
            </svg>

            <m.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
            >
              <Flame size={13} className="fill-current" />
              Skonfiguruj pakiet
              <Flame size={13} className="fill-current" />
            </m.span>

            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Wybierz długość umowy{" "}
              <span className="text-teal-300">i pakiet dla siebie</span>
            </m.h1>

            <m.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative z-10 mt-1 max-w-xl text-sm text-white/65 sm:text-base"
            >
              {umowa === "24"
                ? "Pakiety internetowe z telewizją i usługami dodatkowymi."
                : "Elastyczna oferta bez zobowiązań: internet, usługi mobilne i dodatki."}
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="relative z-10 mt-5"
            >
              <PrzelacznikUmowy umowa={umowa} setUmowa={zmienUmowe} />
            </m.div>
          </m.div>

          <div className="relative mt-10 lg:mt-14">
            <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <DottedBackground variant="dots" size={22} />
            </div>

            <div className="relative">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                <Wifi size={22} className="text-teal-300" />
                Internet
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                {pakiety.map((pakiet, i) => (
                  <KafelekPakietu
                    key={pakiet.id}
                    pakiet={pakiet}
                    umowa={umowa}
                    wybrany={wybranyPakietObj?.id === pakiet.id}
                    onWybierz={() => togglePakiet(pakiet)}
                    onPokazRouter={setAktywnyRouterId}
                    delay={0.1 * i}
                  />
                ))}
              </div>

              {/* FIX (CLS/TBT): blok jest montowany/odmontowywany zamiast
                  animować height:"auto" — Framer Motion animuje tylko
                  opacity/y (kompozytowane przez GPU, bez reflow w locie). */}
              <AnimatePresence initial={false}>
                {wybranyPakietObj !== null && (
                  <m.div
                    key="sekcje-ofert"
                    initial={reduceMotion ? false : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {umowa === "24" && (
                      <div className="mt-12 lg:mt-16">
                        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                          <Tv size={22} className="text-teal-300" />
                          Telewizja
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                          {OFERTY_TV.map((oferta, i) => (
                            <KafelekTV
                              key={oferta.id}
                              oferta={oferta}
                              wybrana={wybranaTvObj?.id === oferta.id}
                              onWybierz={() => toggleTv(oferta)}
                              onPokazDekoder={() => setAktywnyInfoId("dekoder-evobox")}
                              onPokazKanaly={setAktywnyKanalyTier}
                              delay={0.08 * i}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-12 lg:mt-16">
                      <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                        <Smartphone size={22} className="text-teal-300" />
                        Usługi Mobilne 5G
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                        {oferty5g.map((oferta, i) => (
                          <KafelekOferty
                            key={oferta.id}
                            oferta={oferta}
                            wybrana={wybrana5gObj?.id === oferta.id}
                            onWybierz={() => toggle5g(oferta)}
                            onPokazSzczegoly={
                              "gradient" in oferta ? () => setAktywnaOferta5G(oferta as Oferta5G) : undefined
                            }
                            gradient={"gradient" in oferta ? (oferta as Oferta5G).gradient : undefined}
                            delay={0.08 * i}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-12 lg:mt-16">
                      <h2 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                        <Gift size={22} className="text-teal-300" />
                        Usługi Dodatkowe
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-5 p-1 sm:grid-cols-2 lg:grid-cols-3">
                        {widoczneDodatki.map((oferta, i) => (
                          <KafelekOferty
                            key={oferta.id}
                            oferta={oferta}
                            wybrana={wybraneDodatki.some((d) => d.id === oferta.id)}
                            onWybierz={() => toggleDodatekHandler(oferta)}
                            onPokazKanaly={
                              oferta.addonKey ? () => setAktywnyDodatekAddon(oferta.addonKey!) : undefined
                            }
                            delay={0.08 * i}
                          />
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <PodsumowanieFixed />

          <NotaPrawna />
        </div>

        {/* Modale ładowane leniwie (next/dynamic, ssr:false) — mountują się
            i doładowują swój kod dopiero, gdy stan przestaje być null. */}
        <RouterModal routerId={aktywnyRouterId} onClose={() => setAktywnyRouterId(null)} />
        <InfoModal infoId={aktywnyInfoId} onClose={() => setAktywnyInfoId(null)} />
        <KanalyModal tier={aktywnyKanalyTier} onClose={() => setAktywnyKanalyTier(null)} />
        <Uslugi5GModal oferta={aktywnaOferta5G} onClose={() => setAktywnaOferta5G(null)} />
        <AddonKanalyModal addonKey={aktywnyDodatekAddon} onClose={() => setAktywnyDodatekAddon(null)} />
      </section>
    </LazyMotion>
  );
}

/* useSearchParams wymaga granicy Suspense w Next.js App Router.
   UWAGA: <KonfiguratorProvider> NIE jest owinięty tutaj — musi siedzieć
   wyżej, w app/layout.tsx (patrz KonfiguratorContext.tsx), żeby
   <PodsumowanieFixed /> na innych stronach widział ten sam, współdzielony
   stan wyboru. Owijanie go lokalnie tutaj zerwałoby tę współdzieloność. */
export default function Konfigurator() {
  return (
    <Suspense fallback={null}>
      <KonfiguratorZawartosc />
    </Suspense>
  );
}
