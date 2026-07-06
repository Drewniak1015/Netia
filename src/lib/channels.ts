// lib/channels.ts
export type Tier = "s" | "m" | "l";

export type Channel = {
  name: string;
  number: number;
  tier: Tier;          // od którego pakietu głównego dostępny (S/M/L)
  addon?: string;       // klucz dodatku, jeśli kanał jest częścią dodatku premium
  color: string;        // fallback tło, gdy nie ma logo
  logoUrl?: string;
  alt?: string;
};

export const TIER_LABELS: Record<Tier, string> = {
  s: "Pakiet S",
  m: "Pakiet M",
  l: "Pakiet L",
};

export const TIER_ORDER: Record<Tier, number> = { s: 1, m: 2, l: 3 };

export const ADDONS: { key: string; label: string }[] = [
  { key: "canal-prestige", label: "Canal+ Prestige" },
  { key: "canal-select", label: "Canal+ Select" },
  { key: "eleven-sports", label: "Eleven Sports" },
  { key: "cinemax-hd", label: "Cinemax HD" },
  { key: "polsat-sport-premium", label: "Polsat Sport Premium" },
  { key: "hbo", label: "HBO" },
  { key: "filmbox", label: "Filmbox" },
  { key: "ukraina", label: "Ukraina" },
  { key: "dorosli", label: "Dla dorosłych" },
  { key: "dzieci", label: "Dla Dzieci" },
];

export const CHANNELS: Channel[] = [
  { name: "TVP 1", number: 1, tier: "s", color: "#e11d48", logoUrl: "/logos/tvp1.png", alt: "Logo TVP 1" },
  { name: "TVP 2", number: 2, tier: "s", color: "#e11d48", logoUrl: "/logos/tvp2.png", alt: "Logo TVP 2" },
  { name: "Polsat", number: 3, tier: "s", color: "#f59e0b", logoUrl: "/logos/polsat.png", alt: "Logo Polsat" },
  { name: "TVN", number: 4, tier: "s", color: "#2563eb", logoUrl: "/logos/tvn.png", alt: "Logo TVN" },
  { name: "TV4", number: 5, tier: "s", color: "#f97316" },
  { name: "TVP Info", number: 6, tier: "s", color: "#ef4444" },
  { name: "Polsat News", number: 7, tier: "s", color: "#f59e0b" },
  { name: "TVN24", number: 8, tier: "s", color: "#2563eb" },
  { name: "Puls 2", number: 9, tier: "s", color: "#16a34a" },
  { name: "TTV", number: 10, tier: "s", color: "#7c3aed" },

  { name: "TVN 7", number: 11, tier: "m", color: "#2563eb" },
  { name: "Polsat 2", number: 12, tier: "m", color: "#f59e0b" },
  { name: "TVP Kultura", number: 13, tier: "m", color: "#dc2626" },
  { name: "Nat Geo Wild", number: 14, tier: "m", color: "#facc15" },
  { name: "Discovery Channel", number: 15, tier: "m", color: "#0ea5e9" },
  { name: "TLC", number: 16, tier: "m", color: "#db2777" },
  { name: "Comedy Central", number: 17, tier: "m", color: "#ea580c" },
  { name: "MTV", number: 18, tier: "m", color: "#059669" },
  { name: "Eurosport 1", number: 19, tier: "m", color: "#1d4ed8" },
  { name: "Kino Polska", number: 20, tier: "m", color: "#9333ea" },

  { name: "HBO", number: 21, tier: "l", addon: "hbo", color: "#4c1d95" },
  { name: "HBO 2", number: 22, tier: "l", addon: "hbo", color: "#4c1d95" },
  { name: "Canal+ Prestige", number: 23, tier: "l", addon: "canal-prestige", color: "#1e293b" },
  { name: "Canal+ Select", number: 24, tier: "l", addon: "canal-select", color: "#334155" },
  { name: "Eleven Sports 1", number: 25, tier: "l", addon: "eleven-sports", color: "#059669" },
  { name: "Polsat Sport Premium", number: 26, tier: "l", addon: "polsat-sport-premium", color: "#f97316" },
  { name: "Cinemax HD", number: 27, tier: "l", addon: "cinemax-hd", color: "#7c3aed" },
  { name: "Filmbox", number: 28, tier: "l", addon: "filmbox", color: "#be123c" },
  { name: "National Geographic", number: 29, tier: "l", color: "#facc15" },
  { name: "Fightbox", number: 30, tier: "l", color: "#111827" },
];

export function isValidTier(value: string): value is Tier {
  return value === "s" || value === "m" || value === "l";
}

// Kanały dostępne w danym pakiecie głównym (bez dodatków)
export function channelsForTier(tier: Tier): Channel[] {
  return CHANNELS.filter((ch) => TIER_ORDER[ch.tier] <= TIER_ORDER[tier] && !ch.addon).sort(
    (a, b) => a.number - b.number
  );
}

// Kanały danego dodatku premium
export function channelsForAddon(addonKey: string): Channel[] {
  return CHANNELS.filter((ch) => ch.addon === addonKey).sort((a, b) => a.number - b.number);
}