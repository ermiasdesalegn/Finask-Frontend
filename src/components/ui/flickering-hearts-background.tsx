import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLS = 22;
const ROWS = 26;

/** Muted slate + pale blue-gray only — reads as B/W with a cool tint */
const PALETTE = [
  "text-slate-600",
  "text-slate-500",
  "text-sky-950",
  "text-slate-600",
  "text-sky-900",
  "text-slate-500",
] as const;

type Cell = {
  delayMs: number;
  durationMs: number;
  colorIdx: number;
};

function buildCells(): Cell[] {
  const out: Cell[] = [];
  const n = COLS * ROWS;
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    out.push({
      delayMs: (i * 83 + col * 47 + row * 61) % 4000,
      durationMs: 1800 + (i % 7) * 280 + (row % 3) * 120,
      colorIdx: (i + row + col) % PALETTE.length,
    });
  }
  return out;
}

const CELLS = buildCells();

/**
 * Full-viewport heart grid: near-black with pale blue tint, very low-contrast flicker.
 */
export function FlickeringHeartsBackground({
  className,
}: {
  className?: string;
}) {
  const style = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
    }),
    []
  );

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#05060c]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 grid h-full min-h-full w-full opacity-[0.38]"
        style={style}
        aria-hidden
      >
        {CELLS.map((cell, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center justify-center text-[9px] leading-none select-none sm:text-[10px]",
              "heart-flicker-cell",
              PALETTE[cell.colorIdx]
            )}
            style={{
              animationDuration: `${cell.durationMs}ms`,
              animationDelay: `${cell.delayMs}ms`,
            }}
          >
            ♥
          </span>
        ))}
      </div>
      {/* Vignette + slight top fade for readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_42%,transparent_0%,rgba(2,4,10,0.72)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03040a]/80 via-transparent to-[#03040a]/90"
        aria-hidden
      />
    </div>
  );
}
