// components/Kanaly/KanalyView.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Tier } from "@/lib/channels";
import Przewodnik from "./Przewodnik";
import Wyszukiwarka from "./Wyszukiwarka";

export default function KanalyView({ initialTier }: { initialTier: Tier }) {
  const [tier, setTier] = useState<Tier>(initialTier);
  const router = useRouter();

  // Kluczowe: gdy initialTier się zmieni (np. kliknięcie w headerze),
  // zsynchronizuj lokalny stan z nową wartością z URL.
  useEffect(() => {
    setTier(initialTier);
  }, [initialTier]);

  const handleTierChange = useCallback(
    (next: Tier) => {
      setTier(next);
      router.replace(`/kanaly?tier=${next}`, { scroll: false });
    },
    [router]
  );

  return (
    <>
      <Przewodnik tier={tier} onTierChange={handleTierChange} />
      <Wyszukiwarka tier={tier} onTierChange={handleTierChange} />
    </>
  );
}