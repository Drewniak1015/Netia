"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  Home,
  Zap,
  Wrench,
  CalendarClock,
  MapPin,
  Sliders,
  Tv,
} from "lucide-react";
import type { City } from "@/lib/cities";
import type { FaqItem } from "@/lib/cityHelpers";
import Oferty from "@/components/home/Oferty";
import CityFaq from "@/components/miasta/CityFaq";

const PHONE = "+48 883 334 124";
const PHONE_HREF = "tel:+48883334124";
const SMS_HREF = "sms:+48883334124?body=INTERNET";

/* ---------------------------------------------------------------------- */
/*  Dane ofert — wspólne dla wszystkich miast (ta sama kampania krajowa).  */
/*  Jeśli kiedyś ceny zaczną się różnić między miastami, przenieś to do   */
/*  City (np. City.offers) i podawaj z zewnątrz zamiast trzymać na sztywno.*/
/* ---------------------------------------------------------------------- */
const HERO_STATS = [
  { label: "Internet + TV", price: "40 zł", note: "miesięcznie", highlighted: false },
  { label: "Internet 1 Gb/s", price: "65 zł", note: "miesięcznie", highlighted: false },
  { label: "Internet Max + TV L 4K", price: "0 zł", note: "przez 12 mies.", highlighted: true },
] as const;

const MINI_OFFERS = [
  {
    id: "mini-1000",
    title: "Internet 1000 Mb/s",
    tag: "Najczęściej wybierane",
    desc: "Sam Internet do 1000 Mb/s z routerem Combo ONT Wi-Fi 6. Promocja „6 miesięcy za 0 zł” — przez pół roku tylko aktywacja, potem 65 zł/mies.",
    price: "0 zł",
    oldPrice: "65 zł",
    priceNote: "/mies.",
  },
  {
    id: "mini-300-s",
    title: "Internet 300 Mb/s + TV S",
    tag: "Najczęściej wybierane",
    desc: "Internet do 300 Mb/s + Telewizja S z dekoderem 4K. Umowa 24 miesiące, stała niska cena od pierwszego miesiąca.",
    price: "40 zł",
    oldPrice: "60 zł",
    priceNote: "/mies.",
  },
  {
    id: "mini-300-s4k",
    title: "Internet 300 Mb/s + TV S w 4K",
    tag: "Najczęściej wybierane",
    desc: "Internet do 300 Mb/s + pakiet TV S z transmisją 4K. Umowa 24 miesiące, w komplecie router Wi-Fi, dekoder 4K i Giganagrywarka Basic.",
    price: "45 zł",
    oldPrice: "65 zł",
    priceNote: "/mies.",
  },
] as const;

const WHY_NETIA = [
  {
    icon: Zap,
    title: "Szybki Internet",
    desc: "Światłowód do 2 Gb/s zapewnia stabilne połączenie dla całej rodziny.",
  },
  {
    icon: Wrench,
    title: "Szybki montaż",
    desc: "Instalacja już w 1–3 dni od złożenia zamówienia.",
  },
  {
    icon: CalendarClock,
    title: "Elastyczne umowy",
    desc: "Wybierz okres trwania umowy: 24, 12 lub 9 miesięcy.",
  },
] as const;

/** Pierwsze zdanie opisu miasta — używane jako krótki tagline pod H1 w hero. */
function getTagline(description?: string): string {
  if (!description) return "Szybki światłowód i TV 4K, z montażem w 1–3 dni.";
  const firstSentence = description.split(". ")[0];
  return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
}

function Breadcrumb({ cityName }: { cityName: string }) {
  return (
    <nav className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 text-sm text-white/50 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-1.5 hover:text-teal-300">
        <Home size={14} />
        Strona główna
      </Link>
      <ChevronRight size={14} className="text-white/20" />
      <Link href="/internet-miasta" className="hover:text-teal-300">
        Miasta
      </Link>
      <ChevronRight size={14} className="text-white/20" />
      <span className="font-medium text-white/80">{cityName}</span>
    </nav>
  );
}

function Hero({ city }: { city: City }) {
  return (
    <div
      className="relative mx-auto w-315 overflow-hidden rounded-3xl border border-white/10 px-4 py-6 text-center mt-24"
      style={{
        background:
          "radial-gradient(120% 160% at 15% 0%, rgba(45,212,191,.22), transparent 55%), " +
          "radial-gradient(120% 160% at 85% 100%, rgba(153,246,228,.16), transparent 55%), " +
          "linear-gradient(135deg, #0B2A3D 0%, #0f3550 55%, #0B2A3D 100%)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />

      {/* Chmura + gwiazdki — górny prawy róg */}
      <svg
        className="pointer-events-none absolute -right-10 -top-12 hidden h-56 w-56 opacity-40 sm:block lg:h-72 lg:w-72"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Chmura — sama obwódka, bez wypełnienia */}
        <g transform="translate(85,15) scale(4.4)" opacity="0.55">
          <path
            d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* Duża gwiazdka (sparkle) */}
        <path
          d="M55 100 L61 114 L75 120 L61 126 L55 140 L49 126 L35 120 L49 114 Z"
          fill="#2DD4BF"
          opacity="0.75"
        />
        {/* Mniejsze gwiazdki */}
        <path
          d="M155 110 L158.5 118 L166.5 121.5 L158.5 125 L155 133 L151.5 125 L143.5 121.5 L151.5 118 Z"
          fill="#99F6E4"
          opacity="0.6"
        />
        <path
          d="M30 60 L32 65 L37 67 L32 69 L30 74 L28 69 L23 67 L28 65 Z"
          fill="#99F6E4"
          opacity="0.5"
        />
        {/* Kropki-gwiazdki */}
        <circle cx="170" cy="70" r="2.5" fill="#2DD4BF" opacity="0.6" />
        <circle cx="45" cy="150" r="2" fill="#99F6E4" opacity="0.55" />
        <circle cx="105" cy="160" r="2" fill="#2DD4BF" opacity="0.5" />
      </svg>

      {/* Chmura + gwiazdki — dolny lewy róg */}
      <svg
        className="pointer-events-none absolute -left-8 -bottom-10 hidden h-52 w-52 opacity-40 sm:block lg:h-64 lg:w-64"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Mniejsza chmura — sama obwódka */}
        <g transform="translate(20,120) scale(3.3)" opacity="0.55">
          <path
            d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* Duża gwiazdka (sparkle) */}
        <path
          d="M140 45 L145 57 L157 62 L145 67 L140 79 L135 67 L123 62 L135 57 Z"
          fill="#2DD4BF"
          opacity="0.75"
        />
        {/* Mniejsze gwiazdki */}
        <path
          d="M170 100 L172.5 106 L178.5 108.5 L172.5 111 L170 117 L167.5 111 L161.5 108.5 L167.5 106 Z"
          fill="#99F6E4"
          opacity="0.6"
        />
        <path
          d="M20 90 L22 95 L27 97 L22 99 L20 104 L18 99 L13 97 L18 95 Z"
          fill="#99F6E4"
          opacity="0.5"
        />
        {/* Kropki-gwiazdki */}
        <circle cx="100" cy="30" r="2.5" fill="#2DD4BF" opacity="0.6" />
        <circle cx="160" cy="150" r="2" fill="#99F6E4" opacity="0.55" />
        <circle cx="30" cy="50" r="2" fill="#2DD4BF" opacity="0.5" />
      </svg>

      <h1 className="text-[clamp(28px,4.4vw,44px)] font-extrabold text-white">
        Internet Netia w <span className="text-teal-300">{city.locative}</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
        {getTagline(city.description)}
      </p>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
        {HERO_STATS.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border px-4 py-5 text-center ${
              stat.highlighted
                ? "border-teal-300/50 bg-teal-400/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
              Już od
            </p>
            <p
              className={`mt-1 text-2xl font-extrabold sm:text-3xl ${
                stat.highlighted ? "text-teal-300" : "text-white"
              }`}
            >
              {stat.price}
            </p>
            <p className="mt-0.5 text-[11px] text-white/50">{stat.note}</p>
            <p className="mt-2 text-xs font-medium text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={PHONE_HREF}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
        >
          <Phone size={15} />
          ZADZWOŃ {PHONE}
        </a>
        <a
          href={SMS_HREF}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <MessageCircle size={15} />
          WYŚLIJ SMS
        </a>
      </div>
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-orange-400/25 bg-orange-400/[0.06] px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
            Internet 1000 Mb/s — najczęściej wybierane
          </p>
          <p className="mt-1 text-sm font-semibold text-white/85 sm:text-base">
            Sam Internet do 1000 Mb/s z routerem Combo ONT Wi-Fi 6. Promocja „6 miesięcy za
            0 zł” — przez pół roku tylko aktywacja, potem 65 zł/mies.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <span className="mr-1 text-xs text-white/40 line-through">65 zł</span>
            <span className="text-2xl font-extrabold text-white">0 zł</span>
          </div>
          <Link
            href="/oferty/popularne"
            className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            Sprawdź ofertę
          </Link>
        </div>
      </div>
    </div>
  );
}

function MiniOfferCard({ offer }: { offer: (typeof MINI_OFFERS)[number] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-teal-300">{offer.tag}</p>
      <h4 className="mt-1 text-base font-extrabold text-white">{offer.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{offer.desc}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white">{offer.price}</span>
        <span className="text-xs text-white/40">{offer.priceNote}</span>
        <span className="text-xs text-white/40 line-through">{offer.oldPrice}</span>
      </div>
      <Link
        href="/oferty/popularne"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-teal-300/30 bg-teal-300/5 px-4 py-2.5 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-300/15"
      >
        Zobacz szczegóły
      </Link>
    </div>
  );
}

interface CityPageClientProps {
  city: City;
  districts?: string[];
  nearbyCities: City[];
  faq: FaqItem[];
}

export default function CityPageClient({ city, districts, nearbyCities, faq }: CityPageClientProps) {
  const lastUpdated = useRef(
    new Date().toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })
  ).current;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#0B2A3D" }}>
      <Breadcrumb cityName={city.name} />

      <div className="px-5 sm:px-6 lg:px-8">
        <Hero city={city} />
        <PromoBanner />

        {/* Główne oferty pakietowe — komponent współdzielony z home/Oferty.tsx,
            z tytułem spersonalizowanym pod aktualne miasto */}
        <div className="mx-auto mt-8 max-w-6xl">
          <Oferty cityLocative={city.locative} />
        </div>

        {/* Najczęściej wybierane pakiety w mieście */}
        <div className="mx-auto mt-14 max-w-6xl">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            Najczęściej wybierane pakiety w {city.locative}
          </h2>
          <p className="mt-1.5 text-sm text-white/60">
            Najpopularniejsze oferty Netii — sprawdź szczegóły i dostępność pod Twoim adresem.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {MINI_OFFERS.map((offer) => (
              <MiniOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Dlaczego Netia w mieście — kółka z ikoną połączone przerywaną linią */}
        <div className="mx-auto max-w-320 py-6">
          <h2 className="text-center text-xl font-extrabold text-white sm:text-2xl">
            Dlaczego Netia w {city.locative}?
          </h2>
          <div className="relative mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t border-dashed border-teal-400/30 sm:block" />
            {WHY_NETIA.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-400 text-[#0a1a2b]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-white/60">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skonfiguruj samodzielnie */}
        <div className="mx-auto max-w-320 py-6 text-center">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            Nie znalazłeś oferty? Skonfiguruj samodzielnie
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/65">
            Zbuduj własny pakiet Internetu i TV — dobierz prędkość do 2 Gb/s, kanały i dodatki.
            Zamów online w kilka minut.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/konfigurator"
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-600"
            >
              <Sliders size={15} />
              Skonfiguruj ofertę
            </Link>
            <Link
              href="/kanaly"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Tv size={15} />
              Lista kanałów TV
            </Link>
          </div>
        </div>

        {/* Dzielnice obsługiwane — tylko jeśli mamy dane */}
        {districts && districts.length > 0 && (
          <div className="mx-auto max-w-320 py-6">
            <h2 className="text-center text-xl font-extrabold text-white sm:text-2xl">
              Dzielnice obsługiwane w {city.locative}
            </h2>
            <p className="mt-2 text-center text-sm text-white/60">
              Netia jest dostępna w następujących dzielnicach i osiedlach:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {districts.map((district) => (
                <span
                  key={district}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75"
                >
                  <MapPin size={13} className="text-teal-300" />
                  {district}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ — komponent w stylu NetiaFAQ.tsx, z ikonami i CTA telefon/SMS */}
        <div className="mx-auto mt-10 max-w-6xl">
          <CityFaq cityName={city.name} cityLocative={city.locative} faq={faq} />
        </div>

        {/* Pobliskie miasta */}
        <div className="mx-auto mt-10 max-w-6xl pb-16">
          <h2 className="text-center text-lg font-extrabold text-white">
            Pobliskie miasta i popularne lokalizacje
          </h2>
          <p className="mt-1 text-center text-sm text-white/60">
            Sprawdź ofertę Netii w innych miastach.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {nearbyCities.map((nearby) => (
              <Link
                key={nearby.slug}
                href={`/internet-miasta/${nearby.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:border-teal-300/40 hover:text-teal-300"
              >
                {nearby.name}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/40">
            Ostatnia aktualizacja: {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}