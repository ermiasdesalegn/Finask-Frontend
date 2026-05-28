import { Camera } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type GalleryTile = { src: string; index: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distributeIntoColumns(images: string[], columnCount: number): GalleryTile[][] {
  const cols: GalleryTile[][] = Array.from({ length: columnCount }, () => []);

  // Slightly more tiles in columns 2 & 4 (index 1 and 3),
  // because they visually move faster in the parallax effect.
  const weights = Array.from({ length: columnCount }, (_, i) =>
    i === 1 || i === 3 ? 1.35 : 1
  );

  const scores = Array.from({ length: columnCount }, () => 0);

  images.forEach((src, index) => {
    let best = 0;
    for (let i = 1; i < columnCount; i += 1) {
      if (scores[i]! < scores[best]!) best = i;
    }
    cols[best]!.push({ src, index });
    scores[best] = (cols[best]!.length + 0.15) / (weights[best] ?? 1);
  });

  return cols;
}

function GalleryTileButton({
  tile,
  className,
  onImageClick,
  aspectClassName,
}: {
  tile: GalleryTile;
  className?: string;
  onImageClick: (index: number) => void;
  aspectClassName: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onImageClick(tile.index)}
      className={cn(
        "group relative min-h-0 overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-white/5 dark:bg-zinc-800",
        className
      )}
    >
      <div className={cn("relative w-full", aspectClassName)}>
        <img
          src={tile.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
        <Camera
          size={28}
          className="text-white opacity-0 drop-shadow-md transition group-hover:opacity-100"
        />
      </div>
    </button>
  );
}

function BentoSkeleton() {
  const columnCount = 4;
  const placeholders = Array.from({ length: columnCount }, (_, col) =>
    Array.from({ length: 4 }, (_, row) => `${col}-${row}`)
  );
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {placeholders.map((col, i) => (
        <div key={i} className="flex flex-col gap-3">
          {col.map((k) => (
            <div
              key={k}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CampusGalleryMasonry({
  images,
  onImageClick,
  className,
  loading,
}: {
  images: string[];
  onImageClick: (index: number) => void;
  className?: string;
  loading?: boolean;
}) {
  const filterPills = useMemo(
    () => ["View All", "Office", "Living", "Kitchen", "Bathroom"] as const,
    []
  );
  const [activePill, setActivePill] = useState<(typeof filterPills)[number]>("View All");

  // Visual-only for now (no categories on images from the API yet)
  const filteredImages = images;

  const columnCount = 4;
  const columns = useMemo(
    () => distributeIntoColumns(filteredImages, columnCount),
    [filteredImages]
  );

  const colRefs = useRef<Array<HTMLDivElement | null>>([]);
  const spacerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading || filteredImages.length === 0) return;

    const apply = () => {
      rafRef.current = null;
      const y = window.scrollY || 0;

      // Extra upward translate for columns 2 & 4.
      const extraBoost = 0.28;
      const maxOffset = 8000;

      for (let i = 0; i < columnCount; i += 1) {
        const colEl = colRefs.current[i];
        const spacerEl = spacerRefs.current[i];
        if (!colEl) continue;
        const boost = i === 1 || i === 3 ? extraBoost : 0;
        const offset = clamp(y * boost, 0, maxOffset);
        colEl.style.transform = offset ? `translate3d(0, ${-offset}px, 0)` : "";
        if (spacerEl) spacerEl.style.height = offset ? `${Math.round(offset)}px` : "0px";
      }
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [loading, filteredImages.length]);

  if (loading) return <BentoSkeleton />;
  if (images.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        No photos yet for this university.
      </p>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              ref={(node) => {
                colRefs.current[colIndex] = node;
              }}
              className="flex flex-col gap-3 will-change-transform"
            >
              {col.map((tile, tileIndex) => {
                const variant = (tileIndex + colIndex * 2) % 6;
                const aspect =
                  variant === 0
                    ? "aspect-[16/10]"
                    : variant === 1
                      ? "aspect-[1/1]"
                      : variant === 2
                        ? "aspect-[4/3]"
                        : "aspect-[3/4]";

                return (
                  <GalleryTileButton
                    key={`${tile.index}-${tile.src}`}
                    tile={tile}
                    onImageClick={onImageClick}
                    className="w-full"
                    aspectClassName={aspect}
                  />
                );
              })}

              <div
                ref={(node) => {
                  spacerRefs.current[colIndex] = node;
                }}
                aria-hidden="true"
                className="h-0 shrink-0"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
            {filterPills.map((pill) => {
              const active = pill === activePill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setActivePill(pill)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition",
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  )}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { BentoSkeleton as CampusGalleryBentoSkeleton };
