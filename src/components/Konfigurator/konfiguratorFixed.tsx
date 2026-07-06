"use client";

/* ---------------------------------------------------------------------- */
/*  PodsumowanieFixed                                                      */
/*  Malutki, przypięty (fixed) pasek na dole ekranu — ZAWSZE widoczny,     */
/*  nawet przy 0 zł. Zawsze pokazuje: sumę, godziny dzwonienia 8–21 i      */
/*  przycisk "Edytuj ofertę". Strzałka odsłania/chowa WYŁĄCZNIE tabelę     */
/*  z rozbiciem na pozycje. Nie zapisuje niczego — korzysta wyłącznie ze   */
/*  stanu w pamięci sesji (useKonfigurator), więc może być osadzony na     */
/*  dowolnej innej stronie.                                                */
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
  Clock,
  Pencil,
  Wifi,
  Tv,
  Smartphone,
  Gift,
} from "lucide-react";
import { useKonfigurator } from "@/components/Konfigurator/konfigurator";

interface PodsumowanieFixedProps {
  /** Dokąd prowadzi przycisk "Edytuj ofertę" — domyślnie z powrotem do konfiguratora */
  configuratorHref?: string;
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

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 font-sans sm:px-4 sm:pb-4">
        <div className="w-full max-w-sm">
          {/* Rozwijana tabela pozycji — tylko po kliknięciu strzałki */}
          <AnimatePresence>
            {rozwinieta && (
              <m.div
                initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mb-2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                style={{ backgroundColor: "#0B2A3D" }}
              >
                <div className="max-h-[55vh] overflow-y-auto p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white/55">
                    Twoja oferta
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

          {/* Pasek zawsze widoczny: suma, godziny, edytuj ofertę, strzałka */}
          <div
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2.5 shadow-xl backdrop-blur-md sm:gap-3 sm:px-4"
            style={{ backgroundColor: "rgba(11,42,61,0.94)" }}
          >
            {/* Suma */}
            <span className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-semibold text-white/85">
              <Wifi size={14} className="hidden text-teal-300 xs:block" />
              <span className="font-extrabold text-teal-300">{suma} zł</span>
              <span className="hidden text-white/50 sm:inline">/mies.</span>
            </span>

            <span className="h-5 w-px shrink-0 bg-white/15" />

            {/* Godziny dzwonienia — zawsze widoczne */}
            <span className="hidden shrink-0 items-center gap-1.5 text-xs text-white/55 sm:flex">
              <Clock size={13} className="text-teal-300" />
              8:00–21:00
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs text-white/55 sm:hidden">
              <Clock size={13} className="text-teal-300" />
              8–21
            </span>

            <span className="h-5 w-px shrink-0 bg-white/15" />

            {/* Edytuj ofertę — zawsze widoczne */}
            <Link
              href={configuratorHref}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-teal-400 sm:px-3.5 sm:text-sm"
            >
              <Pencil size={13} />
              <span className="hidden sm:inline">Edytuj ofertę</span>
              <span className="sm:hidden">Edytuj</span>
            </Link>

            {/* Strzałka — pokazuje/chowa TYLKO tabelę pozycji */}
            <button
              type="button"
              onClick={() => setRozwinieta((v) => !v)}
              aria-expanded={rozwinieta}
              aria-label={rozwinieta ? "Zwiń szczegóły oferty" : "Rozwiń szczegóły oferty"}
              className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
            >
              {rozwinieta ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}