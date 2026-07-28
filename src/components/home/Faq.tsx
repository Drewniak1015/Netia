"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  ShieldCheck,
  Clock,
  FileX,
  Wrench,
  Router,
  Banknote,
  Tag,
  Tv,
  Lock,
  Undo2,
  Percent,
  Truck,
  ClipboardCheck,
} from "lucide-react";
import type { ElementType } from "react";

type FaqItem = {
  q: string;
  a: string;
  icon: ElementType;
};

/* [DODANO] Ten sam wzorzec trackingu co w Hero.tsx / Oferty.tsx /
   HowToOrderSection.tsx / NetiaSocialProof.tsx — odpalanie zdarzenia Meta
   Pixel "Contact" przy kliknięciu w telefon/SMS. */
function trackContact(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Contact", { content_name: contentName });
  }
}

// Tier 1 — najsilniejsze objection-killery, zawsze widoczne domyślnie
const TIER_1: FaqItem[] = [
  {
    icon: FileX,
    q: "Mam umowę z obecnym operatorem — czy zapłacę karę?",
    a: "W większości przypadków pomożemy Ci to sprawdzić telefonicznie, zanim cokolwiek podpiszesz. Doradca oceni Twoją obecną umowę i powie wprost, czy przejście się opłaca — bez zobowiązań z Twojej strony.",
  },
  {
    icon: ShieldCheck,
    q: "Co jeśli internet nie będzie działał tak, jak obiecano?",
    a: "Zgłoś to naszemu wsparciu technicznemu dostępnemu 24/7 pod numerem +48 793 800 300. Gwarantujemy minimum 50% zadeklarowanej prędkości — jeśli usługa nie spełnia parametrów z oferty, doradca zaproponuje rozwiązanie od razu, telefonicznie.",
  },
  {
    icon: Undo2,
    q: "A co jeśli po zmianie okaże się gorzej niż u obecnego dostawcy?",
    a: "Masz ustawowe 14 dni na odstąpienie od umowy bez podania przyczyny — otrzymasz zwrot całości wpłaty. Nie musisz się wiązać na próbę: sprawdzasz usługę bez ryzyka.",
  },
  {
    icon: Clock,
    q: "Na jak długo zawierana jest umowa?",
    a: "Do wyboru są umowy na 24, 12 lub 9 miesięcy. Najkrótsza opcja (9 miesięcy) jest popularna wśród studentów, najemców i osób korzystających z internetu sezonowo. Dłuższe umowy zwykle oznaczają niższy abonament miesięczny.",
  },
  {
    icon: Wrench,
    q: "Ile trwa instalacja i przeniesienie numeru?",
    a: "Montaż umawiamy zwykle w ciągu 1–3 dni roboczych od podpisania umowy — termin ustalasz indywidualnie z technikiem. Sama instalacja w lokalu trwa około 1,5 godziny: technik podłącza światłowód, konfiguruje router i dekoder, sprawdza prędkość i pokazuje aplikację Netia GO. Przeniesienie numeru odbywa się równolegle, bez przerwy w działaniu usług.",
  },
  {
    icon: Banknote,
    q: "Ile kosztuje aktywacja i czy sprzęt jest w cenie?",
    a: "Aktywacja Internetu to jednorazowo 79 zł, aktywacja Telewizji — 2 zł (łącznie 81 zł na pierwszej fakturze przy pakiecie Internet + TV). Router (Wi-Fi 6 lub Combo z ONT Wi-Fi 7), Dekoder 4K, aplikacja Netia GO i Giganagrywarka Basic są w cenie abonamentu — nie dopłacasz za sprzęt.",
  },
];

// Tier 2 — wspierają decyzję, gaszą praktyczne wątpliwości (widoczne po rozwinięciu)
const TIER_2: FaqItem[] = [
  {
    icon: Router,
    q: "Czy mogę używać własnego routera?",
    a: "Tak — musi być kompatybilny z technologią światłowodową. Jeśli wolisz, dostarczymy nowoczesny router (Wi-Fi 6 lub Combo Wi-Fi 7) w cenie abonamentu.",
  },
  {
    icon: Wrench,
    q: "Co jeśli wystąpi awaria po instalacji?",
    a: "Wsparcie techniczne działa 24/7 — zgłoś awarię pod +48 793 800 300 lub przez formularz na /awaria. W razie potrzeby wysyłamy technika na miejsce.",
  },
  {
    icon: Tag,
    q: "Jaki jest najtańszy internet w Netii?",
    a: "Najtańsza oferta to 40 zł/mies. za Internet do 300 Mb/s + Telewizję S (umowa 24-miesięczna). Sam internet bez TV — najpopularniejszy wariant to 1000 Mb/s w promocji „6 miesięcy za 0 zł„, potem 65 zł/mies. Ostateczna cena zależy od technologii dostępnej pod Twoim adresem.",
  },
  {
    icon: Percent,
    q: "Mam teraz promocję u obecnego dostawcy — czy zmiana się opłaca?",
    a: "Sprawdzimy Twoją obecną cenę telefonicznie i pokażemy realne porównanie — bez naciągania. W większości przypadków nasza oferta jest konkurencyjna już od pierwszego miesiąca, a stała cena obowiązuje przez całą umowę, bez podwyżek w trakcie jej trwania.",
  },
  {
    icon: Truck,
    q: "Planuję się niedługo przeprowadzić — czy to ma sens?",
    a: "Tak — usługę przenosimy razem z Tobą na nowy adres bez dodatkowych kar. Jeśli światłowód nie dotrze jeszcze do nowej lokalizacji, doradca podpowie najlepsze rozwiązanie na czas przeprowadzki.",
  },
  {
    icon: ClipboardCheck,
    q: "Kto zajmuje się formalnościami przy przejściu, np. cesją numeru?",
    a: "My. Wypełniamy i pilnujemy dokumentów przeniesienia numeru oraz kontaktu ze starym operatorem, żebyś nie musiał tego robić sam. Cały proces koordynuje jeden doradca, z którym możesz się kontaktować na bieżąco.",
  },
  {
    icon: Clock,
    q: "Czy muszę być w domu podczas instalacji?",
    a: "Tak, potrzebujemy Twojej obecności na czas montażu — zwykle 30–90 minut. Termin ustalisz bezpośrednio z technikiem po kontakcie z nami.",
  },
  {
    icon: Tv,
    q: "Czy mogę zamówić sam internet bez telewizji?",
    a: "Tak. Konfigurator na /oferta pozwala wybrać sam Internet w dowolnej prędkości. TV (pakiety S/M/L), kanały premium i Mobile 5G to opcjonalne dodatki — możesz je dołożyć teraz lub w trakcie umowy.",
  },
];

// Tier 3 — uzupełnienie, mała waga sprzedażowa (widoczne po rozwinięciu)
const TIER_3: FaqItem[] = [
  {
    icon: Lock,
    q: "Co to jest Bezpieczny Internet Netii?",
    a: "To usługa chroniąca przed wirusami, phishingiem, złośliwym oprogramowaniem i wyciekiem danych.",
  },
];

const EXTRA_ITEMS = [...TIER_2, ...TIER_3];

export default function NetiaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? [...TIER_1, ...EXTRA_ITEMS] : TIER_1;

  // [DODANO] Treść SMS-a — pełne zdanie zamiast samego "INTERNET"
  const smsBody = encodeURIComponent(
    "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
  );

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="w-full py-16 px-6 font-sans overflow-hidden"
    >
      <div className="max-w-305 mx-auto">
        {/* Eyebrow */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            FAQ
          </span>
        </motion.div>

        <motion.h2
          className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          Najczęstsze pytania
        </motion.h2>
        <motion.p
          className="text-center mb-12 max-w-lg mx-auto text-sm sm:text-base text-white/65"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
        >
          Odpowiedzi na to, co najczęściej pyta nas 2,4 mln klientów. Coś jeszcze
          niejasne? Doradca odpowie w 3 minuty przez telefon.
        </motion.p>

        {/* Accordion — dwie kolumny od sm w górę, jedna na mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 items-start">
          {visibleItems.map((item, i) => {
            const isOpen = openIndex === i;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.q}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (i % 2) * 0.08,
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? "bg-teal-400/10 border-teal-400/30"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
                style={{
                  boxShadow: isOpen
                    ? "0 8px 20px -8px rgba(0,0,0,0.35)"
                    : "none",
                }}
              >
                <div className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5">
                  <motion.div
                    animate={
                      isOpen
                        ? { scale: [1, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={
                      isOpen
                        ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    className={`flex items-center justify-center shrink-0 rounded-xl h-10 w-10 transition-colors duration-300 ${
                      isOpen
                        ? "bg-teal-400/15 text-teal-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </motion.div>

                  <span
                    className={`flex-1 font-medium text-base sm:text-[1.0625rem] leading-snug transition-colors duration-300 ${
                      isOpen ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.q}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                  >
                    <Plus size={20} className="text-teal-400" />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[calc(2.5rem+1rem)] text-sm sm:text-[0.9375rem] leading-relaxed text-white/60"
                      >
                        {item.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Toggle — trzyma domyślną wysokość sekcji krótką, bez tracenia treści */}
        {!showAll && (
          <div className="flex justify-center mb-14">
            <motion.button
              type="button"
              onClick={() => {
                setShowAll(true);
                setOpenIndex(null);
              }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
            >
              Pokaż więcej pytań ({EXTRA_ITEMS.length})
              <ChevronDown size={16} />
            </motion.button>
          </div>
        )}
        {showAll && <div className="mb-14" />}

        {/* Closing CTA — call or SMS only, styled like Hero buttons */}
        <motion.div
          className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10 sm:py-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* [ZMIENIONO] Nagłówek i opis — z trybu "masz pytania?" na tryb
              domykający sprzedaż: "gotowy do zamówienia?" zamiast pytania
              o wątpliwości. */}
          <h3 className="font-bold text-white text-xl sm:text-2xl mb-2">
            Gotowy/a do zamówienia?
          </h3>
          <p className="mb-6 text-sm sm:text-[0.9375rem] text-white/65">
            ~3 minuty rozmowy i internet jest zamówiony. Doradca odbierze od razu.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.a
              href="tel:+48887843260"
              onClick={() => trackContact("faq_closing_phone_button")}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(45, 212, 191, 0.45)",
                  "0 0 0 8px rgba(45, 212, 191, 0)",
                  "0 0 0 0 rgba(45, 212, 191, 0.45)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between gap-4 rounded-xl bg-teal-500 px-5 py-3.5 text-white sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Phone size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">ZADZWOŃ</span>
                  <span className="block text-xs text-white/85">+48 887 843 260</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/70" />
            </motion.a>

            <motion.a
              href={`sms:+48887843260?body=${smsBody}`}
              onClick={() => trackContact("faq_closing_sms_button")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white sm:min-w-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={16} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold leading-tight">WYŚLIJ SMS</span>
                  <span className="block text-xs text-white/70">Oddzwonimy w 3 minuty</span>
                </span>
              </span>
              <ChevronRight size={18} className="text-white/50" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}