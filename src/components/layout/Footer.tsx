"use client";

import React from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { trackContact } from "@/lib/meta-track";

/* ------------------------------------------------------------------ */
/* Dane                                                                */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
}

/* [ZMIANA — ONE PAGE] Linki przepisane na kotwice sekcji.
   Poprzednia wersja wskazywała na /pomoc/faq, /blog i /pomoc/awarie —
   te podstrony po przejściu na one-page nie istnieją, więc trzy z czterech
   linków w stopce prowadziłyby na 404. Zostaje polityka prywatności
   (osobna strona) plus kotwice zgodne z Headerem.

   Kotwice mają postać "/#sekcja", a nie "#sekcja", żeby działały też ze
   strony polityki prywatności — inaczej z tej podstrony klikaliby w
   kotwicę do sekcji, której na niej nie ma. */
const FOOTER_LINKS: FooterLink[] = [
  { label: "Pakiety", href: "/#pakiety" },
  { label: "Programy TV", href: "/#programy-tv" },
  { label: "Jak zamówić", href: "/#jak-zamowic" },
  { label: "Kontakt", href: "/#kontakt" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
];

const CURRENT_YEAR = new Date().getFullYear();

/* ------------------------------------------------------------------ */
/* Dane przedstawiciela                                                 */
/*                                                                      */
/* Rozdzielenie przedstawiciela od operatora jest wymagane przez zasady  */
/* Google Ads (wprowadzanie w błąd co do tożsamości reklamodawcy) —      */
/* stopka w stylu "© Netia. Wszelkie prawa zastrzeżone." sugerowałaby,   */
/* że to serwis samego operatora, co grozi zawieszeniem konta bez        */
/* ostrzeżenia. Jedna linia poniżej załatwia to samo co poprzednie trzy  */
/* akapity, o ile zawiera NIP — bo to on identyfikuje podmiot.           */
/*                                                                      */
/* TODO — UZUPEŁNIJ PRZED WDROŻENIEM:                                    */
/*  • REP_COMPANY: nazwa firmy, pod którą prowadzisz działalność         */
/*    (we wzorze, który podałeś, to "nTel" przed nazwiskiem). Jeśli      */
/*    działasz bez nazwy handlowej, ustaw pusty string — komponent       */
/*    pominie ten człon.                                                 */
/*  • REP_NIP: Twój numer NIP. Numer z podanego wzoru (5422709806)       */
/*    należy do tamtego przedstawiciela, więc go tu NIE wpisałem —       */
/*    cudzy NIP w stopce to podanie się za inny podmiot.                 */
/* ------------------------------------------------------------------ */
const REP_COMPANY = ""; // np. "nTel" — zostaw puste, jeśli bez nazwy
const REP_NAME = "Jarosław Sitek";
const REP_EMAIL = "jaroslaw.sitek@przedstawiciel.netia.pl";

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
      aria-label={`${REP_NAME} — autoryzowany partner Netia, strona główna`}
    >
      <img
        src="/images/Placeholder.svg"
        alt={`Netia — oferta autoryzowanego partnera ${REP_NAME}`}
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
        className="inline-block rounded-full px-2.5 py-1.5 text-xs font-semibold text-white/85 transition-colors duration-200 hover:text-white sm:px-3 sm:text-sm"
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

/** Kreska rozdzielająca człony linii z danymi. Ukryta na telefonie —
 *  tam człony i tak zawijają się do kilku linii, a pionowe kreski w
 *  losowych miejscach zawijania wyglądają jak błąd. */
function Sep() {
  return (
    <span aria-hidden="true" className="hidden text-white/25 sm:inline">
      |
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Footer główny                                                       */
/* ------------------------------------------------------------------ */

export default function NetiaFooter() {
  return (
    <LazyMotion features={domAnimation} strict>
      <footer style={{ backgroundColor: "#0B2A3D" }} className="font-sans">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
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
                Autoryzowany partner
              </span>
            </m.div>

            <m.nav
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={1}
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 sm:gap-x-2"
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
              className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row"
            >
              <m.a
                href={`tel:${PHONE_HREF}`}
                onClick={() => trackContact("footer_phone_button")}
                whileTap={{ scale: 0.97 }}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-teal-500 px-5 text-sm font-bold text-white sm:w-fit"
              >
                <Phone size={15} />
                Zadzwoń
              </m.a>
              <m.a
                href={`sms:${PHONE_HREF}?body=${SMS_BODY}`}
                onClick={() => trackContact("footer_sms_button")}
                whileTap={{ scale: 0.97 }}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-fit"
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

          {/* [ZMIANA] Jedna linia danych zamiast trzech akapitów.
              Wyleciały: akapit o rozdziale ról ze znakami towarowymi, akapit
              o art. 66 § 1 KC i osobna linia "Kontakt:". Wszystko, co miało
              znaczenie identyfikacyjne (kto, w jakiej roli, NIP, kontakt),
              siedzi w tej jednej linii — reszta była powtórzeniem tego, co
              i tak stoi przy cenach w sekcji ofert.

              Telefon i mail zostają klikalne: w stopce to często ostatnia
              szansa na kontakt u kogoś, kto przewinął całą stronę. */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={3}
            variants={fadeUp}
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-white/60 sm:text-xs">
              <span className="font-semibold text-white/80">
                {REP_COMPANY ? `${REP_COMPANY} ` : ""}
                {REP_NAME}
              </span>
              <Sep />
              <span>Autoryzowany partner firmy Netia</span>
              <Sep />
              <Sep />
              <a
                href={`tel:${PHONE_HREF}`}
                onClick={() => trackContact("footer_inline_phone")}
                className="tabular-nums underline underline-offset-2 transition-colors hover:text-white/85"
              >
                tel.: {PHONE}
              </a>
              <Sep />
              <a
                href={`mailto:${REP_EMAIL}`}
                onClick={() => trackContact("footer_inline_email")}
                className="break-all underline underline-offset-2 transition-colors hover:text-white/85"
              >
                {REP_EMAIL}
              </a>
            </p>

            <p className="text-[11px] text-white/35 sm:text-xs">
              © {CURRENT_YEAR} {REP_NAME}
            </p>
          </m.div>
        </div>
      </footer>
    </LazyMotion>
  );
}