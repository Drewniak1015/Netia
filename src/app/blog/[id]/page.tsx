import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Calendar, Clock, Tag, Home, ImageOff } from "lucide-react";
import { CATEGORIES } from "@/lib/blog/categories";
import { POSTS } from "@/app/content/blog/posts";
import { budujIdSegment } from "@/app/blog/url";

// TODO: podmień, jeśli adres strony głównej "Moja Netia" różni się od "/".
const MOJA_NETIA_HOME = "/";

function formatujDate(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

// Dopasowanie po numerze posta wyciągniętym z przodu segmentu URL, np.
// "1-jak-bezpiecznie-korzystac-z-internetu-w-domu" -> 1 -> posts/1.tsx.
// Dzięki temu URL wygląda ładnie (zawiera tytuł), a i tak realnie
// mapujemy się po prostym numerze pliku, a nie po dokładnym dopasowaniu tekstu.
function znajdzPost(idSegment: string) {
  const numerStr = idSegment.split("-")[0];
  const numer = Number(numerStr);
  if (Number.isNaN(numer)) return null;
  return POSTS.find((p) => p.meta.id === numer) ?? null;
}

// Generuje statyczne strony /blog/1-tytul-posta, /blog/2-inny-tytul, ...
export function generateStaticParams() {
  return POSTS.map((p) => ({ id: budujIdSegment(p.meta.id, p.meta.slug) }));
}

// Tytuł karty w Google/social previews — czytany z meta danego posta.
export async function generateMetadata({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const wpis = znajdzPost(id);
  if (!wpis) return {};
  return {
    title: wpis.meta.title,
    description: wpis.meta.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wpis = znajdzPost(id);

  // Brak posta o takim numerze w rejestrze -> prawdziwa strona 404 Next.js.
  if (!wpis) notFound();

  // Jeśli ktoś wszedł na "goły" numer (np. /blog/1 zamiast /blog/1-tytul-posta),
  // przekieruj na kanoniczny, ładny adres z tytułem w URL.
  const kanonicznyId = budujIdSegment(wpis.meta.id, wpis.meta.slug);
  if (id !== kanonicznyId) {
    permanentRedirect(`/blog/${kanonicznyId}`);
  }

  const { meta, Content } = wpis;
  const kategoria = CATEGORIES[meta.category];
  const Ikona = kategoria.icon;

  return (
    <section style={{ backgroundColor: "#0B2A3D" }} className="min-h-screen py-16 font-sans">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-20">
        {/* Breadcrumb — Moja Netia / Blog / Kategoria */}
        <nav aria-label="Ścieżka nawigacji" className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link
            href={MOJA_NETIA_HOME}
            className="inline-flex items-center gap-1.5 text-white/50 transition-colors hover:text-white/80"
          >
            <Home size={14} />
            Moja Netia
          </Link>
          <ChevronRight size={14} className="text-white/25" />
          <Link href="/blog" className="text-white/50 transition-colors hover:text-white/80">
            Blog
          </Link>
          <ChevronRight size={14} className="text-white/25" />
          <Link
            href={`/blog?kategoria=${meta.category}`}
            className="text-white/50 transition-colors hover:text-white/80"
          >
            {kategoria.label}
          </Link>
        </nav>

        {/* Nagłówek posta */}
        <div className="mt-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[11px] font-semibold text-teal-300">
            <Ikona size={12} />
            {kategoria.label}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {meta.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              {formatujDate(meta.date)}
            </span>
            {meta.readingMinutes && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} />
                {meta.readingMinutes} min czytania
              </span>
            )}
            {meta.author && <span>Autor: {meta.author}</span>}
          </div>
        </div>

        {/* Okładka — placeholder, gdy brak coverImage */}
        <div className="mt-6 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-72">
          {meta.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={meta.coverImage} alt={meta.title} className="h-full w-full object-cover" />
          ) : (
            <ImageOff size={36} className="text-white/20" />
          )}
        </div>

        {/* Treść artykułu — surowe h2/p/ul z posta, ostylowane tu selektorami
            potomnymi, żeby każdy nowy post (np. 2.tsx) nie musiał ręcznie
            dodawać klas Tailwind do każdego akapitu/nagłówka. */}
        <div
          className="
            mt-8
            [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-white
            [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-teal-300
            [&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-white/70
            [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
            [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5
            [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-white/70
            [&_strong]:font-semibold [&_strong]:text-white
            [&_a]:text-teal-300 [&_a]:underline [&_a]:decoration-teal-300/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-teal-300
            [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-teal-200
          "
        >
          <Content />
        </div>

        {/* Tagi */}
        {meta.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-1.5 border-t border-white/10 pt-6">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Powrót do listy */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-300 hover:text-teal-200"
          >
            ← Wróć do wszystkich artykułów
          </Link>
        </div>
      </div>
    </section>
  );
}