"use client";

import Image from "next/image";
import {
  RotateCcw,
  Headset,
  Wrench,
  BadgeCheck,
  Phone,
  Gauge,
  Clock,
  MessageCircle,
  ChevronRight,
  Mail,
} from "lucide-react";
import DottedBackground from "@/components/ui/DottedBackground";
import { REVIEWS } from "./homeReviewsData";
import { trackContact } from "@/lib/meta-track";
import {
  SPEED_GUARANTEE,
  INSTALL_TIMING,
  SERVICE_SLA,
  ATTRIBUTION,
} from "@/lib/guarantees";

// UWAGA: dodaj pole `photoUrl`, `pakiet` oraz `stat` do każdego wpisu w homeReviewsData.ts
// (np. photoUrl: "/images/person1.webp", pakiet: "Internet 600 Mb/s",
//  stat: "Zgłoszenie 20:14 → naprawa 20:47").
// Poniższe tablice to fallbacki na wypadek, gdyby dane nie miały jeszcze tych pól.
const FALLBACK_PAKIETY = ["Internet 300 Mb/s", "Internet 600 Mb/s", "Internet 1 Gb/s"];
// Kolory teł dla awatarów z inicjałami — rotowane po indeksie recenzji,
// żeby kolumna nie wyglądała monotonnie przy samych literach.
const INITIALS_BG = [
  "bg-teal-400/15 text-teal-300",
  "bg-sky-400/15 text-sky-300",
  "bg-amber-400/15 text-amber-300",
  "bg-violet-400/15 text-violet-300",
];
// Konkretne liczby > ogólniki typu "szybko" / "kilkanaście minut".
const FALLBACK_STATS = [
  "Zgłoszenie 19:52 → kontakt w 4 min",
  "Zgłoszenie 20:14 → naprawa 20:47",
  "Umowa podpisana w 6 minut",
];

type Review = {
  initials: string;
  name: string;
  age: number;
  city: string;
  date: string;
  text: string;
  photoUrl?: string;
  pakiet?: string;
  stat?: string;
};

/* Brzmienie gwarancji prędkości, terminu instalacji i SLA serwisu
   pochodzi z lib/guarantees.ts. NIE wpisuj tych zdań tutaj ręcznie —
   te same teksty stoją w siedmiu miejscach na stronie i rozjeżdżały się
   już raz (termin instalacji miał pięć różnych wariantów). */
const GUARANTEES = [
  {
    icon: Gauge,
    title: SPEED_GUARANTEE.title,
    desc: SPEED_GUARANTEE.descFull,
  },
  {
    icon: Headset,
    title: "Wsparcie zawsze pod ręką",
    desc: `Infolinia i serwis techniczny gotowe pomóc, gdy coś się zdarzy. ${SERVICE_SLA.short}`,
  },
  {
    icon: Wrench,
    title: "Profesjonalny montaż",
    desc: `Technik podłączy i skonfiguruje wszystko na miejscu. ${INSTALL_TIMING.short}`,
  },
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Umowa poza salonem? Masz 14 dni na odstąpienie bez podania przyczyny.",
  },
];

// Skrócona wersja gwarancji na sam dół sekcji — 3 najsilniejsze objection-killery
// w poziomym pasku, tak jak w referencyjnym screenie (ikona + tytuł + opis).
const BOTTOM_TRUST_STRIP = [
  {
    icon: Gauge,
    title: SPEED_GUARANTEE.title,
    desc: SPEED_GUARANTEE.descShort,
  },
  {
    icon: RotateCcw,
    title: "14 dni na zmianę zdania",
    desc: "Odstąpienie od umowy bez podania przyczyny.",
  },
  {
    icon: Headset,
    title: "Wsparcie zawsze pod ręką",
    desc: "Infolinia i serwis techniczny gotowe pomóc.",
  },
];

type AdvisorInfo = {
  advisorName?: string;
  advisorRole?: string;
  advisorBio?: string;
  advisorPhotoUrl?: string;
  advisorEmail?: string;
  phoneNumber?: string;
};

/* [KOPIA] Bez animacji wejścia — sekcja renderuje się od razu w pełnej
   formie. Na samym dole dodany poziomy pasek zaufania (3 gwarancje),
   powtórzenie tych samych faktów co w panelu po prawej, ale w formacie
   łatwym do zeskanowania jednym rzutem oka, tuż przed przejściem do
   kolejnej sekcji strony. */
export default function NetiaSocialProof({
  advisorName = "Jarosław Sitek",
  advisorRole = "Twój doradca w sprawie internetu",
  advisorBio = "Autoryzowany partner Netii. Pomagam bezstresowo zmienić dostawcę internetu.",
  // TODO: podmień ścieżkę, jeśli plik leży gdzie indziej niż /public.
  advisorPhotoUrl = "/images/Jaroslaw.webp",
  advisorEmail = "jaroslaw.sitek@przedstawiciel.netia.pl",
  phoneNumber = "+48 887 843 260",
}: AdvisorInfo) {
  // Treść SMS-a — pełne zdanie zamiast samego "INTERNET", poprawnie
  // zakodowane dla polskich znaków.
  const smsBody = encodeURIComponent(
    "Jestem wstępnie zainteresowany/a ofertami, proszę o kontakt."
  );

  return (
    <section
      style={{ backgroundColor: "#0B2A3D" }}
      className="relative overflow-hidden w-full py-16 px-6 font-sans"
    >
      <DottedBackground variant="dots-accent" size={22} />

      <div className="max-w-305 mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Opinie i gwarancje
          </span>
        </div>

        <h2 className="text-center font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-2">
          Dołącz do <span className="text-teal-400">2,4 mln klientów sieci Netia</span>,{" "}
          <br className="hidden sm:block" />
          którzy przestali martwić się o internet
        </h2>

        {/* Podtytuł przejęty z dawnej osobnej sekcji kontaktowej */}
        <p className="text-center text-white/60 text-sm sm:text-base mb-8">
          Szybki kontakt, zero formalności — i internet, który wreszcie działa tak, jak obiecano.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          {/* Reviews column — statyczna kolumna kart, NIE karuzela */}
          <div className="flex flex-col gap-4 h-full">
            {REVIEWS.map((r: Review, i: number) => {
              const stat = r.stat ?? FALLBACK_STATS[i % FALLBACK_STATS.length];
              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center lg:items-start text-left gap-4 sm:gap-5 flex-1 rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/5 transition-all duration-300 hover:border-teal-400/30 hover:bg-white/[0.07] hover:-translate-y-0.5"
                >
                  {/* Kolumna ze zdjęciem — na mobile zdjęcie po lewej, opis po prawej; od sm: zdjęcie na górze, opis wyśrodkowany pod spodem; od lg: wyrównanie do góry */}
                  <div className="flex flex-row items-center gap-4 w-full sm:w-28 md:w-32 sm:flex-col sm:items-center shrink-0">
                    <div
                      className={`flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-xl border border-white/15 font-bold text-lg sm:text-xl md:text-2xl tracking-wide ${INITIALS_BG[i % INITIALS_BG.length]}`}
                      aria-hidden="true"
                    >
                      {r.initials}
                    </div>
                    <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
                      <p className="text-white text-[13px] font-semibold leading-tight m-0 sm:mt-2">
                        {r.name}
                      </p>
                      <p className="text-white/60 text-[11px] leading-tight m-0 mb-1.5">{r.city}</p>
                      <span className="inline-block whitespace-nowrap rounded-full bg-teal-400/15 text-teal-300 text-[10px] font-semibold px-2.5 py-1 leading-none">
                        {r.pakiet ?? FALLBACK_PAKIETY[i % FALLBACK_PAKIETY.length]}
                      </span>
                    </div>
                  </div>

                  {/* Kolumna z treścią */}
                  <div className="flex-1 min-w-0 self-start">
                    {/* Konkretna statystyka zamiast ogólnika — buduje wiarygodność mocniej niż przymiotnik */}
                    {stat && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 mb-3 text-teal-300 text-[11px] font-semibold">
                        <Clock size={12} strokeWidth={2.5} />
                        {stat}
                      </div>
                    )}

                    <p className="text-white/85 text-[15px] sm:text-base leading-relaxed mb-4 sm:mb-5">
                      „{r.text}”
                    </p>

                    <div className="flex items-center justify-start gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-teal-400 text-xs font-semibold">
                        <BadgeCheck size={13} />
                        Zweryfikowany klient
                      </span>
                      <span className="text-white/40 text-xs">· {r.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantees + Advisor contact — scalony panel (dawniej 2 osobne sekcje) */}
          <div className="rounded-2xl p-6 sm:p-7 flex flex-col border border-white/10 bg-white/5">
            <p className="uppercase mb-5 text-teal-400 text-xs font-bold tracking-wide">
              Kupujesz bez ryzyka
            </p>

            <div className="flex flex-col gap-5 mb-6">
              {GUARANTEES.map((g, i) => {
                const Icon = g.icon;
                return (
                  <div key={i} className="group flex gap-3.5">
                    <div className="flex items-center justify-center shrink-0 rounded-xl h-9 w-9 bg-teal-400/12 text-teal-300 transition-transform duration-300 group-hover:scale-110 group-hover:bg-teal-400/20">
                      <Icon size={17} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-white text-[0.9375rem] font-semibold m-0 mb-0.5">
                        {g.title}
                      </p>
                      <p className="text-white/60 text-[0.8438rem] leading-relaxed m-0">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini-profil doradcy — przejęty z dawnej ContactSection, teraz z krótkim bio zaufania */}
            <div className="flex items-center gap-4 pt-5 mb-5 border-t border-white/10">
              <Image
                src={advisorPhotoUrl}
                alt={advisorName}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-xl object-cover border border-white/15"
              />
              <div>
                <p className="text-white text-lg font-bold leading-tight m-0">{advisorName}</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wide m-0">
                  {advisorRole}
                </p>
                {advisorBio && (
                  <p className="text-white/45 text-xs leading-snug m-0 mt-1">{advisorBio}</p>
                )}
                {advisorEmail && (
                  <a
                    href={`mailto:${advisorEmail}`}
                    onClick={() => trackContact("social_proof_email_link")}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-teal-300/90 text-xs font-medium transition-colors hover:text-teal-300 hover:underline underline-offset-2"
                  >
                    <Mail size={12} className="shrink-0" />
                    {advisorEmail}
                  </a>
                )}
              </div>
            </div>

            {/* Closing CTA — spersonalizowane, telefon doradcy */}
            <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                onClick={() => trackContact("social_proof_phone_button")}
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-teal-500 px-4 py-3 text-white transition-transform duration-150 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Phone size={14} />
                  </span>
                  <span className="text-sm font-bold">
                    Zadzwoń
                    <br /> <span className="font-normal">{phoneNumber}</span>
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  className="text-white/70 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href={`sms:${phoneNumber.replace(/\s+/g, "")}?body=${smsBody}`}
                onClick={() => trackContact("social_proof_sms_button")}
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white transition-transform duration-150 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <MessageCircle size={14} />
                  </span>
                  <span className="text-sm font-bold">Wyślij SMS</span>
                </span>
                <ChevronRight
                  size={16}
                  className="text-white/50 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>

            <p className="pt-5 mt-5 border-t border-white/10 text-white/55 text-[13px] leading-relaxed">
              Jeśli po podpisaniu umowy zmienisz zdanie, masz 14 dni na odstąpienie od umowy
              zawartej poza lokalem firmy. Późniejsze rozwiązanie umowy odbywa się zgodnie z jej
              warunkami.
            </p>

            {/* [ATRYBUCJA] Panel łączy gwarancje w pierwszej osobie
                ("monitorujemy", "oddzwaniamy") z liczbami operatorskimi
                w nagłówku sekcji. Ta nota mówi wprost, kto za co odpowiada —
                patrz ATTRIBUTION w lib/guarantees.ts. */}
            <p className="pt-4 mt-4 border-t border-white/10 text-white/40 text-[12px] leading-relaxed">
              {ATTRIBUTION.advisorNote}
            </p>
          </div>
        </div>

        {/* Poziomy pasek zaufania na samym dole sekcji */}
        <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BOTTOM_TRUST_STRIP.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex items-center justify-center shrink-0 rounded-xl h-11 w-11 bg-white/5 text-white/70">
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-snug m-0 mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-white/45 text-[13px] leading-snug m-0">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}