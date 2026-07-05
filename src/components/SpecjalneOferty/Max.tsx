  "use client";

  import React from "react";
  import { motion, type Variants } from "framer-motion";
  import {
    Phone,
    MessageCircle,
    Check,
    Star,
    Package,
    Tv,
    Search,
    Sparkles,
    Shield,
    Clapperboard,
    PlayCircle,
    Trophy,
    Activity,
    Film,
    Lock,
    Medal,
    type LucideIcon,
  } from "lucide-react";

  /**
   * OfferMaxSection
   * Sekcja promocyjna "Oferta Max": baner promo, karty pakietów (MAX 1000 / MAX 2000)
   * oraz siatka pakietów telewizyjnych Premium.
   *
   * Tailwind CSS + subtelne animacje framer-motion.
   * Kolory (pink/granat) zdefiniowane jako CSS var + klasy Tailwind arbitrary-value,
   * żeby nie trzeba było rozszerzać tailwind.config.
   */

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
    }),
  };

  interface PackageCardProps {
    name: string;
    speed: string;
    price: string;
    monthsPill: string;
    index: number;
    featured?: boolean;
  }

  function PackageCard({ name, speed, price, monthsPill, index, featured }: PackageCardProps) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        custom={index}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`relative flex flex-col rounded-2xl p-7 pt-7 pb-6 transition-colors ${
          featured
            ? "border-2 border-pink-400/70 bg-gradient-to-b from-pink-400/[0.08] to-white/[0.03] shadow-[0_0_0_1px_rgba(244,114,182,0.15),0_20px_45px_-20px_rgba(236,72,153,0.45)]"
            : "border border-white/10 bg-white/[0.04] hover:border-pink-400/40"
        }`}
      >
        {featured && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B2A3D] shadow-sm">
            Najczęściej wybierany
          </span>
        )}

        <div className="mb-3.5 flex items-center justify-between">
          <span className="text-xl font-extrabold text-pink-400">{name}</span>
          <span className="rounded-full bg-pink-400/10 px-3 py-1 text-xs font-bold text-pink-300">
            {monthsPill}
          </span>
        </div>

        <div className="mb-5 flex items-baseline gap-2 border-b border-white/10 pb-5">
          <span className="text-[13px] text-white/55">od 13 mies.</span>
          <span className="text-2xl font-black leading-none text-white">{price}</span>
        </div>

        <ul className="mb-6 flex-1 list-none space-y-3 p-0">
          <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
              <Check size={14} strokeWidth={3} />
            </span>
            Internet do <b className="font-bold">{speed}</b>
          </li>
          <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
              <Check size={14} strokeWidth={3} />
            </span>
            Telewizja L 4K z Dekoderem
          </li>
          <li className="flex items-start gap-2.5 text-sm leading-snug text-white">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>
              Bezpieczny Internet Ultra
              <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/55">
                <Shield size={11} className="text-pink-300" />
                Ochrona 5 urządzeń + CyberEkspert
              </span>
            </span>
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-transparent bg-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.6)] transition-colors hover:bg-pink-400"
          >
            <Phone size={16} />
            Zadzwoń
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:border-white/35 hover:bg-white/10"
          >
            <MessageCircle size={16} />
            Zamów SMS
          </motion.a>
        </div>
      </motion.div>
    );
  }

  interface TvCardProps {
    name: string;
    price: string;
    index: number;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
  }

  function TvCard({ name, price, index, icon: Icon, iconColor, iconBg }: TvCardProps) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        custom={index}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center transition-colors hover:border-pink-400/40 hover:bg-white/[0.06]"
      >
        <div
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-inset ring-white/10 transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <div className="mb-2 min-h-[36px] text-sm font-bold text-white">{name}</div>
        <div className="text-[15px] font-extrabold text-pink-400">{price}</div>
        <div className="mt-0.5 text-[11px] text-white/55">od 13 m-ca</div>
      </motion.div>
    );
  }

  const tvPackages: Omit<TvCardProps, "index">[] = [
    { name: "HBO + HBO Max", price: "+25 zł", icon: Clapperboard, iconColor: "#c084fc", iconBg: "rgba(192,132,252,0.14)" },
    { name: "Canal+ Prestige", price: "+50 zł", icon: PlayCircle, iconColor: "#fb7185", iconBg: "rgba(251,113,133,0.14)" },
    { name: "Canal+ Select", price: "+35 zł", icon: PlayCircle, iconColor: "#60a5fa", iconBg: "rgba(96,165,250,0.14)" },
    { name: "Polsat Sport Premium", price: "+20 zł", icon: Trophy, iconColor: "#fb923c", iconBg: "rgba(251,146,60,0.14)" },
    { name: "Eleven Sports", price: "+10 zł", icon: Activity, iconColor: "#34d399", iconBg: "rgba(52,211,153,0.14)" },
    { name: "FilmBox", price: "+10 zł", icon: Film, iconColor: "#fbbf24", iconBg: "rgba(251,191,36,0.14)" },
    { name: "Dla Dorosłych", price: "+10 zł", icon: Lock, iconColor: "#f472b6", iconBg: "rgba(244,114,182,0.14)" },
    { name: "Polsat Sport Premium + Eleven Sports", price: "+20 zł", icon: Medal, iconColor: "#2dd4bf", iconBg: "rgba(45,212,191,0.14)" },
  ];

  /** Dekoracyjna ilustracja hero: monitor + laptop z neonowym "MAX" i świetlnym łukiem. */
  function HeroDevices() {
    return (
      <div className="relative mx-auto h-[220px] w-[300px] shrink-0 sm:h-[260px] sm:w-[360px] lg:mx-0">
        <svg
          viewBox="0 0 360 260"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="maxGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="55%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a21caf" />
            </linearGradient>
            <linearGradient id="maxGlowBlue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
              <stop offset="45%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="haze" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ambient haze */}
          <ellipse cx="190" cy="120" rx="150" ry="120" fill="url(#haze)" />

          {/* sweeping light arc */}
          <motion.path
            d="M -10 230 C 90 250, 150 90, 260 60 S 360 20 380 -10"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          {/* laptop (tilted, back-right) */}
          <g transform="translate(150,150) rotate(-6)">
            <rect x="0" y="0" width="150" height="92" rx="8" fill="#0d2f45" stroke="rgba(255,255,255,0.12)" />
            <rect x="8" y="8" width="134" height="76" rx="4" fill="#081f30" />
            <text
              x="75"
              y="55"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontWeight="800"
              fontStyle="italic"
              fontSize="26"
              fill="url(#maxGlowBlue)"
              filter="url(#softGlow)"
            >
              max
            </text>
            <rect x="-6" y="90" width="162" height="6" rx="3" fill="#0a2438" />
          </g>

          {/* monitor (front-left, main) */}
          <g transform="translate(70,20)">
            <rect x="0" y="0" width="210" height="130" rx="10" fill="#0d2f45" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <rect x="9" y="9" width="192" height="112" rx="5" fill="#081f30" />
            <text
              x="105"
              y="76"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="44"
              fill="url(#maxGlow)"
              filter="url(#softGlow)"
            >
              max
            </text>
            <rect x="95" y="130" width="20" height="18" fill="#0d2f45" />
            <rect x="70" y="148" width="70" height="7" rx="3.5" fill="#0d2f45" />
          </g>
        </svg>
      </div>
    );
  }

  export default function OfferMaxSection() {
    return (
      <div className="bg-[#0B2A3D] pt-24 font-sans text-white sm:pt-36">
        {/* HERO PROMO BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-4 flex max-w-305 flex-col items-center gap-8 overflow-hidden rounded-[20px] border border-white/[0.08] px-6 pb-12 pt-14 text-center sm:mx-auto lg:flex-row lg:justify-between lg:gap-10 lg:px-14 lg:text-left"
          style={{
            background:
              "radial-gradient(120% 160% at 15% 0%, rgba(236,72,153,.25), transparent 55%), " +
              "radial-gradient(120% 160% at 85% 100%, rgba(249,168,212,.18), transparent 55%), " +
              "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
          }}
        >
          {/* subtle top accent line */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />

          <div className="max-w-[540px]">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#0B2A3D] shadow-[0_6px_16px_-6px_rgba(236,72,153,0.7)]"
            >
              <Star size={13} fill="#0B2A3D" />
              Promocja
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold text-white"
            >
              Dajemy Maxx!
              <span className="mt-1.5 block bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-[clamp(30px,5vw,52px)] font-black text-transparent">
                12 miesięcy za 0 zł
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-4 flex items-center justify-center gap-2 text-base text-white/65 lg:justify-start"
            >
              <Sparkles size={15} className="text-pink-300" />
              Internet Max z Telewizją L 4K + Bezpieczny Internet Ultra
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="shrink-0"
          >
            <HeroDevices />
          </motion.div>
        </motion.section>

        <div className="mx-auto max-w-[1140px] px-6">
          {/* SECTION TITLE */}
          <div className="mt-16 mb-10 text-center">
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold text-white">
              Wybierz swój pakiet <span className="text-pink-400">Max</span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-300" />
          </div>

          {/* PACKAGE CARDS */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 pt-2">
            <PackageCard
              name="MAX 1000"
              speed="1000 Mb/s"
              price="140 zł/mies."
              monthsPill="12 miesięcy za 0 zł!"
              index={0}
            />
            <PackageCard
              name="MAX 2000"
              speed="2000 Mb/s"
              price="160 zł/mies."
              monthsPill="12 miesięcy za 0 zł!"
              index={1}
              featured
            />
          </div>

          {/* INFO BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0f3550] px-5 py-4 text-[13px] text-white/65"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-400/10 text-pink-400">
                <Package size={17} />
              </span>
              <span>
                <b className="text-white">SoundBox 4K</b> (+30 zł/msc) — opcja do zamówienia, płatny od 1
                miesiąca.
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(236,72,153,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-pink-400 px-4 py-2.5 text-[13px] font-bold text-pink-400"
            >
              <Tv size={15} />
              Wyszukiwarka kanałów TV
              <Search size={14} />
            </motion.button>
          </motion.div>

          {/* TV PACKAGES */}
          <div className="mt-20 mb-8 text-center">
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-extrabold text-white">
              Pakiety telewizyjne <span className="text-pink-400">Premium</span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-pink-500 to-pink-300" />
            <span className="mx-auto mt-5 inline-block rounded-full bg-pink-400/10 px-3.5 py-1.5 text-xs font-bold text-pink-300">
              12 miesięcy 0 zł
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 pb-10">
            {tvPackages.map((pkg, i) => (
              <TvCard
                key={pkg.name}
                name={pkg.name}
                price={pkg.price}
                index={i}
                icon={pkg.icon}
                iconColor={pkg.iconColor}
                iconBg={pkg.iconBg}
              />
            ))}
          </div>

          {/* LEGAL DISCLAIMER */}
          <p className="pb-16 text-left text-[11px] leading-relaxed text-white/35">
            Prezentowana oferta Netii S.A.: „Wybierz rabat 12 miesięcy” (PON, HFC, ETTH) obowiązuje
            przy zawarciu Umowy na czas określony 24 pełnych Okresów Rozliczeniowych przy
            jednoczesnym korzystaniu z rabatów za e-fakturę (5 zł) i zgody marketingowe (5 zł). W
            przypadku rezygnacji lub niespełnienia warunków przyznania rabatów, cena wzrośnie o 10
            zł. Wraz z pierwszą fakturą zostanie naliczona opłata aktywacyjna w wysokości 79 zł za
            Internet i 2 zł za Telewizję. Po 24 miesiącach cena abonamentu wzrasta o 10 zł. „Wybierz
            rabat 12 miesięcy” stanowi wyłącznie nazwę marketingową. Usługa Internetowa oparta jest
            na parametrach jakości wynikających z maksymalnych parametrów technicznych danej
            technologii, w jakiej świadczona jest Usługa Internetowa, lub wynikających z ofertowych
            ustawień technicznych łącza. Prędkość 2 Gb/s jest dostępna na technologii PON. Parametry
            świadczenia Usługi Internetowej, w szczególności parametry prędkości oraz wpływu innych
            Usług na Usługę Internetową, dostępne są na stronie netia.pl. Oferta jest ograniczona
            terytorialnie do zasięgu stacjonarnej sieci PON, HFC, ETTH Operatora.
          </p>
        </div>
      </div>
    );
  }