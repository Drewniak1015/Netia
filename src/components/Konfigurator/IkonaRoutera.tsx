import { memo } from "react";
import { Wifi } from "lucide-react";

/* Ikona zastępcza dla zdjęcia routera (dopóki brak realnego zdjęcia) */
const IkonaRoutera = memo(function IkonaRoutera({
  zdjecie,
  model,
}: {
  zdjecie?: string;
  model: string;
}) {
  if (zdjecie) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={zdjecie}
        alt={model}
        width={400}
        height={192}
        loading="lazy"
        decoding="async"
        className="h-40 w-full rounded-xl border border-white/10 bg-white object-contain p-4 sm:h-48"
      />
    );
  }
  return (
    <div className="flex h-40 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-48">
      <Wifi size={48} className="text-teal-300/50" />
    </div>
  );
});

export default IkonaRoutera;
