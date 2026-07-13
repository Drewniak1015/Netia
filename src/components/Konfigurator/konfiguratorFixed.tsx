"use client";

/* ---------------------------------------------------------------------- */
/*  PodsumowanieFixed                                                      */
/*  Kompaktowa "karta" przyklejona do LEWEGO DOLNEGO rogu ekranu.          */
/*  W przeciwieństwie do poprzedniej wersji (cienki pasek na całą          */
/*  szerokość, ledwo widoczny) — to jest zwarty, kontrastowy widget typu   */
/*  "chat bubble", który naturalnie przyciąga wzrok i nie zasłania treści. */
/*                                                                          */
/*  Zawsze widoczne: cena, "Edytuj ofertę", "Zadzwoń", strzałka.          */
/*  Strzałka rozsuwa kartę W GÓRĘ (bo widget jest zaczepiony u dołu),      */
/*  odsłaniając tabelę z rozbiciem na pozycje.                            */
/*  Stan wyłącznie w pamięci (useKonfigurator) — można osadzić wszędzie.  */
/* ---------------------------------------------------------------------- */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Phone,
  Wifi,
  Tv,
  Smartphone,
  Gift,
} from "lucide-react";
import { useKonfigurator } from "@/components/Konfigurator/konfigurator";

interface PodsumowanieFixedProps {
  /** Dokąd prowadzi przycisk "Edytuj ofertę" — domyślnie z powrotem do konfiguratora */
  configuratorHref?: string;
  /** Numer telefonu do przycisku "Zadzwoń" (format do href="tel:") */
  telefon?: string;
  /**
   * Ścieżki, na których widget MA SIĘ NIE pojawiać.
   * - dokładne dopasowanie: "/pomoc/najczestsze-pytania"
   * - prefiks z "*" na końcu obejmuje wszystkie podstrony: "/pomoc/*"
   * Przykład: ["/pomoc/*", "/regulamin", "/logowanie"]
   */
  ukryjNaSciezkach?: string[];
}

function pasujeDoSciezki(sciezka: string, wzorzec: string): boolean {
  if (wzorzec.endsWith("/*")) {
    const prefiks = wzorzec.slice(0, -2);
    return sciezka === prefiks || sciezka.startsWith(prefiks + "/");
  }
  return sciezka === wzorzec;
}

export default function PodsumowanieFixed({
  configuratorHref = "/#konfigurator",
  telefon = "800000000",
  ukryjNaSciezkach = [],
}: PodsumowanieFixedProps) {
  const { pakiet, tv, uslugi5g, dodatki, suma } = useKonfigurator();
  const [rozwinieta, setRozwinieta] = useState(false);
  const reduceMotion = useReducedMotion();
  const sciezka = usePathname();

  // Ta strona jest na liście wykluczeń — nic nie renderujemy
  const ukryty = ukryjNaSciezkach.some((wzorzec) => pasujeDoSciezki(sciezka, wzorzec));
  if (ukryty) return null;

  const pozycje = [
    { etykieta: "Internet", ikona: <Wifi size={14} className="text-teal-300" />, dana: pakiet },
    { etykieta: "Telewizja", ikona: <Tv size={14} className="text-teal-300" />, dana: tv },
    { etykieta: "Usługi 5G", ikona: <Smartphone size={14} className="text-teal-300" />, dana: uslugi5g },
    { etykieta: "Usługi dodatkowe", ikona: <Gift size={14} className="text-teal-300" />, dana: dodatki },
  ].filter((pozycja) => pozycja.dana !== null);

  const telHref = `tel:${telefon.replace(/\s+/g, "")}`;

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Kotwica: lewy dolny róg. Karta rośnie W GÓRĘ, więc pasek przycisków
          zawsze zostaje na tej samej wysokości — nic nie "skacze". */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start font-sans sm:bottom-6 sm:left-6">
        {/* Pasek zawsze widoczny: cena, zadzwoń, edytuj ofertę, strzałka */}
        <div
          className="flex items-center gap-2 rounded-2xl border border-white/10 py-2.5 pl-3.5 pr-2 shadow-2xl backdrop-blur-md"
          style={{ backgroundColor: "rgba(11,42,61,0.97)" }}
        >
          {/* Cena */}
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/45">
              Twoja oferta
            </span>
            <span className="mt-1 text-base font-extrabold text-teal-300">
              {suma} <span className="text-xs font-semibold text-white/60">zł/mies.</span>
            </span>
          </div>

          <span className="ml-1 h-8 w-px shrink-0 bg-white/15" />

          {/* Zadzwoń */}
          <a
            href={telHref}
            aria-label={`Zadzwoń pod numer ${telefon}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10"
          >
            <Phone size={15} />
          </a>

          {/* Edytuj ofertę */}
          <Link
            href={configuratorHref}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-400 sm:text-sm"
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">Edytuj ofertę</span>
            <span className="sm:hidden">Edytuj</span>
          </Link>

          {/* Strzałka — rozsuwa/chowa kartę ze szczegółami powyżej */}
          <button
            type="button"
            onClick={() => setRozwinieta((v) => !v)}
            aria-expanded={rozwinieta}
            aria-label={rozwinieta ? "Zwiń szczegóły oferty" : "Rozwiń szczegóły oferty"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
          >
            {rozwinieta ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {/* Rozwijana karta ze szczegółami — wysuwa się W GÓRĘ znad paska */}
        <AnimatePresence>
          {rozwinieta && (
            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-2 w-[min(88vw,320px)] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
              style={{ backgroundColor: "#0B2A3D" }}
            >
              <div className="max-h-[50vh] overflow-y-auto p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white/55">
                  Rozbicie na pozycje
                </h3>

                {pozycje.length > 0 ? (
                  <table className="mt-3 w-full text-left text-sm">
                    <tbody>
                      {pozycje.map((pozycja) => (
                        <tr
                          key={pozycja.etykieta}
                          className="border-b border-white/10 last:border-none"
                        >
                          <td className="py-2 pr-3 align-top">
                            <span className="flex items-center gap-1.5 text-white/75">
                              {pozycja.ikona}
                              {pozycja.etykieta}
                            </span>
                            <span className="mt-0.5 block pl-[20px] text-xs leading-snug text-white/45">
                              {pozycja.dana?.nazwa}
                            </span>
                          </td>
                          <td className="py-2 text-right align-top font-semibold text-white">
                            {pozycja.dana?.cena} zł
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-3 text-sm text-white/50">
                    Nie wybrałeś jeszcze żadnych usług.
                  </p>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}