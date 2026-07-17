"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Dane — edytuj / podmieniaj swobodnie                                */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: "Polityka Prywatności", href: "/polityka-prywatnosci" },
  { label: "Pomoc", href: "/pomoc/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/pomoc/awarie" },

];

const CURRENT_YEAR = new Date().getFullYear();

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
    <Link href="/" className="flex items-center shrink-0" aria-label="Netia — strona główna">
      {/* width/height rezerwują proporcjonalną przestrzeń w layoucie na
          każdym breakpoincie (h-12/sm:h-14/lg:h-16), więc szerokość
          wyliczana z aspect-ratio nie "skacze" po załadowaniu SVG. */}
      <Image
        src="/images/Placeholder.svg"
        alt="Netia"
        width={200}
        height={64}
        className="h-12 w-auto sm:h-14 lg:h-16"
      />
    </Link>
  );
}

function FooterNavLink({ label, href }: FooterLink) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
      <Link
        href={href}
        className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold text-white/85 transition-colors duration-200 hover:text-white sm:px-3 sm:text-sm"
      >
        {label}
      </Link>
      <motion.span
        variants={underlineVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-teal-400 sm:left-3 sm:right-3"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer główny                                                       */
/* ------------------------------------------------------------------ */

export default function NetiaFooter() {
  return (
    <footer style={{ backgroundColor: "#0B2A3D" }} className="font-sans">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        {/* Górny rząd: logo + linki + CTA */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            variants={fadeUp}
          >
            <Logo />
          </motion.div>

          <motion.nav
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={1}
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-2"
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
          </motion.nav>

          <motion.a
            href="tel:+48883334124"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={2}
            variants={fadeUp}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(20,184,166,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="flex w-fit items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white"
          >
            <Phone size={15} />
            Zadzwoń
          </motion.a>
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          style={{ originX: 0.5 }}
          className="my-6 h-px w-full bg-white/10 sm:my-7 lg:my-8"
        />

        {/* Dolny rząd: copyright */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={3}
          variants={fadeUp}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <p className="text-xs text-white/70 sm:text-sm">
            © {CURRENT_YEAR} Netia. Wszelkie prawa zastrzeżone.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}