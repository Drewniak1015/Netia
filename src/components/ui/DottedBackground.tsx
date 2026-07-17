"use client";

import type { CSSProperties } from "react";

type Variant = "dots" | "dots-fade" | "grid" | "grid-fade" | "dots-accent";

export interface DottedBackgroundProps {
  variant?: Variant;
  /** Środek zanikania — używane tylko przez warianty "-fade" */
  focusY?: string; // np. "35%"
  /** Odstęp między kropkami/liniami w px */
  size?: number;
  /** Przezroczystość głównego wzoru (kropek lub linii siatki).
   *  Domyślnie: 0.14 dla kropek, 0.09 dla siatki. Podaj niższą wartość
   *  (np. 0.04–0.06), żeby wzór był bardzo subtelny. */
  opacity?: number;
  className?: string;
}

const DOT_OPACITY_DEFAULT = 0.14;
const GRID_OPACITY_DEFAULT = 0.09;
const ACCENT_COLOR = "94,224,183"; // teal, spójny z --teal-400 serwisu

export default function DottedBackground({
  variant = "dots",
  focusY = "35%",
  size = 24,
  opacity,
  className = "",
}: DottedBackgroundProps) {
  const mask = `radial-gradient(ellipse 75% 65% at 50% ${focusY}, black 35%, transparent 85%)`;

  const isGrid = variant === "grid" || variant === "grid-fade";
  const resolvedOpacity = opacity ?? (isGrid ? GRID_OPACITY_DEFAULT : DOT_OPACITY_DEFAULT);

  const base: CSSProperties =
    isGrid
      ? {
          backgroundImage: `linear-gradient(rgba(255,255,255,${resolvedOpacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,${resolvedOpacity}) 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        }
      : variant === "dots-accent"
        ? {
            backgroundImage: `radial-gradient(circle, rgba(${ACCENT_COLOR},${resolvedOpacity * 1.15}) 1.4px, transparent 1.4px), radial-gradient(circle, rgba(255,255,255,${resolvedOpacity * 0.45}) 1px, transparent 1px)`,
            backgroundSize: `${size * 2}px ${size * 2}px, ${size}px ${size}px`,
            backgroundPosition: `0 0, ${size / 2}px ${size / 2}px`,
          }
        : {
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,${resolvedOpacity}) 1px, transparent 1px)`,
            backgroundSize: `${size}px ${size}px`,
          };

  const withFade: CSSProperties =
    variant === "dots-fade" || variant === "grid-fade"
      ? { maskImage: mask, WebkitMaskImage: mask }
      : {};

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ ...base, ...withFade }}
    />
  );
}