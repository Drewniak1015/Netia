"use client";

import React from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { trackContact } from "@/lib/meta-track";

/* ------------------------------------------------------------------ */
/* Dane — edytuj / podmieniaj swobodnie                                */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: "Polityka Prywatności", href: "/polityka-prywatnosci" },
  { label: "Regulamin promocji", href: "/regulamin-promocji" },
  { label: "Pomoc", href: "/pomoc/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/pomoc/awarie" },
];

const CURRENT_YEAR = new Date().getFullYear();

// Dane osoby prowadzącej serwis. Usługę telekomunikacyjną świadczy
// Netia S.A. — ta strona jest prowadzona przez autoryzowanego
// przedstawiciela handlowego, który zajmuje się sprzedażą i obsługą
// zgłoszenia.
//
// Rozdzielenie tych dwóch podmiotów jest wymagane przez zasady Google Ads
// (sekcja o wprowadzaniu w błąd co do tożsamości reklamodawcy) —
// wcześniejsza stopka "© Netia. Wszelkie prawa zastrzeżone." sugerowała,
// że jest to serwis samego operatora, co grozi zawieszeniem konta
// reklamowego bez ostrzeżenia.
const REP_NAME = "Jarosław Sitek";
const REP_EMAIL = "jaroslaw.sitek@przedstawiciel.netia.pl";

// Ten sam numer i domyślna treść SMS-a co w Hero.tsx — wcześniej Header/
// Footer wskazywały na inny numer (+48 883 334 124) niż reszta strony
// (+48 887 843 260), co rozjeżdżało tracking i myliło użytkowników, którzy
// dzwonili z różnych miejsc na stronie pod różne numery.
const PHONE = "+48 887 843 260";
const PHONE_HREF = "+48887843260";
const SMS_BODY = encodeURIComponent(
  "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
);

/* ------------------------------------------------------------------ */
/* Warianty animacji                                                   */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
  }),
};

const underlineVariants: Variants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: { scaleX: 1, opacity: 1 },
};

/* ------------------------------------------------------------------ */
/* Elementy pomocnicze                                                 */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center shrink-0"
      aria-label={`${REP_NAME} — autoryzowany przedstawiciel Netia, strona główna`}
    >
      {/*
        FIX (CLS): tak samo jak w Header.tsx — brakowało width/height,
        więc przeglądarka nie rezerwowała miejsca na obrazek przed jego
        załadowaniem. width/height poniżej odpowiadają bazowej wysokości
        h-12 (48px) przy proporcji SVG 666:256 (≈2.54:1) → ~122×48.
        Nowoczesne przeglądarki same przeliczają aspect-ratio z tych
        atrybutów, więc responsywne klasy (sm:h-14 lg:h-16) nadal działają
        poprawnie — width się przelicza automatycznie na każdym breakpoincie,
        nie trzeba osobnych wartości na każdy rozmiar.

        UWAGA: samo alt nie wystarczy, jeśli wizualnie widnieje wyłącznie
        logo operatora. Dlatego pod logo dochodzi podpis "Autoryzowany
        przedstawiciel" — patrz blok w footerze poniżej.
      */}
      <img
        src="/images/Placeholder.svg"
        alt={`Netia — oferta autoryzowanego przedstawiciela ${REP_NAME}`}
        width={122}
        height={48}
        className="h-12 w-auto sm:h-14 lg:h-16"
      />
    </Link>
  );
}

function FooterNavLink({ label, href }: FooterLink) {
  return (
    <m.div initial="rest" whileHover="hover" animate="rest" className="relative">
      <Link
        href={href}
        className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold text-white/85 transition-colors duration-200 hover:text-white sm:px-3 sm:text-sm"
      >
        {label}
      </Link>
      <m.span
        variants={underlineVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-teal-400 sm:left-3 sm:right-3"
      />
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer główny                                                       */
/* ------------------------------------------------------------------ */

export default function NetiaFooter() {
  return (
    <LazyMotion features={domAnimation} strict>
      <footer style={{ backgroundColor: "#0B2A3D" }} className="font-sans">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {/* Górny rząd: logo + linki + CTA */}
          <div className="flex flex-col items-center gap-6 text-center sm:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0}
              variants={fadeUp}
              className="flex flex-col items-center gap-1.5 lg:items-start"
            >
              <Logo />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                Autoryzowany przedstawiciel
              </span>
            </m.div>

            <m.nav
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={1}
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-2"
            >
              {FOOTER_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                  <FooterNavLink {...link} />
                  {i < FOOTER_LINKS.length - 1 && (
                    <span
                      className="hidden h-3.5 w-px bg-white/20 sm:inline-block"
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              ))}
            </m.nav>

            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={2}
              variants={fadeUp}
              className="flex flex-col items-center gap-2 sm:flex-row"
            >
              <m.a
                href={`tel:${PHONE_HREF}`}
                onClick={() => trackContact("footer_phone_button")}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(20,184,166,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="flex w-fit items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white"
              >
                <Phone size={15} />
                Zadzwoń
              </m.a>
              <m.a
                href={`sms:${PHONE_HREF}?body=${SMS_BODY}`}
                onClick={() => trackContact("footer_sms_button")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle size={15} />
                SMS
              </m.a>
            </m.div>
          </div>

          {/* Separator */}
          <m.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            style={{ originX: 0.5 }}
            className="my-6 h-px w-full bg-white/10 sm:my-7 lg:my-8"
          />

          {/* Dolny rząd: copyright + informacja o statusie przedstawiciela */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={3}
            variants={fadeUp}
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="text-xs text-white/70 sm:text-sm">
              © {CURRENT_YEAR} {REP_NAME} — autoryzowany przedstawiciel Netia S.A.
            </p>

            <p className="max-w-3xl text-[11px] leading-relaxed text-white/55 sm:text-xs">
              Serwis prowadzi {REP_NAME}, autoryzowany przedstawiciel handlowy
              Netia S.A. Usługi telekomunikacyjne świadczy Netia S.A. z siedzibą
              w Warszawie — ja zajmuję się sprzedażą, doradztwem i obsługą
              Twojego zgłoszenia. Netia oraz logo Netia są znakami towarowymi
              Netia S.A. i wykorzystywane są za zgodą właściciela.
            </p>

            <p className="max-w-3xl text-[11px] leading-relaxed text-white/45 sm:text-xs">
              Prezentowane ceny i parametry mają charakter informacyjny i nie
              stanowią oferty w rozumieniu art. 66 § 1 Kodeksu cywilnego.
              Wiążące warunki, w tym dostępna technologia pod danym adresem,
              określa umowa oraz regulamin promocji. Dostępność usługi
              i maksymalne prędkości zależą od infrastruktury w lokalizacji.
            </p>

            <p className="text-[11px] text-white/40 sm:text-xs">
              Kontakt:{" "}
              <a
                href={`tel:${PHONE_HREF}`}
                className="underline underline-offset-2 transition-colors hover:text-white/70"
              >
                {PHONE}
              </a>{" "}
              ·{" "}
              <a
                href={`mailto:${REP_EMAIL}`}
                className="underline underline-offset-2 transition-colors hover:text-white/70"
              >
                {REP_EMAIL}
              </a>
            </p>
          </m.div>
        </div>
      </footer>
    </LazyMotion>
  );
}