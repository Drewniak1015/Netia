// app/kanaly/page.tsx
import { isValidTier, type Tier } from "@/lib/channels";
import KanalyView from "@/components/Kanaly/KanalyView";
import Faq from "@/components/Kanaly/Faq";

type Props = {
  searchParams: Promise<{ tier?: string }>;
};
import { pagesMetadata } from "@/lib/seo/pages-metadata";

export const metadata = pagesMetadata.kanaly;
export default async function Page({ searchParams }: Props) {
  const { tier: rawTier } = await searchParams;
  const initialTier: Tier = isValidTier(rawTier ?? "") ? (rawTier as Tier) : "s";

  return (
    <main>
      <KanalyView initialTier={initialTier} />
      <Faq/>
    </main>
  );
}