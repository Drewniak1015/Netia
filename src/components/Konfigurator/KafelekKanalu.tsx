import { memo } from "react";
import type { Channel } from "@/lib/channels";

const KafelekKanalu = memo(function KafelekKanalu({ channel }: { channel: Channel }) {
  const inicjaly = channel.name.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
      {channel.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={channel.logoUrl}
          alt={channel.name}
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: "1 / 1" }}
          className="h-8 w-8 shrink-0 rounded-md bg-white object-contain p-0.5"
        />
      ) : (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
          style={{ backgroundColor: channel.color }}
        >
          {inicjaly}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white/90">
          {channel.name}
          {channel.guaranteed && <span className="ml-1 text-teal-300">*</span>}
        </p>
        <p className="text-[11px] text-white/40">
          nr {channel.number}
          {channel.only4k && " · 4K"}
        </p>
      </div>
    </div>
  );
});

export default KafelekKanalu;
