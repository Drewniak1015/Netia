"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Hook: zwraca ref + flagę "widoczny", ustawianą raz, gdy element wjedzie
 * w viewport. Respektuje prefers-reduced-motion (element od razu widoczny,
 * bez czekania na scroll).
 *
 * Współdzielony przez sekcje strony głównej (PoradnikTechnologie, FAQ,
 * Benefity, ...) zamiast framer-motion `whileInView` — ten sam efekt
 * wizualny (fade-up przy wjechaniu w viewport), ale bez ładowania/
 * wykonywania biblioteki animacyjnej w tych komponentach.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}