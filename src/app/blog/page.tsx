import type { Metadata } from "next";
import { POSTS } from "@/app/content/blog/posts";
import { isValidCategory, CATEGORIES, type CategorySlug } from "@/lib/blog/categories";
import { normalizujTekst, parsujTagiZUrl, POSTS_PER_PAGE } from "@/app/blog/Bloghelpers";
import { budujIdSegment } from "@/app/blog/url";
import BlogContent from "@/app/blog/Blogcontent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function jedenParam(
  sp: { [key: string]: string | string[] | undefined },
  klucz: string
): string | null {
  const wartosc = sp[klucz];
  if (Array.isArray(wartosc)) return wartosc[0] ?? null;
  return wartosc ?? null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const kategoriaParam = jedenParam(sp, "kategoria");
  const activeCategory: CategorySlug | null =
    kategoriaParam && isValidCategory(kategoriaParam) ? kategoriaParam : null;

  if (activeCategory) {
    const kategoria = CATEGORIES[activeCategory];
    return {
      title: `${kategoria.label} – Blog Netia`,
      description: `Artykuły z kategorii „${kategoria.label}” na blogu Netii. Praktyczne poradniki i wskazówki o internecie, TV i technologii.`,
      alternates: { canonical: `/blog?kategoria=${activeCategory}` },
    };
  }

  return {
    title: "Blog Netia – Poradniki o Internecie, TV i Technologii",
    description:
      "Praktyczne poradniki: jak wybrać prędkość internetu, internet dla graczy, konfiguracja Wi-Fi i więcej. Sprawdź najnowsze artykuły Netii.",
    alternates: { canonical: "/blog" },
  };
}

function buildBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Netia",
    url: "https://netia.vercel.app/blog",
    blogPost: POSTS.map(({ meta }) => ({
      "@type": "BlogPosting",
      headline: meta.title,
      description: meta.excerpt,
      image: meta.coverImage,
      datePublished: meta.date,
      author: meta.author ? { "@type": "Person", name: meta.author } : undefined,
      url: `https://netia.vercel.app/blog/${budujIdSegment(meta.id, meta.slug)}`,
    })),
  };
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Moja Netia", item: "https://netia.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://netia.vercel.app/blog" },
  ],
};

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const kategoriaParam = jedenParam(sp, "kategoria");
  const activeCategory: CategorySlug | null =
    kategoriaParam && isValidCategory(kategoriaParam) ? kategoriaParam : null;
  const szukaj = jedenParam(sp, "szukaj") ?? "";
  const activeTags = parsujTagiZUrl(jedenParam(sp, "tagi"));

  const postyKategoria = activeCategory
    ? POSTS.filter((p) => p.meta.category === activeCategory)
    : POSTS;

  const dostepneTagiSet = new Set<string>();
  postyKategoria.forEach((p) => p.meta.tags.forEach((t) => dostepneTagiSet.add(t)));
  const dostepneTagi = Array.from(dostepneTagiSet).sort((a, b) => a.localeCompare(b, "pl"));

  const postyPoTagach =
    activeTags.length > 0
      ? postyKategoria.filter((p) => p.meta.tags.some((t) => activeTags.includes(t)))
      : postyKategoria;

  const fraza = normalizujTekst(szukaj.trim());
  const postyPrzefiltrowane = fraza
    ? postyPoTagach.filter(({ meta }) =>
        normalizujTekst([meta.title, meta.excerpt, ...meta.tags].join(" ")).includes(fraza)
      )
    : postyPoTagach;

  const postySortowane = [...postyPrzefiltrowane].sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

  const liczbaStron = Math.max(1, Math.ceil(postySortowane.length / POSTS_PER_PAGE));
  const stronaParam = Number(jedenParam(sp, "strona"));
  const strona =
    Number.isFinite(stronaParam) && stronaParam >= 1
      ? Math.min(Math.floor(stronaParam), liczbaStron)
      : 1;

  const start = (strona - 1) * POSTS_PER_PAGE;
  const postyNaStronie = postySortowane.slice(start, start + POSTS_PER_PAGE).map((p) => p.meta);

  const blogSchema = buildBlogSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogContent
        activeCategory={activeCategory}
        szukaj={szukaj}
        activeTags={activeTags}
        dostepneTagi={dostepneTagi}
        postyPoTagachMeta={postyPoTagach.map((p) => p.meta)}
        postyNaStronie={postyNaStronie}
        strona={strona}
        liczbaStron={liczbaStron}
      />
    </>
  );
}