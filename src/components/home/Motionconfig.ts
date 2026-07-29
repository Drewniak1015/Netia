import type { Variants } from "framer-motion";

// Custom cubic-bezier (easeOutExpo-ish) zamiast wbudowanego "easeOut" —
// wolniejszy, bardziej "ciężki" start i długie, miękkie wyhamowanie na
// końcu. To ta różnica, która sprawia, że ruch czuje się płynnie zamiast
// mechanicznie, nawet przy tym samym czasie trwania.
export const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SMOOTH_EASE } },
};

export const headerGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SMOOTH_EASE } },
};

// Spring współdzielony przez hover kart i przyciski CTA — daje lekki,
// "żywy" odbicie zamiast płaskiego duration-based tweena.
export const HOVER_SPRING = { type: "spring", stiffness: 350, damping: 22, mass: 0.6 } as const;
export const TAP_SPRING = { type: "spring", stiffness: 500, damping: 25, mass: 0.5 } as const;

export const BANNER_AKCENTY: Record<
  "teal" | "red" | "lime",
  { border: string; background: string; text: string; soft: string }
> = {
  teal: {
    border: "border-teal-300/25",
    background:
      "radial-gradient(130% 160% at 15% 0%, rgba(45,212,191,.45), transparent 60%), linear-gradient(135deg, #0f3550 0%, #0B2A3D 100%)",
    text: "text-teal-300",
    soft: "bg-teal-300/15",
  },
  red: {
    border: "border-[#e0399e]/40",
    background: "linear-gradient(135deg, #d6409f 0%, #8a2570 55%, #4a1240 100%)",
    text: "text-[#f472b6]",
    soft: "bg-[#e0399e]/15",
  },
  lime: {
    border: "border-[#a3d146]/40",
    background: "linear-gradient(135deg, #8bc34a 0%, #5c9c2e 55%, #33540f 100%)",
    text: "text-[#c3e86b]",
    soft: "bg-[#a3d146]/15",
  },
};