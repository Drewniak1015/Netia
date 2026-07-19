"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Phone,
  Search,
  Wifi,
  Tv,
  Smartphone,
  Wrench,
  Menu,
  X,
  Sparkles,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Typy                                                                 */
/* ------------------------------------------------------------------ */

interface SimpleItem {
  title: string;
  desc?: string;
  icon?: LucideIcon;
  badge?: string;
  accent?: boolean;
  href?: string;
}

interface SimpleColumn {
  heading: string;
  items: SimpleItem[];
}

type PanelConfig = { type: "simple"; columns: SimpleColumn[] };

interface NavItem {
  key: string;
  label: string;
  highlight?: boolean;
  href?: string; // used when the item has NO dropdown panel (links straight to a page)
  panel?: PanelConfig;
}

/* ------------------------------------------------------------------ */
/* Dane — edytuj / podmieniaj swobodnie                                 */
/* ------------------------------------------------------------------ */

const DOT_COLORS: string[] = ["#EC4899", "#F59E0B", "#22C55E", "#0EA5E9", "#8B5CF6", "#14B8A6"];
const underlineVariants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: { scaleX: 1, opacity: 1 },
};
const NAV: NavItem[] = [
  {
    key: "oferty",
    label: "Specjalne Oferty",
    highlight: true,
    panel: {
      type: "simple",
      columns: [
        {
          heading: "Wyróżnione",
          items: [
            {
              title: "Oferta Max",
              desc: "Rok za 0 zł — Internet 1000/2000 + TV 4K.",
              icon: Sparkles,
              badge: "NOWOŚĆ",
              accent: true,
              href: "/oferty/max",
            },
            {
              title: "Często Wybierane Oferty",
              desc: "6 miesięcy za 0 zł, router i dekoder w cenie.",
              icon: Wifi,
              href: "/oferty/popularne",
            },
          ],
        },
      ],
    },
  },
  {
    key: "konfigurator",
    label: "Konfigurator Ofert",
    panel: {
      type: "simple",
      columns: [
        {
          heading: "Wybierz długość umowy",
          items: [
            { title: "24 Miesiące", desc: "Najniższa cena miesięczna.", icon: Wifi, href: "/konfigurator?umowa=24" },
            { title: "Bez Zobowiązań", desc: "Pełna elastyczność, rezygnacja kiedy chcesz.", icon: Wifi, href: "/konfigurator?umowa=bez" },
          ],
        },
      ],
    },
  },
  {
    key: "kanaly",
    label: "Lista Kanałów",
    panel: {
      type: "simple",
      columns: [
        {
          heading: "Pakiety telewizyjne",
          items: [
            { title: "Pakiet S", desc: "Kanały podstawowe.", icon: Tv, href: "/kanaly?tier=s" },
            { title: "Pakiet M", desc: "Więcej rozrywki i sportu.", icon: Tv, href: "/kanaly?tier=m" },
            { title: "Pakiet L", desc: "Pełna oferta, kanały premium.", icon: Tv, href: "/kanaly?tier=l" },
          ],
        },
      ],
    },
  },
  {
    key: "pomoc",
    label: "Pomoc",
    panel: {
      type: "simple",
      columns: [
        {
          heading: "Pomoc",
          items: [
            {
              title: "Najczęstsze Pytania",
              desc: "Znajdź odpowiedzi na najczęstsze pytania.",
              icon: Search,
              href: "/pomoc/faq",
            },
            {
              title: "Telewizja",
              desc: "Znajdź odpowiedzi na najczęstsze pytania.",
              icon: Tv,
              href: "/pomoc/Telewizja",
            },
            {
              title: "Internet",
              desc: "Pomoc dotycząca usług internetowych.",
              icon: Wifi,
              href: "/pomoc/internet",
            },
            {
              title: "Usługi Telefoniczne",
              desc: "Pomoc dotycząca usług telefonicznych.",
              icon: Smartphone,
              href: "/pomoc/telefon",
            },
            {
              title: "Zgłoś Awarię",
              desc: "Kroki naprawcze i kontakt z działem technicznym.",
              icon: Wrench,
              href: "/pomoc/awarie",
            },
            {
              title: "Blog",
              desc: "Poradniki i aktualności Netia.",
              icon: Newspaper,
              href: "/blog",
            },
          ],
        },
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Elementy pomocnicze                                                  */
/* ------------------------------------------------------------------ */

function DotCluster({ size = 22 }: { size?: number }) {
  const positions: [number, number][] = [
    [0, 0], [1, 0.4], [0.3, 1], [1.1, 1.2], [-0.4, 0.8], [0.7, -0.4],
  ];
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {positions.map(([x, y], i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.34,
            height: size * 0.34,
            left: `${(x + 0.4) * (size * 0.4)}px`,
            top: `${(y + 0.2) * (size * 0.4)}px`,
            backgroundColor: DOT_COLORS[i % DOT_COLORS.length],
          }}
        />
      ))}
    </span>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="Netia — strona główna">
      {/*
        FIX (CLS): brakowało width/height na <img>. Height było ustawione
        tylko przez klasę Tailwind (h-16), a szerokość była "auto" — więc
        przeglądarka nie wiedziała ile miejsca zarezerwować, dopóki SVG się
        nie załadował. Efekt: logo "doskakiwało" do właściwej szerokości,
        co przesuwało nav/przycisk "Zadzwoń" obok w headerze — i to właśnie
        łapał Layout Shift, mimo że header jest position:fixed (liczy się
        ruch elementów w viewporcie, nie czy header pcha resztę strony).

        width/height poniżej dają przeglądarce znać jaki jest naturalny
        aspect-ratio obrazka (nowoczesne przeglądarki same liczą
        aspect-ratio z tych atrybutów), więc miejsce jest zarezerwowane od
        razu przy pierwszym renderze — zero przeskoku.

        Wartości 165×65 poniżej to realne proporcje Placeholder.svg
        (viewBox 666×256 ≈ 2.6:1, przy wysokości h-16/64px daje ~165px
        szerokości).
      */}
      <img
        src="/images/Placeholder.svg"
        alt="Netia"
        width={165}
        height={65}
        className="h-16 w-auto"
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Panel: prosta lista (jedna kolumna, wyświetlana po kliknięciu)      */
/* ------------------------------------------------------------------ */

function SimplePanel({
  columns,
  pathname,
  onItemClick,
}: {
  columns: SimpleColumn[];
  pathname: string | null;
  onItemClick?: () => void;
}) {
  return (
    <div
      className="grid gap-10"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
    >
      {columns.map((col, i) => (
        <div key={i}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
            {col.heading}
          </p>
          <div className="flex flex-col gap-2 py-1">
            {col.items.map((item, j) => {
              const Icon: LucideIcon | undefined = item.icon;
              const isSelected = !!item.href && item.href === pathname;
              return (
                <motion.div
                  key={j}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={item.href ?? "#"}
                    onClick={onItemClick}
                    className={`group relative flex items-start gap-4 rounded-xl px-4 py-4 transition-all duration-200 border border-transparent hover:border-slate-200  ${
                      isSelected
                        ? "bg-teal-50 ring-1 ring-inset ring-teal-200"
                        : item.accent
                        ? "bg-pink-50/60 hover:bg-pink-100"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-teal-500" />
                    )}
                    <motion.span
                      whileHover={{ scale: 1.12, rotate: -4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-shadow duration-200 group-hover:shadow-md ${
                        isSelected
                          ? "bg-teal-500 text-white"
                          : item.accent
                          ? "bg-pink-500 text-white group-hover:bg-pink-600"
                          : "bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white"
                      }`}
                    >
                      {Icon ? <Icon size={17} /> : <DotCluster size={18} />}
                    </motion.span>
                    <span className="min-w-0 pt-0.5">
                      <span className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold transition-colors duration-200 ${
                            isSelected ? "text-teal-800" : "text-slate-800 group-hover:text-teal-700"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.desc && (
                        <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                          {item.desc}
                        </span>
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({
  item,
  pathname,
  onItemClick,
}: {
  item: NavItem;
  pathname: string | null;
  onItemClick?: () => void;
}) {
  if (!item.panel) return null;
  return <SimplePanel columns={item.panel.columns} pathname={pathname} onItemClick={onItemClick} />;
}

/* ------------------------------------------------------------------ */
/* Mobile accordion item                                               */
/* ------------------------------------------------------------------ */

function MobileNavItem({
  item,
  open,
  onToggle,
  active,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  active?: boolean;
  pathname: string | null;
  onNavigate?: () => void;
}) {
  if (!item.panel) {
    return (
      <div className="border-b border-white/10">
        <Link
          href={item.href ?? "#"}
          onClick={onNavigate}
          className={`relative block rounded-lg py-3.5 pl-3 text-sm font-semibold transition-colors duration-200 ${
            active ? "bg-white/10 text-teal-300" : "text-white hover:text-teal-300"
          } ${!active && item.highlight ? "text-pink-300" : ""}`}
        >
          {active && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-teal-400" />
          )}
          {item.label}
        </Link>
      </div>
    );
  }

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className={`relative flex w-full items-center justify-between rounded-lg py-3.5 pl-3 pr-2 text-left text-sm font-semibold transition-colors duration-200 ${
          open ? "bg-white/10 text-teal-300" : "text-white hover:text-teal-300"
        }`}
      >
        {open && (
          <motion.span
            layoutId="mobile-active-bar"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-teal-400"
          />
        )}
        <span className={!open && item.highlight ? "text-pink-300" : ""}>{item.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={open ? "text-teal-300" : "text-white/60"}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden pt-4"
          >
            <div className="rounded-xl bg-white p-5 mb-3">
              <Panel item={item} pathname={pathname} onItemClick={onNavigate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function isSectionActive(item: NavItem, pathname: string | null): boolean {
  if (!pathname) return false;
  if (item.href) return pathname === item.href;
  // sprawdza czy ścieżka zaczyna się od klucza sekcji, np. "/konfigurator"
  return pathname.startsWith(`/${item.key}`);
}

/* ------------------------------------------------------------------ */
/* Header główny                                                       */
/* ------------------------------------------------------------------ */

export default function NetiaHeader() {
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mobileActiveKey, setMobileActiveKey] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveKey(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveKey(null), 150);
  };
  const toggleMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveKey((prev) => (prev === key ? null : key));
  };

  // Zamykanie rozwinięcia po kliknięciu poza nagłówkiem
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveKey(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Blokada scrolla przy otwartym mobilnym menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Zamykanie desktopowego dropdownu i mobilnego menu przy zmianie ścieżki
  useEffect(() => {
    setActiveKey(null);
    setMobileOpen(false);
    setMobileActiveKey(null);
  }, [pathname]);

  return (
    <div className="font-sans">
      <header
        ref={headerRef}
        className={`fixed top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 shadow-lg shadow-black/20 backdrop-blur-xl backdrop-saturate-150"
            : "border-white/10 shadow-none"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(11, 42, 61, 0.72)" : "#0B2A3D",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-10 px-8 py-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-3">
            {NAV.map((item) =>
              item.panel ? (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => openMenu(item.key)}
                  onMouseLeave={scheduleClose}
                >
                  <motion.button
                    type="button"
                    onClick={() => toggleMenu(item.key)}
                    initial={isSectionActive(item, pathname) ? "hover" : "rest"}
                    whileHover="hover"
                    animate={activeKey === item.key || isSectionActive(item, pathname) ? "hover" : "rest"}
                    className={`relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm transition-all duration-200 hover:scale-[1.04] active:scale-[0.98]
                      ${
                        item.highlight
                          ? "text-pink-300 hover:text-pink-200"
                          : "text-white/85 hover:text-white"
                      }
                      ${isSectionActive(item, pathname) ? "font-bold" : "font-semibold"}
                    `}
                  >
                    {item.highlight && <Sparkles size={14} />}
                    {item.label}
                    <motion.span
                      animate={{ rotate: activeKey === item.key ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown size={14} />
                    </motion.span>

                    <motion.span
                      variants={underlineVariants}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ originX: 0 }}
                      className={`absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full ${
                        item.highlight ? "bg-pink-300" : "bg-teal-400"
                      }`}
                    />
                  </motion.button>

                  {/* Rozwijany panel — idealnie wyśrodkowany pod punktem, z którego został otwarty */}
                  <AnimatePresence>
                    {activeKey === item.key && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-1/2 top-full mt-3 z-40 w-max min-w-[340px] max-w-md -translate-x-1/2 rounded-2xl border border-slate-100 bg-white shadow-2xl"
                      >
                        <div className="px-6 py-6">
                          <Panel
                            item={item}
                            pathname={pathname}
                            onItemClick={() => setActiveKey(null)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href ?? "#"}
                  className={`relative flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] ${
                    item.highlight ? "text-pink-300 hover:text-pink-200" : "text-white/85 hover:text-white"
                  } ${
                    pathname === item.href
                      ? "bg-white/20 text-white shadow-inner"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-3 right-3 h-[3px] rounded-full bg-teal-400" />
                  )}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <motion.a
              href="tel:+48883334124"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(20,184,166,0.45)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white"
            >
              <Phone size={15} />
              Zadzwoń
            </motion.a>
          </div>

          <button
            type="button"
            className="lg:hidden text-white transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={() => setMobileOpen(true)}
            aria-label="Otwórz menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile drawer — na telefonie zajmuje 100% szerokości (test) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 h-full w-full sm:w-[86%] sm:max-w-sm overflow-y-auto px-5 py-5"
              style={{ backgroundColor: "#0B2A3D" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-white transition-transform duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
                  aria-label="Zamknij menu"
                >
                  <X size={22} />
                </button>
              </div>

              {NAV.map((item) => (
                <MobileNavItem
                  key={item.key}
                  item={item}
                  open={mobileActiveKey === item.key}
                  onToggle={() => setMobileActiveKey(mobileActiveKey === item.key ? null : item.key)}
                  active={!item.panel && pathname === item.href}
                  pathname={pathname}
                  onNavigate={() => {
                    setMobileOpen(false);
                    setMobileActiveKey(null);
                  }}
                />
              ))}

              <div className="mt-5 flex flex-col gap-2">
                <motion.a
                  href="tel:+48883334124"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center justify-center gap-2 rounded-full bg-teal-500 py-2.5 text-sm font-bold text-white"
                >
                  <Phone size={15} />
                  Zadzwoń: +48 883 334 124
                </motion.a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}