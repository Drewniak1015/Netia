  "use client";

  import { useState } from "react";
  import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
  import {
    Phone,
    MessageCircle,
    ChevronRight,
    ChevronDown,
    Check,
    Router,
    Tv,
    ShieldCheck,
    Gauge,
    CreditCard,
    CalendarClock,
    Users,
    Flame,
  } from "lucide-react";

  /* Wspólny wariant fade-up — zgodnie z Hero.tsx */
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  type Offer = {
    id: string;
    /* Nagłówek prędkości — dwupoziomowy, jak "Internet do" / "300 Mb/s + TV S" */
    eyebrow: string;
    speedBold: string;
    speedSuffix?: string;
    /* Blok promocji — etykieta / duży nagłówek / dopisek gwiazdką */
    promoEyebrow?: string;
    promoHeadline?: string;
    promoNote?: string;
    /* Fallback, gdy oferta nie ma trzyczęściowego bloku promo (np. "Najczęściej wybierany") */
    badgeLabel: string;
    features: { icon: React.ReactNode; label: string }[];
    price: string;
    priceUnit: string;
    priceNote: string;
    highlighted?: boolean;
  };

  const offers: Offer[] = [
    {
      id: "net-300-tv-s",
      eyebrow: "Internet do",
      speedBold: "300 Mb/s",
      speedSuffix: "+ TV S",
      promoEyebrow: "UMOWA",
      promoHeadline: "24 miesiące",
      promoNote: "*po rabatach",
      badgeLabel: "Umowa na 24 miesiące *po rabatach",
      features: [
        { icon: <Router size={14} />, label: "Router z Wi-Fi w cenie" },
        { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie" },
      ],
      price: "40",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
    {
      id: "net-300-tv-s-4k",
      eyebrow: "Internet do",
      speedBold: "300 Mb/s",
      speedSuffix: "+ TV S 4K",
      promoEyebrow: "UMOWA",
      promoHeadline: "24 miesiące",
      promoNote: "*po rabatach",
      badgeLabel: "Umowa na 24 miesiące *po rabatach",
      features: [
        { icon: <Router size={14} />, label: "Router z Wi-Fi w cenie" },
        { icon: <Tv size={14} />, label: "Dekoder 4K w cenie" },
        { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie" },
      ],
      price: "45",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
    {
      id: "net-1000",
      eyebrow: "Internet do",
      speedBold: "1000 Mb/s",
      promoEyebrow: "ABONAMENT",
      promoHeadline: "6 miesięcy za 0 zł",
      promoNote: "*po rabatach",
      badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
      features: [
        { icon: <Router size={14} />, label: "Router Combo z ONT Wi-Fi 6" },
      ],
      price: "65",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
    {
      id: "net-1000-tv-s",
      eyebrow: "Internet do",
      speedBold: "1000 Mb/s",
      speedSuffix: "+ TV S",
      promoEyebrow: "ABONAMENT",
      promoHeadline: "6 miesięcy za 0 zł",
      promoNote: "*po rabatach",
      badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
      features: [
        { icon: <Router size={14} />, label: "Router z Wi-Fi 6 w cenie" },
        { icon: <Tv size={14} />, label: "Dekoder 4K w cenie" },
        { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie" },
      ],
      price: "70",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
    {
      id: "net-2000-tv-s",
      eyebrow: "Internet do",
      speedBold: "2000 Mb/s",
      speedSuffix: "+ TV S",
      promoEyebrow: "ABONAMENT",
      promoHeadline: "6 miesięcy za 0 zł",
      promoNote: "*po rabatach",
      badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
      highlighted: true,
      features: [
        { icon: <Router size={14} />, label: "Router Combo z ONT z Wi-Fi 7" },
        { icon: <Tv size={14} />, label: "Dekoder 4K w cenie" },
        { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie" },
      ],
      price: "85",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
    {
      id: "net-2000-tv-l",
      eyebrow: "Internet do",
      speedBold: "2000 Mb/s",
      speedSuffix: "+ TV L",
      promoEyebrow: "ABONAMENT",
      promoHeadline: "6 miesięcy za 0 zł",
      promoNote: "*po rabatach",
      badgeLabel: "Abonament 6 miesięcy za 0 zł *po rabatach",
      features: [
        { icon: <Router size={14} />, label: "Router Combo z ONT Wi-Fi 7" },
        { icon: <Tv size={14} />, label: "Dekoder 4K w cenie" },
        { icon: <ShieldCheck size={14} />, label: "Netia GO w cenie" },
        { icon: <Gauge size={14} />, label: "Giganagrywarka Basic" },
      ],
      price: "125",
      priceUnit: "zł z VAT",
      priceNote: "Przez 24 miesiące z rabatami",
    },
  ];

  const faqs: { icon: React.ReactNode; q: string; a: string }[] = [
    {
      icon: <Router size={16} />,
      q: "Co dokładnie dostaję w wybranym pakiecie?",
      a: "Każdy pakiet zawiera internet światłowodowy Netii oparty o sieć Orange, telewizję z dekoderem oraz router w cenie abonamentu. Szczegółowa lista sprzętu i usług znajduje się przy każdej ofercie powyżej.",
    },
    {
      icon: <CreditCard size={16} />,
      q: "Ile naprawdę zapłacę przez pierwsze miesiące?",
      a: "W pakietach oznaczonych jako „Abonament 6 miesięcy za 0 zł” przez pierwsze 6 miesięcy nie płacisz nic — opłata w wysokości podanej przy ofercie nalicza się od kolejnego okresu rozliczeniowego, zgodnie z regulaminem promocji.",
    },
    {
      icon: <CalendarClock size={16} />,
      q: "Na jak długo zawierana jest umowa?",
      a: "W zależności od wybranej oferty umowa obowiązuje przez 24 pełne okresy rozliczeniowe. Dokładny czas trwania i warunki znajdziesz w regulaminie danej promocji.",
    },
    {
      icon: <Gauge size={16} />,
      q: "Czy prędkość internetu jest gwarantowana?",
      a: "Prędkości podane w ofertach to prędkości maksymalne dostępne w danej technologii i lokalizacji. Realna prędkość może zależeć od parametrów łącza dostępnych pod konkretnym adresem.",
    },
    {
      icon: <Tv size={16} />,
      q: "Czy mogę dokupić dodatkowe pakiety telewizyjne?",
      a: "Tak, do każdej oferty możesz dokupić pakiety premium, takie jak kanały sportowe czy filmowe, a także dodatkowy dekoder do kolejnego telewizora.",
    },
    {
      icon: <ShieldCheck size={16} />,
      q: "Jak szybko mogę zamówić wybraną ofertę?",
      a: "Wystarczy zadzwonić lub wysłać SMS z tego miejsca — nasz doradca oddzwoni w kilka minut i przeprowadzi Cię przez cały proces zamówienia.",
    },
  ];

  export default function PopularneOferty() {
    const reduceMotion = useReducedMotion();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
      <LazyMotion features={domAnimation} strict>
        <section
          style={{ backgroundColor: "#0B2A3D" }}
          className="relative overflow-hidden font-sans py-20 sm:py-24 "
        >
          <div className="relative z-10 mx-auto max-w-320 px-5 sm:px-6 lg:px-8 pt-12">
            {/* BANER PROMO — h1 + badge + grafika sygnału + CTA */}
            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto flex max-w-310 flex-col items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 py-10 text-center sm:py-12"
              style={{
                background:
                  "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
                  "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
                  "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

              {/* Grafika SVG — kwadraty, dekoracja po prawej stronie */}
              <svg
                className="pointer-events-none absolute -right-12 -top-14 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Duży obrócony kwadrat — kontur */}
                <rect
                  x="120"
                  y="25"
                  width="70"
                  height="70"
                  rx="10"
                  stroke="#2DD4BF"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  transform="rotate(15 155 60)"
                />
                {/* Mniejszy kwadrat — kontur */}
                <rect
                  x="140"
                  y="75"
                  width="42"
                  height="42"
                  rx="8"
                  stroke="#99F6E4"
                  strokeOpacity="0.32"
                  strokeWidth="2"
                  transform="rotate(-10 161 96)"
                />
                {/* Wypełnione kwadraty w różnych rozmiarach */}
                <rect
                  x="60"
                  y="120"
                  width="16"
                  height="16"
                  rx="3"
                  fill="#2DD4BF"
                  opacity="0.7"
                  transform="rotate(20 68 128)"
                />
                <rect
                  x="95"
                  y="145"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#99F6E4"
                  opacity="0.55"
                  transform="rotate(35 100 150)"
                />
                <rect
                  x="30"
                  y="70"
                  width="9"
                  height="9"
                  rx="2"
                  fill="#99F6E4"
                  opacity="0.5"
                  transform="rotate(-15 34 74)"
                />
                <rect
                  x="165"
                  y="150"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#2DD4BF"
                  opacity="0.55"
                />
              </svg>

              {/* Grafika SVG — gwiazdki i kółka, dekoracja po lewej stronie */}
              <svg
                className="pointer-events-none absolute -left-10 -bottom-10 hidden h-52 w-52 opacity-40 sm:block lg:h-64 lg:w-64"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Kółka o różnej wielkości, w stylu "orbit" */}
                <circle cx="40" cy="150" r="4" fill="#2DD4BF" />
                <circle
                  cx="40"
                  cy="150"
                  r="22"
                  stroke="#2DD4BF"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                />
                <circle
                  cx="40"
                  cy="150"
                  r="42"
                  stroke="#99F6E4"
                  strokeOpacity="0.28"
                  strokeWidth="2"
                />

                <circle cx="120" cy="40" r="3" fill="#99F6E4" />
                <circle
                  cx="120"
                  cy="40"
                  r="16"
                  stroke="#99F6E4"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />

                {/* Gwiazdki (4-ramienne, "sparkle") w kilku miejscach */}
                <path
                  d="M75 90 L79 100 L89 104 L79 108 L75 118 L71 108 L61 104 L71 100 Z"
                  fill="#2DD4BF"
                  opacity="0.7"
                />
                <path
                  d="M150 120 L152.5 126 L158.5 128.5 L152.5 131 L150 137 L147.5 131 L141.5 128.5 L147.5 126 Z"
                  fill="#99F6E4"
                  opacity="0.6"
                />
                <path
                  d="M25 55 L27 60 L32 62 L27 64 L25 69 L23 64 L18 62 L23 60 Z"
                  fill="#99F6E4"
                  opacity="0.5"
                />
                <path
                  d="M105 165 L107 170 L112 172 L107 174 L105 179 L103 174 L98 172 L103 170 Z"
                  fill="#2DD4BF"
                  opacity="0.5"
                />

                {/* Drobne kropki dla wypełnienia */}
                <circle cx="60" cy="30" r="2.5" fill="#2DD4BF" opacity="0.6" />
                <circle cx="170" cy="70" r="2" fill="#99F6E4" opacity="0.5" />
                <circle cx="15" cy="110" r="2" fill="#2DD4BF" opacity="0.5" />
              </svg>

              <m.span
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(45,212,191,0.7)]"
              >
                <Flame size={13} className="fill-current" />
                Najpopularniejsze
                <Flame size={13} className="fill-current" />
              </m.span>

              <m.h1
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
              >
                Najczęściej wybierane{" "}
                <span className="text-teal-300">pakiety</span>
              </m.h1>

              <m.p
                initial={reduceMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative z-10 mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-white/65 sm:text-base"
              >
                <Users size={15} className="text-teal-300" />
                Internet i telewizja w najkorzystniejszych cenach — sprawdzone
                przez ponad{" "}
                <span className="font-semibold text-white">2,4 mln klientów</span>{" "}
                w całej Polsce.
              </m.p>

              <m.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="relative z-10 mt-4 flex flex-col gap-2.5 sm:flex-row"
              >
                <m.a
                  href="tel:+48883334124"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white"
                >
                  <Phone size={15} />
                  ZADZWOŃ +48 883 334 124
                </m.a>
                <m.a
                  href="sms:+48883334124?body=INTERNET"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle size={15} />
                  WYŚLIJ SMS
                </m.a>
              </m.div>
            </m.div>

            {/* Siatka ofert */}
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {offers.map((offer, i) => (
                <m.div
                  key={offer.id}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className={`relative flex h-[520px] flex-col rounded-2xl border p-6 ${
                    offer.highlighted
                      ? "border-amber-400/60 bg-white/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {offer.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B2A3D]">
                      Najczęściej wybierany
                    </span>
                  )}

                  {/* Nagłówek: mała etykieta + duża prędkość */}
                  <p className="text-xs font-semibold text-white/50">
                    {offer.eyebrow}
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold leading-snug text-white">
                    {offer.speedBold}
                    {offer.speedSuffix && (
                      <span className="ml-1.5 text-lg font-semibold text-white/85">
                        {offer.speedSuffix}
                      </span>
                    )}
                  </h3>

                  {/* Blok promocji: etykieta / duży nagłówek / dopisek — lub pigułka zastępcza */}
                  {offer.promoHeadline ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                        {offer.promoEyebrow}
                      </p>
                      <p className="text-lg font-extrabold leading-tight text-orange-300">
                        {offer.promoHeadline}
                      </p>
                      {offer.promoNote && (
                        <p className="mt-0.5 text-[11px] text-white/40">
                          {offer.promoNote}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="mt-4 inline-flex w-fit items-center rounded-full bg-teal-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-300">
                      {offer.badgeLabel}
                    </span>
                  )}

                  <div className="mt-5 border-t border-white/10" />

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {offer.features.map((f, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-white/70 sm:text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                          <Check size={12} />
                        </span>
                        {f.label}
                      </li>
                    ))}
                  </ul>

                  {/* Boks z ceną — wyśrodkowany, w ramce */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] py-4 text-center">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-3xl font-extrabold text-white">
                        {offer.price}
                      </span>
                      <span className="text-sm font-medium text-white/60">
                        {offer.priceUnit}
                      </span>
                    </div>
                    <span className="mt-1 block text-[11px] text-white/40">
                      {offer.priceNote}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col gap-2.5 pt-6">
                    <m.a
                      href="sms:+48883334124?body=INTERNET"
                      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <MessageCircle size={14} />
                      WYŚLIJ SMS
                    </m.a>
                    <m.a
                      href="tel:+48883334124"
                      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Phone size={14} />
                      ZADZWOŃ +48 883 334 124
                    </m.a>
                  </div>
                </m.div>
              ))}
            </div>

            {/* Zapisek prawny / regulaminowy — pod ofertami */}
            <m.div
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto mt-10 max-w-4xl space-y-3 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-white/40"
            >
              <p>
                Prezentowana oferta dotyczy mieszkań. W przypadku budynków
                jednorodzinnych obowiązuje inna oferta.
              </p>
              <p>
                Prezentowana oferta Netii S.A.: „Wybierz super cenę 300Mb/s
                (HFC, PON, ETTH)” obowiązuje przy zawarciu Umowy na czas
                określony 24 pełnych Okresów Rozliczeniowych przy jednoczesnym
                korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe
                (5 zł). W przypadku rezygnacji lub niespełnienia warunków
                przyznania rabatów, cena wzrośnie o 10 zł. Wraz z pierwszą
                fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł
                za Internet i 2 zł za Telewizję. Po 24 miesiącach cena
                abonamentu wzrasta o 20 zł. „Szybki Internet Max 300” stanowi
                wyłącznie nazwę marketingową. Usługa Internetowa oparta jest na
                parametrach jakości wynikających z maksymalnych parametrów
                technicznych danej technologii, w jakiej świadczona jest Usługa
                Internetowa lub wynikających z ofertowych ustawień technicznych
                łącza. Parametry świadczenia Usługi Internetowej, w
                szczególności parametry prędkości oraz wpływu innych Usług na
                Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest
                ograniczona terytorialnie do zasięgu stacjonarnej sieci PON,
                HFC, ETTH Operatora.
              </p>
              <p>
                Prezentowana oferta Netii S.A.: „Wybierz szybszy Internet
                6mies. 1/2Gb/s (PON, HFC, ETTH)” obowiązuje przy zawarciu Umowy
                na czas określony 24 pełnych Okresów Rozliczeniowych przy
                jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody
                marketingowe (5 zł). W przypadku rezygnacji lub niespełnienia
                warunków przyznania rabatów, cena wzrośnie o 10 zł. Wraz z
                pierwszą fakturą zostanie naliczona opłata aktywacyjna w
                wysokości 79 zł za Internet i 2 zł za Telewizję. Po 24
                miesiącach cena abonamentu wzrasta o 10 zł. „Szybki Internet
                Max (1000, 2000)” stanowi wyłącznie nazwę marketingową. Usługa
                Internetowa oparta jest na parametrach jakości wynikających z
                maksymalnych parametrów technicznych danej technologii, w
                jakiej świadczona jest Usługa Internetowa lub wynikających z
                ofertowych ustawień technicznych łącza. Prędkość 2 Gb/s jest
                dostępna na technologii PON. Parametry świadczenia Usługi
                Internetowej, w szczególności parametry prędkości oraz wpływu
                innych Usług na Usługę Internetową, dostępne są na stronie
                netia.pl. Oferta jest ograniczona terytorialnie do zasięgu
                stacjonarnej sieci PON, HFC, ETTH Operatora.
              </p>
            </m.div>

{/* FAQ */}
            <div className="mx-auto mt-16 max-w-310">
              <div className="text-center">
                <m.div
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                    FAQ
                  </span>
                </m.div>
                <m.h3
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="text-xl font-extrabold text-white sm:text-2xl"
                >
                  Najczęstsze pytania
                </m.h3>
                <m.p
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="mx-auto mt-3 max-w-md text-sm text-white/60"
                >
                  Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów.
                  Coś jeszcze niejasne? Doradca odpowie w 3 minuty przez telefon.
                </m.p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-x-5">
                {faqs.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <m.div
                      key={i}
                      initial={reduceMotion ? false : "hidden"}
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={fadeUp}
                      transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenFaq(isOpen ? null : i);
                        }
                      }}
                      className={`cursor-pointer overflow-hidden self-start rounded-xl border transition-colors ${
                        isOpen
                          ? "border-teal-400/40 bg-teal-500/[0.07]"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex w-full items-center gap-3 px-5 py-4 text-left">
                        {/* Ikona paczki (twoje SVG) z warunkowym stylowaniem */}
                        <span 
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                            isOpen 
                              ? "bg-teal-500/10 border-teal-500/30 text-teal-300" 
                              : "bg-white/[0.02] border-white/[0.08] text-white/50"
                          }`}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="19" 
                            height="19" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            aria-hidden="true"
                          >
                            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                            <path d="M12 22V12"></path>
                            <polyline points="3.29 7 12 12 20.71 7"></polyline>
                            <path d="m7.5 4.27 9 5.15"></path>
                          </svg>
                        </span>
                        
                        <span className="flex-1 text-sm font-semibold text-white sm:text-base">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-white/50 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <div
                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          {/* Zmniejszony lewy padding (pl-5 zamiast pl-16), aby tekst ładnie wyrównywał się pod ikoną paczki */}
                          <p className="px-5 pb-5 pl-5 text-sm leading-relaxed text-white/65">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            </div>

            {/* Dolne CTA */}
            <m.div
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mx-auto mt-16 max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center sm:px-10 sm:py-10"
            >
              <h4 className="text-xl font-bold text-white sm:text-2xl">
                Wciąż masz pytania?
              </h4>
              <p className="mt-2 mb-6 text-sm text-white/65 sm:text-[0.9375rem]">
                Rozmowa zajmuje ~3 minuty, bez zobowiązań. Doradca odpowie od razu.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <m.a
                  href="tel:+48883334124"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-60"
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
                        +48 883 334 124
                      </span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-white/70" />
                </m.a>

                <m.a
                  href="sms:+48883334124?body=INTERNET"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-60"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <MessageCircle size={16} />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-bold leading-tight">
                        WYŚLIJ SMS
                      </span>
                      <span className="block text-xs text-white/70">
                        Oddzwonimy w kilka minut
                      </span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-white/50" />
                </m.a>
              </div>
            </m.div>
          </div>
        </section>
      </LazyMotion>
    );
  }