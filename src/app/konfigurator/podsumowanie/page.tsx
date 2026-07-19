"use client";

import Link from "next/link";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Phone, MessageCircle, Pencil, Wifi, Tv, Smartphone, Gift, ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { useKonfigurator } from "@/components/Konfigurator/konfigurator";
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.ofertyMax;
const kontener = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const wiersz = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// Subtelne kropkowane tło całej strony — ten sam wzorzec co na stronach
// Pomocy (Awaria/Internet/TV/Mobilne). Checkout to spokojny, liniowy widok
// (jedna kolumna, brak siatek kart), więc zamiast dokładać dekorację pod
// poszczególnymi elementami, cała strona dostaje jedną, subtelną teksturę —
// żeby czuła się jako część tego samego "materiału" co reszta serwisu.
const dottedPageStyle = {
  backgroundColor: "#0B2A3D",
  backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
} as const;

export default function PodsumowaniePage() {
  const { pakiet, tv, uslugi5g, dodatki, suma, maWybor, setTv, setUslugi5g, toggleDodatek } =
    useKonfigurator();
  const reduceMotion = useReducedMotion();

  if (!maWybor) {
    return (
      <section
        style={dottedPageStyle}
        className="min-h-[60vh] py-24 text-center font-sans"
      >
        <p className="text-white/70">Nie masz jeszcze skonfigurowanej oferty.</p>
        <Link
          href="/konfigurator"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white hover:bg-teal-400"
        >
          <ArrowLeft size={16} />
          Przejdź do konfiguratora
        </Link>
      </section>
    );
  }

  const pozycje = [
    { etykieta: "Internet", ikona: <Wifi size={16} className="text-teal-300" />, dana: pakiet, onUsun: null as (() => void) | null, promoKolor: "orange" as const },
    { etykieta: "Telewizja", ikona: <Tv size={16} className="text-teal-300" />, dana: tv, onUsun: () => setTv(null), promoKolor: "lime" as const },
    { etykieta: "Usługi 5G", ikona: <Smartphone size={16} className="text-teal-300" />, dana: uslugi5g, onUsun: () => setUslugi5g(null), promoKolor: null },
  ].filter((p) => p.dana !== null);

  const promoKlasy: Record<"orange" | "lime", string> = {
    orange: "border border-orange-400/30 bg-orange-400/10 text-orange-300",
    lime: "border border-lime-400/30 bg-lime-400/10 text-lime-300",
  };

  // Treść SMS z kontekstem wybranej konfiguracji — konsultant widzi od razu,
  // czego dotyczy zgłoszenie, zamiast pytać klienta od zera.
  const opisKonfiguracji = [
    pakiet && `Internet: ${pakiet.nazwa} (${pakiet.cena} zł)`,
    tv && `TV: ${tv.nazwa} (+${tv.cena} zł)`,
    uslugi5g && `5G: ${uslugi5g.nazwa} (+${uslugi5g.cena} zł)`,
    ...dodatki.map((d) => `Dodatek: ${d.nazwa} (+${d.cena} zł)`),
  ]
    .filter(Boolean)
    .join(", ");

  const smsBody = encodeURIComponent(
    `Dzwonię ws. skonfigurowanej oferty: ${opisKonfiguracji}. Łącznie: ${suma} zł/mies. (pierwsze 3 miesiące gratis na internet${tv ? " i TV" : ""}) + 79 zł aktywacji jednorazowo.`
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <section style={dottedPageStyle} className="min-h-screen py-16 font-sans sm:py-20">
        <m.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={reduceMotion ? undefined : kontener}
          className="mx-auto max-w-2xl px-5 sm:px-6 mt-15"
        >
          <m.div variants={reduceMotion ? undefined : wiersz}>
            <Link
              href="/konfigurator"
              className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowLeft size={15} />
              Wróć i edytuj
            </Link>
          </m.div>

          <m.h1
            variants={reduceMotion ? undefined : wiersz}
            className="mt-4 text-3xl font-extrabold text-white sm:text-4xl"
          >
            Twoje podsumowanie
          </m.h1>
          <m.p variants={reduceMotion ? undefined : wiersz} className="mt-2 text-sm text-white/60">
            Sprawdź szczegóły wybranej oferty przed kontaktem z konsultantem.
          </m.p>

          {/* Plakietka promocyjna — 3 miesiące gratis */}
          <m.div
            variants={reduceMotion ? undefined : wiersz}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300"
          >
            <Sparkles size={14} />
            Promocja: 3 miesiące gratis na internet{tv ? " i telewizję" : ""}
          </m.div>

          {/* Rozbicie na pozycje */}
          <m.div
            variants={reduceMotion ? undefined : wiersz}
            className="mt-8 overflow-hidden rounded-2xl border border-white/10"
          >
            <AnimatePresence initial={false}>
              {pozycje.map((pozycja) => (
                <m.div
                  key={pozycja.etykieta}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 overflow-hidden border-b border-white/10 px-4 py-4 last:border-none [grid-template-areas:'name_price'_'badge_badge'] sm:grid-cols-[11rem_1fr_6.5rem] sm:items-center sm:gap-3 sm:px-5 sm:[grid-template-areas:'name_badge_price'] md:grid-cols-[13rem_1fr_6.5rem]"
                >
                  <div className="flex min-w-0 items-center gap-3 [grid-area:name]">
                    {pozycja.ikona}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{pozycja.etykieta}</p>
                      <p className="truncate text-xs text-white/50">{pozycja.dana?.nazwa}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 [grid-area:price]">
                    <span className="text-sm font-bold text-white">{pozycja.dana?.cena} zł</span>
                    {pozycja.onUsun ? (
                      <m.button
                        type="button"
                        onClick={pozycja.onUsun}
                        whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                        aria-label={`Usuń: ${pozycja.etykieta}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
                      >
                        <X size={14} />
                      </m.button>
                    ) : (
                      <div className="h-7 w-7 shrink-0" aria-hidden="true" />
                    )}
                  </div>

                  {pozycja.promoKolor && (
                    <div className="flex justify-start [grid-area:badge] sm:justify-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${promoKlasy[pozycja.promoKolor]}`}>
                        <Gift size={10} />
                        3 mies. gratis
                      </span>
                    </div>
                  )}
                </m.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {dodatki.length > 0 && (
                <m.div
                  layout
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden border-b border-white/10 px-5 py-4 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <Gift size={16} className="text-teal-300" />
                    <p className="text-sm font-semibold text-white">Usługi dodatkowe</p>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-7">
                    <AnimatePresence initial={false}>
                      {dodatki.map((d) => (
                        <m.div
                          key={d.id}
                          layout
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex items-center justify-between overflow-hidden text-xs"
                        >
                          <span className="text-white/60">{d.nazwa}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">+{d.cena} zł</span>
                            <m.button
                              type="button"
                              onClick={() => toggleDodatek(d)}
                              whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                              aria-label={`Usuń: ${d.nazwa}`}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
                            >
                              <X size={12} />
                            </m.button>
                          </div>
                        </m.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            {/* Stała pozycja — jednorazowa opłata aktywacyjna, doliczana zawsze do pierwszej faktury */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 last:border-none sm:grid sm:grid-cols-[11rem_1fr_6.5rem] sm:items-center sm:gap-3 sm:px-5 md:grid-cols-[13rem_1fr_6.5rem]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Aktywacja</p>
                  <p className="text-xs text-white/50">Opłata jednorazowa, na pierwszej fakturze</p>
                </div>
              </div>
              <div className="hidden sm:block" />
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm font-bold text-white">79 zł</span>
                <div className="hidden h-7 w-7 shrink-0 sm:block" aria-hidden="true" />
              </div>
            </div>

            <div className="bg-teal-400/10 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Razem miesięcznie</span>
                <m.span
                  key={suma}
                  initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-2xl font-extrabold text-teal-300"
                >
                  {suma} zł/mies.
                </m.span>
              </div>
              <p className="mt-1 text-xs text-white/45">
                + jednorazowa aktywacja 79 zł na pierwszej fakturze
              </p>
            </div>
          </m.div>

          {/* Zaufanie / co dalej */}
          <m.div
            variants={reduceMotion ? undefined : wiersz}
            className="mt-6 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            {[
              `Pierwsze 3 miesiące ${tv ? "internetu i telewizji" : "internetu"} bez opłat`,
              "Router w cenie, montaż przez technika",
              "Bez ukrytych opłat — cena zgodna z powyższym rozbiciem",
              "Umowa i warunki potwierdzone podczas rozmowy z konsultantem",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2 text-xs text-white/70">
                <Check size={14} className="mt-0.5 shrink-0 text-teal-300" />
                {t}
              </div>
            ))}
          </m.div>

          {/* CTA finalne — z kontekstem konfiguracji */}
          <m.div variants={reduceMotion ? undefined : wiersz} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <m.a
              href="tel:+48883334124"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-teal-400"
            >
              <Phone size={17} />
              Zadzwoń i dokończ zamówienie
            </m.a>
            <m.a
              href={`sms:+48883334124?body=${smsBody}`}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle size={17} />
              Wyślij SMS z podsumowaniem
            </m.a>
          </m.div>

          <m.div variants={reduceMotion ? undefined : wiersz}>
            <Link
              href="/konfigurator"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
            >
              <Pencil size={12} />
              Zmień wybór
            </Link>
          </m.div>
        </m.div>
      </section>
    </LazyMotion>
  );
}