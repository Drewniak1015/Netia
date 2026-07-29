/**
 * Wspólny helper do trackowania kontaktu (Meta Pixel "Contact") oraz do
 * budowania czytelnych `content_name`. Wcześniej ta sama logika była
 * skopiowana osobno w Oferty.tsx, NetiaSocialProof.tsx i Hero.tsx —
 * teraz jest w jednym miejscu, więc każda poprawka (np. dodanie innego
 * eventu trackingowego) trafia wszędzie naraz.
 */

export function trackContact(contentName: string) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Contact", { content_name: contentName });
  }
}

/**
 * Buduje slug z dowolnego tekstu (obsługuje polskie znaki), np.
 * "1000 Mb/s" + "TV S" -> po połączeniu "1000_mb_s_tv_s".
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź|ż/g, "z")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}