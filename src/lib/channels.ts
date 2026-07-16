// lib/channels.ts
// Dane zweryfikowane na podstawie oficjalnej ulotki Netia
// "NETIA_Lista_Kanałów_202601-1.pdf" (stan na 01.01.2026 r.)
//
// Zmiany w tej wersji względem poprzedniej:
// - MINIMINI+ HD: poprawiono numer 199 -> 99 (zgodnie z PDF)
// - EURONEWS RUS: poprawiono numer 1199 -> 199 (literówka)
// - Dodano brakujący kanał 168 - KINO TV HD * (pakiet L, gwarantowany)
// - Poprawiono nazwę: "VIASAT EPIC DRAMA HD" -> "EPIC DRAMA HD"
// - Poprawiono nazwę: "ZOOM HD" -> "ZOOM TV HD"
// - Canal+ Select i Canal+ Prestige: zamieniono zmyślone numery (510-517 / 500-509)
//   na prawdziwe numery kanałów z ulotki (158-167), z poprawnymi nazwami i flagami "*"
// - Ukraina: X SPORT jest kanałem gwarantowanym (*) - dodano guaranteed: true
// - Przywrócono dodatek "Dla Dzieci" (10 zł/mies.) wraz z pełną listą 13 kanałów
//   (BBC CBeebies, Cartoon Network HD, Cartoonito HD, Da Vinci Learning, Disney
//   Channel HD, Disney Junior, Disney XD, MiniMini+ HD, Nick Jr.*, Nickelodeon
//   Polska*, Nicktoons HD*, TeenNick HD, Teletoon+ HD) - to te same fizyczne
//   kanały co w pakiecie bazowym L, dodatek pozwala je dokupić przy niższym pakiecie.
// - UWAGA: ta ulotka w ogóle nie wymienia pakietu XS (mowa wyłącznie o S/M/L: 93/118/186
//   kanałów). Dane dla tier "xs" pochodzą z innego źródła i NIE zostały zweryfikowane
//   względem tego dokumentu - do potwierdzenia osobnym źródłem.

export type Tier = "xs" | "s" | "m" | "l";
export type Channel = {
  name: string;
  number: number;
  tier: Tier;          // od którego pakietu głównego dostępny (XS/S/M/L)
  addon?: string;       // klucz dodatku, jeśli kanał jest częścią dodatku premium
  guaranteed?: boolean; // kanał gwarantowany (oznaczony "*" w ulotce)
  only4k?: boolean;     // kanał dostępny wyłącznie na odbiornikach 4K
  color: string;        // fallback tło, gdy nie ma logo
  logoUrl?: string;
  alt?: string;
};

// WAŻNE: niektóre kanały (np. Canal+ Sport 3 HD) mają TEN SAM numer "number"
// w kilku dodatkach jednocześnie (Canal+ Select i Canal+ Prestige to te same
// fizyczne kanały). Jeśli w komponencie renderującym listę kanałów użyjesz
// `channel.number` jako klucza React (key={channel.number}), przy jednoczesnym
// wyświetlaniu obu dodatków dojdzie do kolizji kluczy i React zacznie mylić/
// podmieniać węzły DOM (stąd "bugujące się" zdjęcia/logo). Użyj zamiast tego
// `channelId(channel)` jako klucza - jest zawsze unikalny.
export function channelId(ch: Channel): string {
  return `${ch.addon ?? ch.tier}-${ch.number}`;
}

export const TIER_LABELS: Record<Tier, string> = {
  xs: "Pakiet XS",
  s: "Pakiet S",
  m: "Pakiet M",
  l: "Pakiet L",
};

export const TIER_CHANNEL_COUNTS: Record<Tier, number> = { xs: 35, s: 93, m: 118, l: 186, };

export const TIER_ORDER: Record<Tier, number> = { xs: 0, s: 1, m: 2, l: 3 };

export const ADDONS: { key: string; label: string }[] = [
  { key: "canal-plus-prestige", label: "Canal+ Prestige" },
  { key: "canal-plus-select", label: "Canal+ Select" },
  { key: "cinemax-hd", label: "Cinemax" },
  { key: "dorosli", label: "Dla Dorosłych" },
  { key: "dzieci", label: "Pakiet dla Dzieci" }, // 10 zł/mies. - 13 kanałów
  { key: "eleven-sports", label: "Eleven Sports" },
  { key: "filmbox", label: "FilmBox+" },
  { key: "hbo", label: "HBO HD" },
  { key: "polsat-sport-premium", label: "Polsat Sport Premium" },
  { key: "ukraina", label: "Ukraina" },
];

// Uwaga: pakiet XS zawiera dodatkowo 16 kanałów regionalnych TVP, które w ulotce
// nie zostały wymienione z osobna (podane wyłącznie jako "+16 kanałów regionalnych TVP").
export const REGIONAL_TVP_CHANNELS_COUNT = 16;

// CHANNELS zawiera WYŁĄCZNIE kanały dostępne w ramach pakietów bazowych (XS/S/M/L).
// Kanały dostępne tylko w ramach płatnych dodatków znajdują się wyłącznie w ADDON_CHANNELS,
// aby uniknąć "przeciekania" kanałów dodatkowych do channelsForTier().
export const CHANNELS: Channel[] = [
  { number: 1, name: "POLSAT HD", tier: "xs", guaranteed: true, color: "#be123c", logoUrl: "/Kanaly/Polsat_HD_logo.webp" },
  { number: 7, name: "TVP 1 HD", tier: "xs", guaranteed: true, color: "#16a34a", logoUrl: "/Kanaly/TVP_1_HD_logo.webp" },
  { number: 8, name: "TVP 2 HD", tier: "xs", guaranteed: true, color: "#7c3aed", logoUrl: "/Kanaly/TVP_2_HD_logo.webp" },
  { number: 11, name: "TV 4 HD", tier: "xs", guaranteed: true, color: "#f59e0b", logoUrl: "/Kanaly/TV4_HD_logo.webp" },
  { number: 21, name: "TV OKAZJA HD", tier: "xs", color: "#b91c1c", logoUrl: "/Kanaly/TV_Okazje_HD_logo.webp" },
  { number: 23, name: "TELE 5 HD", tier: "xs", color: "#0ea5e9", logoUrl: "/Kanaly/Tele_5_HD_logo.webp" },
  { number: 24, name: "POLONIA 1", tier: "xs", color: "#4c1d95", logoUrl: "/Kanaly/Polonia_1_logo.webp" },
  { number: 29, name: "WP HD", tier: "xs", color: "#be123c", logoUrl: "/Kanaly/WP_HD_logo.webp" },
  { number: 31, name: "INULTRA HDR 4K", tier: "xs", only4k: true, color: "#db2777", logoUrl: "/Kanaly/InUltra_logo.webp" },
  { number: 32, name: "MYZEN 4K", tier: "xs", only4k: true, color: "#facc15", logoUrl: "/Kanaly/MyZen_4K__logo.webp" },
  { number: 33, name: "MUSEUM 4K", tier: "xs", only4k: true, color: "#dc2626", logoUrl: "/Kanaly/Museum_4K__logo.webp" },
  { number: 34, name: "LOVE NATURE 4K", tier: "xs", only4k: true, color: "#be123c", logoUrl: "/Kanaly/Love_Nature_4K__logo.webp" },
  { number: 41, name: "TRAVELXP 4K", tier: "xs", only4k: true, color: "#be123c", logoUrl: "/Kanaly/TravelXP_4K_logo.webp" },
  { number: 270, name: "LUBELSKA.TV HD", tier: "xs", color: "#059669", logoUrl: "/Kanaly/Lubelska_TV_HD_logo.webp" },
  { number: 272, name: "TVT HD", tier: "xs", color: "#f59e0b", logoUrl: "/Kanaly/TVT_logo.webp" },
  { number: 273, name: "DLACIEBIE.TV", tier: "xs", color: "#111827",logoUrl:"/Kanaly/DlaCiebie_TV_logo.webp" },
  { number: 274, name: "TV REGIONALNA.PL", tier: "xs", color: "#334155", logoUrl: "/Kanaly/TV_Regionalna_pl_logo.webp" },
  { number: 275, name: "TELEWIZJA KŁODZKA", tier: "xs", color: "#111827", logoUrl: "/Kanaly/Telewizja_Klodzka_logo.webp" },
  { number: 2, name: "POLSAT 2 HD", tier: "s", guaranteed: true, color: "#0d9488", logoUrl: "/Kanaly/Polsat_2_HD_logo.webp" },
  { number: 3, name: "TVN HD", tier: "s", guaranteed: true, color: "#c026d3", logoUrl: "/Kanaly/TVN_HD_logo.webp" },
  { number: 4, name: "TVN SIEDEM HD", tier: "s", guaranteed: true, color: "#1e293b", logoUrl: "/Kanaly/TVN7_HD_logo.webp" },
  { number: 9, name: "TV PULS HD", tier: "s", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/TV_Puls_HD_logo.webp" },
  { number: 10, name: "PULS 2 HD", tier: "s", color: "#16a34a", logoUrl: "/Kanaly/Puls_2_HD_logo.webp" },
  { number: 12, name: "TV 6 HD", tier: "s", guaranteed: true, color: "#16a34a", logoUrl: "/Kanaly/TV6_HD_logo.webp" },
  { number: 13, name: "POLSAT NEWS HD", tier: "s", guaranteed: true, color: "#1d4ed8", logoUrl: "/Kanaly/Polsat_News_logo.webp" },
  { number: 14, name: "TVP ROZRYWKA", tier: "s", color: "#db2777", logoUrl: "/Kanaly/TVP_Rozrywka_logo.webp" },
  { number: 15, name: "TVP KULTURA HD", tier: "s", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/TVP_Kultura_HD_logo.webp" },
  { number: 16, name: "TVP POLONIA HD", tier: "s", color: "#9333ea", logoUrl: "/Kanaly/TVP_Polonia_HD_logo.webp" },
  { number: 17, name: "TTV HD", tier: "s", color: "#f59e0b", logoUrl: "/Kanaly/TTV_HD_logo.webp" },
  { number: 22, name: "TVS HD", tier: "s", color: "#e11d48", logoUrl: "/Kanaly/TVS_HD_logo.webp" },
  { number: 26, name: "TV TRWAM", tier: "s", color: "#b91c1c", logoUrl: "/Kanaly/TV_Trwam_logo.webp" },
  { number: 27, name: "ZOOM TV HD", tier: "s", color: "#b91c1c", logoUrl: "/Kanaly/Zoom_TV_HD_logo.webp" },
  { number: 28, name: "NOWA TV HD", tier: "s", guaranteed: true, color: "#059669",logoUrl: "/Kanaly/Nowa_TV_HD_logo.webp" },
  { number: 30, name: "METRO HD", tier: "s", color: "#1d4ed8", logoUrl: "/Kanaly/Metro_HD_logo.webp" },
  { number: 38, name: "POLSAT VIASAT NATURE HD", tier: "s", color: "#b91c1c", logoUrl: "/Kanaly/Polsat_Viasat_Nature_HD_logo.webp" },
  { number: 40, name: "FOKUS TV HD", tier: "s", guaranteed: true, color: "#1e293b", logoUrl: "/Kanaly/Fokus_TV_HD_logo.webp" },
  { number: 52, name: "TVP HISTORIA", tier: "s", color: "#0891b2", logoUrl: "/Kanaly/TVP_Historia_HD_logo.webp" },
  { number: 54, name: "POLSAT VIASAT HISTORY HD", tier: "s", color: "#0d9488", logoUrl: "/Kanaly/Polsat_Viasat_History_HD_logo.webp" },
  { number: 57, name: "POLSAT DOKU HD", tier: "s", guaranteed: true, color: "#16a34a", logoUrl: "/Kanaly/Polsat_Doku_HD_logo.webp" },
  { number: 60, name: "POLSAT SPORT 1 HD", tier: "s", guaranteed: true, color: "#dc2626", logoUrl: "/Kanaly/Polsat_Sport_1_HD_logo.webp" },
  { number: 61, name: "POLSAT SPORT 2 HD", tier: "s", guaranteed: true, color: "#4c1d95", logoUrl: "/Kanaly/Polsat_Sport_2_HD_logo.webp" },
  { number: 68, name: "TVP SPORT HD", tier: "s", guaranteed: true, color: "#facc15", logoUrl: "/Kanaly/TVP_Sport_HD_logo.webp" },
  { number: 69, name: "SUPER POLSAT HD", tier: "s", guaranteed: true, color: "#c026d3", logoUrl: "/Kanaly/Super_Polsat_HD_logo.webp" },
  { number: 71, name: "POLSAT SPORT 3 HD", tier: "s", guaranteed: true, color: "#facc15", logoUrl: "/Kanaly/Polsat_Sport_3_HD_logo.webp" },
  { number: 72, name: "POLSAT SPORT FIGHT HD", tier: "s", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/Polsat_Sport_Fight_HD_logo.webp" },
  { number: 73, name: "POLSAT PLAY HD", tier: "s", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/Polsat_Play_HD_logo.webp" },
  { number: 76, name: "POLSAT VIASAT EXPLORE HD", tier: "s", color: "#2563eb", logoUrl: "/Kanaly/Polsat_Viasat_Explore_HD_logo.webp" },
  { number: 78, name: "POLSAT GAMES HD", tier: "s", color: "#4c1d95", logoUrl: "/Kanaly/Polsat_Games_HD_logo.webp" },
  { number: 80, name: "POLSAT X HD", tier: "s", color: "#9333ea", logoUrl: "/Kanaly/Polsat_X_logo.webp" },
  { number: 86, name: "POLSAT CAFE HD", tier: "s", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Polsat_Cafe_HD_logo.webp" },
  { number: 94, name: "POLSAT RODZINA HD", tier: "s", color: "#db2777", logoUrl: "/Kanaly/Polsat_Rodzina_HD_logo.webp" },
  { number: 96, name: "POLSAT REALITY HD", tier: "s", color: "#9333ea", logoUrl: "/Kanaly/Polsat_Reality_logo.webp" },
  { number: 97, name: "CI POLSAT HD", tier: "s", guaranteed: true, color: "#4c1d95", logoUrl: "/Kanaly/Crime_Investigation_Polsat_HD_logo.webp" },
  { number: 100, name: "POLSAT JIM JAM", tier: "s", guaranteed: true, color: "#0d9488", logoUrl: "/Kanaly/Polsat_JimJam_logo.webp" },
  { number: 104, name: "4FUN KIDS", tier: "s", color: "#1e293b", logoUrl: "/Kanaly/4fun_Kids_logo.webp" },
  { number: 115, name: "TVP ABC", tier: "s", guaranteed: true, color: "#0ea5e9", logoUrl: "/Kanaly/TVP_ABC_logo.webp" },
  { number: 120, name: "POLSAT SERIALE HD", tier: "s", guaranteed: true, color: "#1d4ed8", logoUrl: "/Kanaly/Polsat_Seriale_HD_logo.webp" },
  { number: 127, name: "POLSAT COMEDY CENTRAL EXTRA HD", tier: "s", color: "#0891b2", logoUrl: "/Kanaly/Polsat_Comedy_Central_Extra_HD_logo.webp" },
  { number: 139, name: "POLSAT FILM 2 HD", tier: "s", color: "#a16207", logoUrl: "/Kanaly/Polsat_Film_2_logo.webp" },
  { number: 141, name: "POLSAT FILM HD", tier: "s", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Polsat_Film_HD_logo.webp" },
  { number: 148, name: "STOPKLATKA TV HD", tier: "s", color: "#334155", logoUrl: "/Kanaly/Stopklatka_TV_HD_logo.webp" },
  { number: 179, name: "WYDARZENIA 24 HD", tier: "s", color: "#b91c1c", logoUrl: "/Kanaly/Wydarzenia24_HD_logo.webp" },
  { number: 181, name: "POLSAT NEWS 2", tier: "s", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/Polsat_News_2_logo.webp" },
  { number: 182, name: "TVP INFO HD", tier: "s", guaranteed: true, color: "#7c3aed", logoUrl: "/Kanaly/TVP_Info_HD_logo.webp" },
  { number: 186, name: "POLSAT NEWS POLITYKA HD", tier: "s", color: "#1e293b", logoUrl: "/Kanaly/Polsat_News_Polityka_logo.webp" },
  { number: 220, name: "4FUN.TV", tier: "s", color: "#f59e0b", logoUrl: "/Kanaly/4fun_TV_logo.webp" },
  { number: 221, name: "4FUN DANCE", tier: "s", color: "#be123c", logoUrl: "/Kanaly/4fun_Dance_logo.webp" },
  { number: 224, name: "POLSAT MUSIC HD", tier: "s", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/Polsat_Music_HD_logo.webp" },
  { number: 225, name: "POLO TV", tier: "s", guaranteed: true, color: "#1e293b",logoUrl:'Kanaly/Polo_TV_logo.webp' },
  { number: 226, name: "ESKA TV HD", tier: "s", guaranteed: true, color: "#1e293b", logoUrl: "/Kanaly/Eska_TV_HD_logo.webp" },
  { number: 227, name: "ESKA EXTRA TV HD", tier: "s", color: "#4c1d95", logoUrl: "/Kanaly/Eska_Extra_TV_HD_logo.webp" },
  { number: 229, name: "DISCO POLO MUSIC", tier: "s", guaranteed: true, color: "#059669", logoUrl: "/Kanaly/Disco_Polo_Music_logo.webp" },
  { number: 236, name: "STARS TV HD", tier: "s", color: "#0d9488", logoUrl: "/Kanaly/Stars_TV_HD_logo.webp" },
  { number: 241, name: "ESKA ROCK TV", tier: "s", color: "#7c3aed", logoUrl: "/Kanaly/Eska_Rock_TV_logo.webp" },
  { number: 242, name: "VOX MUSIC TV", tier: "s", color: "#b91c1c", logoUrl: "/Kanaly/Vox_Music_TV_logo.webp" },
  { number: 269, name: "MANGO", tier: "s", color: "#c026d3" },
  { number: 271, name: "TVC HD", tier: "s", color: "#9333ea", logoUrl: "/Kanaly/TVC_HD_logo.webp" },
  { number: 5, name: "TVN 24 HD", tier: "m", guaranteed: true, color: "#7c3aed", logoUrl: "/Kanaly/TVN_24_HD_logo.webp" },
  { number: 6, name: "TVN 24 BIS HD", tier: "m", guaranteed: true, color: "#059669", logoUrl: "/Kanaly/TVN_24_BIS_HD_logo.webp" },
  { number: 18, name: "TVN TURBO HD", tier: "m", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/TVN_Turbo_HD_logo.webp" },
  { number: 19, name: "TVN STYLE HD", tier: "m", guaranteed: true, color: "#16a34a", logoUrl: "/Kanaly/TVN_Style_HD_logo.webp" },
  { number: 20, name: "HGTV HD", tier: "m", guaranteed: true, color: "#dc2626", logoUrl: "/Kanaly/HGTV_HD_logo.webp" },
  { number: 35, name: "ANIMAL PLANET HD", tier: "m", color: "#334155" },
  { number: 37, name: "TRAVEL CHANNEL HD", tier: "m", color: "#0d9488", logoUrl: "/Kanaly/Travel_Channel_HD_logo.webp" },
  { number: 45, name: "DISCOVERY CHANNEL HD", tier: "m", guaranteed: true, color: "#0ea5e9", logoUrl: "/Kanaly/Discovery_Channel_HD_logo.webp" },
  { number: 50, name: "DISCOVERY SCIENCE HD", tier: "m", color: "#db2777", logoUrl: "/Kanaly/Discovery_Science_HD_logo.webp" },
  { number: 53, name: "DISCOVERY HISTORIA", tier: "m", color: "#be123c", logoUrl: "/Kanaly/Discovery_Historia_logo.webp" },
  { number: 62, name: "EUROSPORT HD", tier: "m", guaranteed: true, color: "#c026d3", logoUrl: "/Kanaly/Eurosport_1_HD_logo.webp" },
  { number: 63, name: "EUROSPORT 2 HD", tier: "m", color: "#2563eb", logoUrl: "/Kanaly/Eurosport_2_HD_logo.webp" },
  { number: 74, name: "DTX HD", tier: "m", color: "#facc15", logoUrl: "/Kanaly/DTX_HD_logo.webp" },
  { number: 90, name: "TVP HD", tier: "m", color: "#b91c1c", logoUrl: "/Kanaly/TVP_HD_logo.webp" },
  { number: 91, name: "TLC HD", tier: "m", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/TLC_HD_logo.webp" },
  { number: 92, name: "ID HD", tier: "m", guaranteed: true, color: "#1d4ed8", logoUrl: "/Kanaly/ID_HD_logo.webp" },
  { number: 93, name: "DISCOVERY LIFE HD", tier: "m", color: "#1d4ed8", logoUrl: "/Kanaly/Discovery_Life_HD_logo.webp" },
  { number: 98, name: "FOOD NETWORK HD", tier: "m", guaranteed: true, color: "#7c3aed", logoUrl: "/Kanaly/Food_Network_logo.webp" },
  { number: 103, name: "CARTOONITO HD", tier: "m", color: "#111827", logoUrl: "/Kanaly/Cartoonito_HD_logo.webp" },
  { number: 112, name: "CARTOON NETWORK HD", tier: "m", color: "#111827", logoUrl: "/Kanaly/Cartoon_Network_HD_logo.webp" },
  { number: 121, name: "TVP SERIALE", tier: "m", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/TVP_Seriale_logo.webp" },
  { number: 130, name: "TVN FABUŁA HD", tier: "m", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/Fabula_HD_logo.webp" },
  { number: 143, name: "WARNER TV HD", tier: "m", color: "#facc15", logoUrl: "/Kanaly/Warner_TV_HD_logo.webp" },
  { number: 187, name: "TV REPUBLIKA", tier: "m", color: "#4338ca", logoUrl: "/Kanaly/Republika_logo.webp" },
  { number: 192, name: "WPOLSCE24", tier: "m", color: "#0891b2", logoUrl: "/Kanaly/WPolsce24_logo.webp" },
  { number: 25, name: "HOME TV HD", tier: "l", color: "#0d9488", logoUrl: "/Kanaly/Home_TV_logo.webp" },
  { number: 36, name: "NAT GEO WILD HD", tier: "l", color: "#4c1d95", logoUrl: "/Kanaly/National_Geographic_Wild_HD_logo.webp" },
  { number: 39, name: "DA VINCI LEARNING", tier: "l", color: "#1e293b", logoUrl: "/Kanaly/Da_Vinci_logo.webp" },
  { number: 43, name: "WATER PLANET HD", tier: "l", color: "#0891b2", logoUrl: "/Kanaly/Water_Planet_HD_logo.webp" },
  { number: 46, name: "NATIONAL GEOGRAPHIC HD", tier: "l", color: "#db2777" },
  { number: 47, name: "PLANETE+ HD", tier: "l", color: "#4c1d95" },
  { number: 48, name: "BBC FIRST HD", tier: "l", color: "#c026d3", logoUrl: "/Kanaly/BBC_First_logo.webp" },
  { number: 49, name: "BBC EARTH HD", tier: "l", color: "#e11d48", logoUrl: "/Kanaly/BBC_Earth_HD_logo.webp" },
  { number: 51, name: "HISTORY HD", tier: "l", guaranteed: true, color: "#9333ea", logoUrl: "/Kanaly/History_HD_logo.webp" },
  { number: 55, name: "HISTORY2 HD", tier: "l", guaranteed: true, color: "#9333ea", logoUrl: "/Kanaly/History_2_HD_logo.webp" },
  { number: 56, name: "BBC BRIT HD", tier: "l", color: "#059669", logoUrl: "/Kanaly/BBC_Brit_HD_logo.webp" },
  { number: 70, name: "MOTOWIZJA HD", tier: "l", color: "#0ea5e9", logoUrl: "/Kanaly/Motowizja_HD_logo.webp" },
  { number: 77, name: "EXTREME SPORTS CHANNEL HD", tier: "l", color: "#c026d3" },
  { number: 79, name: "GOLF ZONE HD", tier: "l", color: "#1e293b", logoUrl: "/Kanaly/GolfZone_HD_logo.webp" },
  { number: 82, name: "ACTIVE FAMILY HD", tier: "l", color: "#4338ca", logoUrl: "/Kanaly/Active_Family_HD_logo.webp" },
  { number: 85, name: "E! ENTERTAINMENT HD", tier: "l", color: "#0d9488", logoUrl: "/Kanaly/Entertainment_HD_logo.webp" },
  { number: 87, name: "CANAL+ DOMO HD", tier: "l", color: "#f59e0b", logoUrl: "/Kanaly/Canal_Domo_HD_logo.webp" },
  { number: 88, name: "CANAL+ KUCHNIA HD", tier: "l", color: "#1d4ed8", logoUrl: "/Kanaly/Canal_Kuchnia_HD_logo.webp" },
  { number: 89, name: "BBC LIFESTYLE HD", tier: "l", color: "#111827", logoUrl: "/Kanaly/BBC_Lifestyle_HD_logo.webp" },
  { number: 95, name: "NAT GEO PEOPLE HD", tier: "l", color: "#dc2626", logoUrl: "/Kanaly/NatGeo_People_HD_logo.webp" },
  { number: 99, name: "MINIMINI+ HD", tier: "l", color: "#111827", logoUrl: "/Kanaly/Minimini__HD_logo.webp" },
  { number: 101, name: "BBC CBEEBIES", tier: "l", color: "#0891b2", logoUrl: "/Kanaly/BBC_Cbeebies_logo.webp" },
  { number: 102, name: "NICK JR.", tier: "l", guaranteed: true, color: "#2563eb", logoUrl: "/Kanaly/Nick_Junior_logo.webp" },
  { number: 106, name: "DISNEY JUNIOR", tier: "l", color: "#1d4ed8", logoUrl: "/Kanaly/Disney_Junior_logo.webp" },
  { number: 110, name: "DISNEY CHANNEL HD", tier: "l", color: "#65a30d", logoUrl: "/Kanaly/Disney_Channel_HD_logo.webp" },
  { number: 111, name: "DISNEY XD", tier: "l", color: "#4338ca", logoUrl: "/Kanaly/Disney_XD_logo.webp" },
  { number: 113, name: "NICKTOONS HD", tier: "l", guaranteed: true, color: "#0891b2", logoUrl: "/Kanaly/Nicktoons_HD_logo.webp" },
  { number: 114, name: "NICKELODEON POLSKA", tier: "l", guaranteed: true, color: "#f59e0b", logoUrl: "/Kanaly/Nickelodeon_logo.webp" },
  { number: 116, name: "TELETOON+ HD", tier: "l", color: "#059669", logoUrl: "/Kanaly/Teletoon__HD_logo.webp" },
  { number: 117, name: "TEENNICK HD", tier: "l", color: "#334155", logoUrl: "/Kanaly/TeenNick_HD_logo.webp" },
  { number: 118, name: "RED CARPET TV HD", tier: "l", color: "#c026d3",logoUrl:"/Kanaly/Red_Carpet_HD_logo.webp" },
  { number: 119, name: "NOVELA TV HD", tier: "l", color: "#2563eb", logoUrl: "/Kanaly/Novela_TV_HD_logo.webp" },
  { number: 122, name: "AXN HD", tier: "l", guaranteed: true, color: "#16a34a", logoUrl: "/Kanaly/AXN_HD_logo.webp" },
  { number: 123, name: "AXN SPIN HD", tier: "l", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/AXN_Spin_HD_logo.webp" },
  { number: 124, name: "AXN BLACK", tier: "l", guaranteed: true, color: "#facc15", logoUrl: "/Kanaly/AXN_Black_logo.webp" },
  { number: 125, name: "AXN WHITE", tier: "l", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/AXN_White_logo.webp" },
  { number: 126, name: "COMEDY CENTRAL HD", tier: "l", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/Comedy_Central_HD_logo.webp" },
  { number: 128, name: "FX HD", tier: "l", color: "#0ea5e9", logoUrl: "/Kanaly/FX_HD_logo.webp" },
  { number: 129, name: "FX COMEDY HD", tier: "l", color: "#4c1d95", logoUrl: "/Kanaly/FX_Comedy_HD_logo.webp" },
  { number: 131, name: "13 ULICA HD", tier: "l", color: "#c026d3", logoUrl: "/Kanaly/13_Ulica_HD_logo.webp" },
  { number: 132, name: "SCI FI", tier: "l", color: "#4338ca", logoUrl: "/Kanaly/SCI_FI_HD_logo.webp" },
  { number: 133, name: "EPIC DRAMA HD", tier: "l", color: "#1d4ed8", logoUrl: "/Kanaly/Epic_Drama_HD_logo.webp" },
  { number: 134, name: "AMC HD", tier: "l", color: "#db2777", logoUrl: "/Kanaly/AMC_HD_logo.webp" },
  { number: 136, name: "ROMANCE TV HD", tier: "l", color: "#1e293b", logoUrl: "/Kanaly/Romance_TV_HD_logo.webp" },
  { number: 137, name: "NOVELAS+ HD", tier: "l", color: "#f59e0b", logoUrl: "/Kanaly/Novelas__HD_logo.webp" },
  { number: 140, name: "KINO POLSKA HD", tier: "l", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Kino_Polska_HD_logo.webp" },
  { number: 142, name: "ALE KINO+ HD", tier: "l", color: "#facc15", logoUrl: "/Kanaly/Ale_Kino__logo.webp" },
  { number: 144, name: "SUNDANCE CHANNEL HD", tier: "l", color: "#2563eb", logoUrl: "/Kanaly/Sundance_Channel_HD_logo.webp" },
  { number: 150, name: "PARAMOUNT NETWORK POLSKA HD", tier: "l", guaranteed: true, color: "#0891b2", logoUrl: "/Kanaly/Paramount_Channel_HD_logo.webp" },
  { number: 168, name: "KINO TV HD", tier: "l", guaranteed: true, color: "#1e293b" },
  { number: 188, name: "BBC WORLD NEWS", tier: "l", color: "#b91c1c", logoUrl: "/Kanaly/BBC_News_logo.webp" },
  { number: 189, name: "SKY NEWS", tier: "l", color: "#0d9488", logoUrl: "/Kanaly/Sky_News_logo.webp" },
  { number: 190, name: "EURONEWS HD", tier: "l", color: "#7c3aed", logoUrl: "/Kanaly/Euronews_HD_logo.webp" },
  { number: 191, name: "CNN HD", tier: "l", color: "#c026d3", logoUrl: "/Kanaly/CNN_HD_logo.webp" },
  { number: 193, name: "FRANCE 24 ANG", tier: "l", color: "#4c1d95", logoUrl: "/Kanaly/France_24__Eng__logo.webp" },
  { number: 194, name: "FRANCE 24 FRA", tier: "l", color: "#be123c", logoUrl: "/Kanaly/France_24__Fra__logo.webp" },
  { number: 195, name: "DW-TV", tier: "l", color: "#c026d3" },
  { number: 198, name: "AL JAZEERA HD", tier: "l", color: "#9333ea", logoUrl: "/Kanaly/Al_Jazeera_HD_logo.webp" },
  { number: 199, name: "EURONEWS RUS", tier: "l", color: "#be123c", logoUrl: "/Kanaly/Euronews_Rus_logo.webp" },
  { number: 205, name: "ENGLISH CLUB TV HD", tier: "l", color: "#b91c1c", logoUrl: "/Kanaly/English_Club_TV_HD_logo.webp" },
  { number: 207, name: "RTL", tier: "l", color: "#111827", logoUrl: "/Kanaly/RTL_logo.webp" },
  { number: 208, name: "RTL 2", tier: "l", color: "#a16207", logoUrl: "/Kanaly/RTL_2_logo.webp" },
  { number: 209, name: "VOX", tier: "l", color: "#16a34a", logoUrl: "/Kanaly/Vox_logo.webp" },
  { number: 210, name: "SUPER RTL", tier: "l", color: "#4338ca", logoUrl: "/Kanaly/Super_RTL_logo.webp" },
  { number: 211, name: "ARTE HD", tier: "l", color: "#b91c1c", logoUrl: "/Kanaly/Arte_HD_logo.webp" },
  { number: 212, name: "TV5MONDE", tier: "l", color: "#65a30d", logoUrl: "/Kanaly/TV5Monde_Europe_logo.webp" },
  { number: 230, name: "MTV POLSKA HD", tier: "l", guaranteed: true, color: "#9333ea", logoUrl: "/Kanaly/MTV_HD_logo.webp" },
  { number: 240, name: "KINO POLSKA MUZYKA", tier: "l", color: "#059669", logoUrl: "/Kanaly/Kino_Polska_Muzyka_logo.webp" },
];

// Kanały dodatków premium (dostępne WYŁĄCZNIE po dokupieniu danego dodatku,
// niezależnie od wybranego pakietu głównego XS/S/M/L).
// Uwaga: Canal+ Select i Canal+ Prestige współdzielą te same fizyczne numery
// kanałów (158-166) - Prestige dodaje do tego 162 (Seriale) i 167 (Dokument).
export const ADDON_CHANNELS: Channel[] = [
  // Canal+ Select (+35 zł) — 8 kanałów wg ulotki
  { number: 158, name: "CANAL+ SPORT 3 HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_3_HD_logo.webp" },
  { number: 159, name: "CANAL+ SPORT 4 HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_4_HD_logo.webp" },
  { number: 160, name: "CANAL+ PREMIUM HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Premium_HD_logo.webp" },
  { number: 161, name: "CANAL+ FILM HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Film_HD_logo.webp" },
  { number: 163, name: "CANAL+ 360 HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827" },
  { number: 164, name: "CANAL+ 1 HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_1_HD_logo.webp" },
  { number: 165, name: "CANAL+ SPORT HD", tier: "l", addon: "canal-plus-select", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_HD_logo.webp" },
  { number: 166, name: "CANAL+ SPORT 2 HD", tier: "l", addon: "canal-plus-select", color: "#111827", logoUrl: "/Kanaly/Canal_Sport_2_HD_logo.webp" },

  // Canal+ Prestige (+50 zł) — zawiera wszystko z Select oraz Seriale i Dokument (10 kanałów łącznie)
  { number: 158, name: "CANAL+ SPORT 3 HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_3_HD_logo.webp" },
  { number: 159, name: "CANAL+ SPORT 4 HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_4_HD_logo.webp" },
  { number: 160, name: "CANAL+ PREMIUM HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Premium_HD_logo.webp" },
  { number: 161, name: "CANAL+ FILM HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Film_HD_logo.webp" },
  { number: 162, name: "CANAL+ SERIALE HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Seriale_HD_logo.webp" },
  { number: 163, name: "CANAL+ 360 HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827"},
  { number: 164, name: "CANAL+ 1 HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_1_HD_logo.webp" },
  { number: 165, name: "CANAL+ SPORT HD", tier: "l", addon: "canal-plus-prestige", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/Canal_Sport_HD_logo.webp" },
  { number: 166, name: "CANAL+ SPORT 2 HD", tier: "l", addon: "canal-plus-prestige", color: "#111827", logoUrl: "/Kanaly/Canal_Sport_2_HD_logo.webp" },
  { number: 167, name: "CANAL+ DOKUMENT HD", tier: "l", addon: "canal-plus-prestige", color: "#111827", logoUrl: "/Kanaly/Canal_Dokument_HD_logo.webp" },

  // FilmBox+ (+10 zł) — 5 kanałów wg ulotki
  { number: 169, name: "FILMBOX PREMIUM HD", tier: "l", addon: "filmbox", guaranteed: true, color: "#9333ea", logoUrl: "/Kanaly/Filmbox_Premium_HD_logo.webp" },
  { number: 170, name: "FILMBOX EXTRA HD", tier: "l", addon: "filmbox", guaranteed: true, color: "#ea580c", logoUrl: "/Kanaly/Filmbox_Extra_HD_logo.webp" },
  { number: 172, name: "FILMBOX ACTION", tier: "l", addon: "filmbox", guaranteed: true, color: "#dc2626", logoUrl: "/Kanaly/Filmbox_Action_logo.webp" },
  { number: 175, name: "FILMBOX FAMILY", tier: "l", addon: "filmbox", guaranteed: true, color: "#1d4ed8", logoUrl: "/Kanaly/Filmbox_Family_logo.webp" },
  { number: 176, name: "FILMBOX ARTHOUSE HD", tier: "l", addon: "filmbox", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/Filmbox_Arthouse_HD_logo.webp"},

  // Dla Dorosłych (+10 zł) — 8 kanałów
  { number: 310, name: "DORCEL TV HD", tier: "l", addon: "dorosli", color: "#334155", logoUrl: "/Kanaly/Dorcel_TV_HD_logo.webp" },
  { number: 311, name: "BLUE HUSTLER", tier: "l", addon: "dorosli", color: "#7c3aed", logoUrl: "/Kanaly/Blue_Hustler_logo.webp" },
  { number: 312, name: "HUSTLER HD", tier: "l", addon: "dorosli", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/Hustler_HD_logo.webp" },
  { number: 313, name: "PRIVATE TV HD", tier: "l", addon: "dorosli", guaranteed: true, color: "#1d4ed8", logoUrl: "/Kanaly/Private_TV_HD_logo.webp" },
  { number: 314, name: "VIVID RED HD", tier: "l", addon: "dorosli", color: "#9333ea", logoUrl: "/Kanaly/Vivid_Red_HD_logo.webp" },
  { number: 315, name: "VIVID TOUCH", tier: "l", addon: "dorosli", color: "#0ea5e9", logoUrl: "/Kanaly/Vivid_Touch_logo.webp" },
  { number: 316, name: "BRAZZERS TV HD", tier: "l", addon: "dorosli", color: "#f59e0b", logoUrl: "/Kanaly/Brazzers_TV_HD_logo.webp" },
  { number: 317, name: "REDLIGHT TV HD", tier: "l", addon: "dorosli", color: "#65a30d", logoUrl: "/Kanaly/Redlight_HD_logo.webp" },

  // Eleven Sports (+10 zł) — 5 kanałów
  { number: 58, name: "ELEVEN SPORTS 1 4K", tier: "l", addon: "eleven-sports", guaranteed: true, only4k: true, color: "#dc2626", logoUrl: "/Kanaly/Eleven_Sports_4K_logo.webp" },
  { number: 64, name: "ELEVEN SPORTS 1 HD", tier: "l", addon: "eleven-sports", guaranteed: true, color: "#4338ca", logoUrl: "/Kanaly/Eleven_Sports_1_HD_logo.webp" },
  { number: 65, name: "ELEVEN SPORTS 2 HD", tier: "l", addon: "eleven-sports", guaranteed: true, color: "#a16207", logoUrl: "/Kanaly/Eleven_Sports_2_HD_logo.webp" },
  { number: 66, name: "ELEVEN SPORTS 3 HD", tier: "l", addon: "eleven-sports", guaranteed: true, color: "#e11d48", logoUrl: "/Kanaly/Eleven_Sports_3_HD_logo.webp" },
  { number: 67, name: "ELEVEN SPORTS 4 HD", tier: "l", addon: "eleven-sports", guaranteed: true, color: "#f59e0b", logoUrl: "/Kanaly/Eleven_Sports_4_HD_logo.webp" },

  // Polsat Sport Premium (+20 zł) — 6 kanałów
  { number: 300, name: "POLSAT SPORT PREMIUM 1 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#dc2626", logoUrl: "/Kanaly/Polsat_Sport_Premium_1_HD_logo.webp" },
  { number: 301, name: "POLSAT SPORT PREMIUM 2 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#4c1d95", logoUrl: "/Kanaly/Polsat_Sport_Premium_2_HD_logo.webp" },
  { number: 302, name: "POLSAT SPORT EXTRA 1 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#0ea5e9", logoUrl: "/Kanaly/Polsat_Sport_Premium_3_PPV_HD_logo.webp" },
  { number: 303, name: "POLSAT SPORT EXTRA 2 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#db2777", logoUrl: "/Kanaly/Polsat_Sport_Premium_4_PPV_HD_logo.webp" },
  { number: 304, name: "POLSAT SPORT EXTRA 3 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#ea580c", logoUrl: "/Kanaly/Polsat_Sport_Premium_5_PPV_HD_logo.webp" },
  { number: 305, name: "POLSAT SPORT EXTRA 4 HD", tier: "l", addon: "polsat-sport-premium", guaranteed: true, color: "#059669", logoUrl: "/Kanaly/Polsat_Sport_Premium_6_PPV_HD_logo.webp" },

  // Ukraina (+10 zł) — 8 kanałów
  { number: 400, name: "STAR CINEMA", tier: "l", addon: "ukraina", guaranteed: true, color: "#e11d48", logoUrl: "/Kanaly/Star_Cinema_logo.webp" },
  { number: 401, name: "STAR FAMILY", tier: "l", addon: "ukraina", guaranteed: true, color: "#0d9488", logoUrl: "/Kanaly/Star_Family_logo.webp" },
  { number: 402, name: "X SPORT", tier: "l", addon: "ukraina", guaranteed: true, color: "#111827", logoUrl: "/Kanaly/X_Sport_logo.webp" },
  { number: 403, name: "FILM UA DRAMA", tier: "l", addon: "ukraina", color: "#111827", logoUrl: "/Kanaly/Film_UA_Drama_logo.webp" },
  { number: 404, name: "DACHA TV", tier: "l", addon: "ukraina", color: "#be123c", logoUrl: "/Kanaly/Dacha_TV_logo.webp" },
  { number: 405, name: "KUS KUS", tier: "l", addon: "ukraina", color: "#0891b2", logoUrl: "/Kanaly/Kus_Kus_logo.webp" },
  { number: 406, name: "KVARTAL TV INTERNATIONAL", tier: "l", addon: "ukraina", color: "#f59e0b", logoUrl: "/Kanaly/Kvartal_TV_logo.webp" },
  { number: 407, name: "1+1 INTERNATIONAL", tier: "l", addon: "ukraina", color: "#ea580c", logoUrl: "/Kanaly/1_1_International_logo.webp" },

  // Cinemax (+10 zł) — 2 kanały (promocyjnie w Pakietach M 4K i L 4K przez 24 okresy rozliczeniowe)
  { number: 145, name: "CINEMAX HD", tier: "l", addon: "cinemax-hd", guaranteed: true, color: "#be123c", logoUrl: "/Kanaly/Cinemax_HD_logo.webp" },
  { number: 146, name: "CINEMAX 2 HD", tier: "l", addon: "cinemax-hd", guaranteed: true, color: "#0d9488", logoUrl: "/Kanaly/Cinemax_2_HD_logo.webp" },

  // HBO HD (+25 zł) — 3 kanały
  { number: 155, name: "HBO HD", tier: "l", addon: "hbo", guaranteed: true, color: "#be123c", logoUrl: "/Kanaly/HBO_HD_logo.webp" },
  { number: 156, name: "HBO 2 HD", tier: "l", addon: "hbo", guaranteed: true, color: "#0d9488", logoUrl: "/Kanaly/HBO_2_HD_logo.webp" },
  { number: 157, name: "HBO 3 HD", tier: "l", addon: "hbo", guaranteed: true, color: "#b91c1c", logoUrl: "/Kanaly/HBO_3_HD_logo.webp" },

  // Pakiet dla Dzieci (10 zł/mies.) — 13 kanałów. To te same fizyczne kanały,
  // które są już częścią pakietu bazowego L (a Cartoonito/Cartoon Network - M),
  // dodatek pozwala je dokupić przy niższym pakiecie głównym.
  { number: 101, name: "BBC CBEEBIES", tier: "l", addon: "dzieci", color: "#0891b2", logoUrl: "/Kanaly/BBC_Cbeebies_logo.webp" },
  { number: 112, name: "CARTOON NETWORK HD", tier: "l", addon: "dzieci", color: "#111827", logoUrl: "/Kanaly/Cartoon_Network_HD_logo.webp" },
  { number: 103, name: "CARTOONITO HD", tier: "l", addon: "dzieci", color: "#111827", logoUrl: "/Kanaly/Cartoonito_HD_logo.webp" },
  { number: 39, name: "DA VINCI LEARNING", tier: "l", addon: "dzieci", color: "#1e293b", logoUrl: "/Kanaly/Da_Vinci_logo.webp" },
  { number: 110, name: "DISNEY CHANNEL HD", tier: "l", addon: "dzieci", color: "#65a30d", logoUrl: "/Kanaly/Disney_Channel_HD_logo.webp" },
  { number: 106, name: "DISNEY JUNIOR", tier: "l", addon: "dzieci", color: "#1d4ed8", logoUrl: "/Kanaly/Disney_Junior_logo.webp" },
  { number: 111, name: "DISNEY XD", tier: "l", addon: "dzieci", color: "#4338ca", logoUrl: "/Kanaly/Disney_XD_logo.webp" },
  { number: 99, name: "MINIMINI+ HD", tier: "l", addon: "dzieci", color: "#111827", logoUrl: "/Kanaly/Minimini__HD_logo.webp" },
  { number: 102, name: "NICK JR.", tier: "l", addon: "dzieci", guaranteed: true, color: "#2563eb", logoUrl: "/Kanaly/Nick_Junior_logo.webp" },
  { number: 114, name: "NICKELODEON POLSKA", tier: "l", addon: "dzieci", guaranteed: true, color: "#f59e0b", logoUrl: "/Kanaly/Nickelodeon_logo.webp" },
  { number: 113, name: "NICKTOONS HD", tier: "l", addon: "dzieci", guaranteed: true, color: "#0891b2", logoUrl: "/Kanaly/Nicktoons_HD_logo.webp" },
  { number: 117, name: "TEENNICK HD", tier: "l", addon: "dzieci", color: "#334155", logoUrl: "/Kanaly/TeenNick_HD_logo.webp" },
  { number: 116, name: "TELETOON+ HD", tier: "l", addon: "dzieci", color: "#059669", logoUrl: "/Kanaly/Teletoon__HD_logo.webp" },
];

export function isValidTier(value: string): value is Tier {
  return value === "xs" || value === "s" || value === "m" || value === "l";
}

// Kanały dostępne w danym pakiecie głównym (skumulowane, bez dodatków)
export function channelsForTier(tier: Tier): Channel[] {
  return CHANNELS.filter((ch) => TIER_ORDER[ch.tier] <= TIER_ORDER[tier]).sort(
    (a, b) => a.number - b.number
  );
}

// Kanały danego dodatku premium
export function channelsForAddon(addonKey: string): Channel[] {
  return ADDON_CHANNELS.filter((ch) => ch.addon === addonKey).sort((a, b) => a.number - b.number);
}