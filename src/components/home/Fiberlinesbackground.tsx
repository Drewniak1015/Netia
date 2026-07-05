"use client";

import { m } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Płynne linie światłowodowe na dole całej sekcji                    */
/* Wydzielone do osobnego pliku i ładowane przez next/dynamic(ssr:false) */
/* z Hero.tsx, żeby nie wchodziły w server-rendered HTML i nie          */
/* konkurowały o main thread w momencie pierwszego malowania (LCP).     */
/* Renderuje się dopiero po hydracji reszty strony.                     */
/* ------------------------------------------------------------------ */

export default function FiberLinesBackground() {
  const trails = [
    {
      path: "M -50 500 C 150 480, 300 420, 450 400 C 650 370, 800 400, 950 340 C 1100 280, 1250 300, 1450 220",
      duration: 2.2,
      delay: 0,
    },
    {
      path: "M -50 560 C 200 550, 350 480, 500 460 C 700 420, 850 450, 1000 390 C 1150 330, 1300 340, 1500 270",
      duration: 2.6,
      delay: 0.25,
    },
    {
      path: "M -50 620 C 250 620, 400 560, 550 530 C 750 480, 900 500, 1050 450 C 1200 400, 1350 400, 1550 340",
      duration: 3,
      delay: 0.5,
    },
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0, opacity: 0.75 }}
      viewBox="0 0 1600 700"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="fiberGradientWide"
          x1="0"
          y1="700"
          x2="1600"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0" />
          <stop offset="25%" stopColor="#2DD4BF" stopOpacity="0.7" />
          <stop offset="55%" stopColor="#5EEAD4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0" />
        </linearGradient>

        <filter id="fiberGlowWide" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {trails.map((trail, index) => (
        <m.g
          key={index}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 7 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <m.path
            d={trail.path}
            stroke="url(#fiberGradientWide)"
            strokeWidth={2}
            strokeLinecap="round"
            filter="url(#fiberGlowWide)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0.85] }}
            transition={{
              duration: trail.duration,
              delay: trail.delay,
              ease: "easeOut",
            }}
          />

          <m.circle
            r="3.5"
            fill="#99F6E4"
            filter="url(#fiberGlowWide)"
            opacity={0.9}
            animate={{ offsetDistance: ["0%", "100%"] }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <animateMotion
              dur={`${4 + index}s`}
              repeatCount="indefinite"
              path={trail.path}
            />
          </m.circle>
        </m.g>
      ))}
    </svg>
  );
}