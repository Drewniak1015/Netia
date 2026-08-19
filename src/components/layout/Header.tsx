"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { MessageCircle, Phone, Menu, X } from "lucide-react";
import { trackContact } from "@/lib/meta-track";

/* ------------------------------------------------------------------ */
/* Kontakt                                                              */
/* ------------------------------------------------------------------ */

const PHONE_HREF = "+48887843260";
const PHONE_DISPLAY = "+48 887 843 260";
const SMS_BODY = encodeURIComponent(
  "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
);

/* ------------------------------------------------------------------ */
/* Nawigacja                                                            */
/* ------------------------------------------------------------------ */

// Strona jest one-page: pozycje menu to kotwice do sekcji na "/".
// KAŻDA sekcja na stronie musi mieć te id + scroll-mt (patrz SCROLL_OFFSET
// niżej), inaczej klik z headera schowa nagłówek sekcji pod paskiem.
const SECTIONS = [
  { id: "pakiety", label: "Pakiety" },
  { id: "programy-tv", label: "Programy TV" },
  { id: "jak-zamowic", label: "Jak zamówić" },
  { id: "kontakt", label: "Kontakt" },
] as const;

// Jedyna podstrona, jaka zostaje poza one-page.
const PRIVACY = { href: "/polityka-prywatnosci", label: "Polityka prywatności" };

// Wysokość paska + oddech. Trzymaj zgodne z scroll-mt na sekcjach.
const SCROLL_OFFSET = 96;

/* ------------------------------------------------------------------ */
/* Logo                                                                 */
/* ------------------------------------------------------------------ */

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center shrink-0"
      aria-label="Netia — strona główna"
    >
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
/* Header                                                               */
/* ------------------------------------------------------------------ */

export default function NetiaHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /* Cień / rozmycie po odjechaniu od góry */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Scroll-spy — podświetla sekcję, która aktualnie jest pod headerem */
  useEffect(() => {
    if (!isHome) {
      setActiveId(null);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.scrollY + SCROLL_OFFSET + 8;
      let current: string | null = null;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + window.scrollY <= line) {
          current = section.id;
        }
      }

      // Na samym dole strony zawsze zaznacz ostatnią sekcję — inaczej krótka
      // sekcja kontaktowa nigdy nie zdąży przejść przez linię odcięcia.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) current = SECTIONS[SECTIONS.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isHome]);

  /* Blokada scrolla przy otwartym menu mobilnym */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Zamknij menu przy zmianie ścieżki */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Płynne przewijanie z offsetem; poza stroną główną zostawiamy nawigację Next */
  const goToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      setMobileOpen(false);
      if (!isHome) return;

      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
        behavior: reduce ? "auto" : "smooth",
      });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    },
    [isHome]
  );

  // Z podstrony polityki kotwice muszą prowadzić na "/#sekcja", nie "#sekcja".
  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="font-sans">
        <header
          ref={headerRef}
          className={`fixed top-0 z-40 w-full border-b border-white/10 transition-all duration-300 ${
            scrolled
              ? "shadow-lg shadow-black/20 backdrop-blur-xl backdrop-saturate-150"
              : "shadow-none"
          }`}
          style={{ backgroundColor: scrolled ? "rgba(11, 42, 61, 0.72)" : "#0B2A3D" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-10 px-8 py-4">
            <Logo />

            <nav className="hidden lg:flex items-center gap-1">
              {SECTIONS.map((section) => {
                const active = isHome && activeId === section.id;
                return (
                  <a
                    key={section.id}
                    href={hrefFor(section.id)}
                    onClick={(e) => goToSection(e, section.id)}
                    aria-current={active ? "true" : undefined}
                    className={`relative rounded-full px-4 py-2.5 text-sm transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] ${
                      active
                        ? "font-bold text-white"
                        : "font-semibold text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {section.label}
                    <span
                      className={`absolute left-4 right-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-teal-400 transition-transform duration-250 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                );
              })}

              <Link
                href={PRIVACY.href}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] ${
                  pathname === PRIVACY.href
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {PRIVACY.label}
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-2.5">
              <m.a
                href={`tel:${PHONE_HREF}`}
                onClick={() => trackContact("header_phone_button")}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(20,184,166,0.45)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white"
              >
                <Phone size={15} />
                Zadzwoń
              </m.a>
              <m.a
                href={`sms:${PHONE_HREF}?body=${SMS_BODY}`}
                onClick={() => trackContact("header_sms_button")}
                aria-label="Wyślij SMS"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2.5 text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle size={16} />
              </m.a>
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

        {/* Menu mobilne */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              <m.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                className="absolute right-0 top-0 h-full w-full sm:w-[86%] sm:max-w-sm overflow-y-auto px-5 py-5"
                style={{ backgroundColor: "#0B2A3D" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Logo onClick={() => setMobileOpen(false)} />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="text-white transition-transform duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
                    aria-label="Zamknij menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col">
                  {SECTIONS.map((section) => {
                    const active = isHome && activeId === section.id;
                    return (
                      <a
                        key={section.id}
                        href={hrefFor(section.id)}
                        onClick={(e) => goToSection(e, section.id)}
                        className={`relative border-b border-white/10 py-3.5 pl-3 text-sm font-semibold transition-colors duration-200 ${
                          active ? "text-teal-300" : "text-white hover:text-teal-300"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-teal-400" />
                        )}
                        {section.label}
                      </a>
                    );
                  })}

                  <Link
                    href={PRIVACY.href}
                    onClick={() => setMobileOpen(false)}
                    className={`border-b border-white/10 py-3.5 pl-3 text-sm font-semibold transition-colors duration-200 ${
                      pathname === PRIVACY.href
                        ? "text-teal-300"
                        : "text-white/70 hover:text-teal-300"
                    }`}
                  >
                    {PRIVACY.label}
                  </Link>
                </nav>

                <div className="mt-5 flex flex-col gap-2">
                  <m.a
                    href={`tel:${PHONE_HREF}`}
                    onClick={() => trackContact("header_mobile_phone_button")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-center gap-2 rounded-full bg-teal-500 py-2.5 text-sm font-bold text-white"
                  >
                    <Phone size={15} />
                    Zadzwoń: {PHONE_DISPLAY}
                  </m.a>
                  <m.a
                    href={`sms:${PHONE_HREF}?body=${SMS_BODY}`}
                    onClick={() => trackContact("header_mobile_sms_button")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-2.5 text-sm font-bold text-white"
                  >
                    <MessageCircle size={15} />
                    Wyślij SMS
                  </m.a>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}