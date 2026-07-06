// app/kanaly/page.tsx
import { isValidTier, type Tier } from "@/lib/channels";
import KanalyView from "@/components/Kanaly/KanalyView";

type Props = {
  searchParams: Promise<{ tier?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { tier: rawTier } = await searchParams;
  const initialTier: Tier = isValidTier(rawTier ?? "") ? (rawTier as Tier) : "s";

  return (
    <main>
      <KanalyView initialTier={initialTier} />
    </main>
  );
}