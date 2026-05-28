import { Camera } from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/utils";

type GalleryTile = { src: string; index: number };

/**
 * Bento flow to match your screenshot:
 * - Desktop uses a 4-column grid with varying column spans per row.
 * - Row 1: 1 big (span 2) + 2 small (span 1 + span 1)  => [2,1,1]
 * - Then we repeat varied two-tile rows (NOT 50/50):    => [3,1] then [2,2] then [1,3] then [2,2] ...
 * - If 1 remains: solo (span 4)
 *
 * This avoids a “chunked/uniform” look where every row keeps the same rule.
 */
type FlowRow =
  | { kind: "first"; tiles: [GalleryTile, GalleryTile, GalleryTile] } // [2,1,1]
  | { kind: "two"; tiles: [GalleryTile, GalleryTile]; layout: "3-1" | "2-2" | "1-3" }
  | { kind: "solo"; tiles: [GalleryTile] };

function buildFlowRows(images: string[]): FlowRow[] {
  const rows: FlowRow[] = [];
  let i = 0;

  if (images.length >= 3) {
    rows.push({
      kind: "first",
      tiles: [
        { src: images[i], index: i },
        { src: images[i + 1], index: i + 1 },
        { src: images[i + 2], index: i + 2 },
      ],
    });
    i += 3;
  }

  const twoLayouts: Array<"3-1" | "2-2" | "1-3"> = ["3-1", "2-2", "1-3", "2-2"];
  let step = 0;

  while (i < images.length) {
    const left = images.length - i;
    if (left >= 2) {
      rows.push({
        kind: "two",
        layout: twoLayouts[step % twoLayouts.length],
        tiles: [
          { src: images[i], index: i },
          { src: images[i + 1], index: i + 1 },
        ],
      });
      i += 2;
      step += 1;
      continue;
    }

    rows.push({
      kind: "solo",
      tiles: [{ src: images[i], index: i }],
    });
    i += 1;
  }

  return rows;
}

function GalleryTileButton({
  tile,
  className,
  onImageClick,
}: {
  tile: GalleryTile;
  className?: string;
  onImageClick: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onImageClick(tile.index)}
      className={cn(
        "group relative h-full min-h-0 overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-white/5 dark:bg-zinc-800",
        className
      )}
    >
      <img
        src={tile.src}
        alt=""
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
        <Camera
          size={28}
          className="text-white opacity-0 drop-shadow-md transition group-hover:opacity-100"
        />
      </div>
    </button>
  );
}

function BentoRowView({
  row,
  onImageClick,
}: {
  row: FlowRow;
  onImageClick: (index: number) => void;
}) {
  // close to the screenshot proportions; keeps everything feeling “bento”, not masonry
  const rowHeight = "h-[190px] sm:h-[230px] md:h-[270px] lg:h-[290px]";

  if (row.kind === "solo") {
    return (
      <div className={cn("w-full", rowHeight)}>
        <GalleryTileButton
          tile={row.tiles[0]}
          className="h-full w-full"
          onImageClick={onImageClick}
        />
      </div>
    );
  }

  if (row.kind === "first") {
    const [wide, a, b] = row.tiles;
    return (
      <>
        {/* Mobile stack: wide then two side-by-side */}
        <div className="flex flex-col gap-3 sm:hidden">
          <GalleryTileButton
            tile={wide}
            className="h-[220px] w-full"
            onImageClick={onImageClick}
          />
          <div className="flex h-[180px] gap-3">
            <GalleryTileButton
              tile={a}
              className="min-w-0 flex-1"
              onImageClick={onImageClick}
            />
            <GalleryTileButton
              tile={b}
              className="min-w-0 flex-1"
              onImageClick={onImageClick}
            />
          </div>
        </div>

        {/* Desktop: 4-col grid row => [2,1,1] */}
        <div className={cn("hidden gap-3 sm:grid sm:grid-cols-4", rowHeight)}>
          <GalleryTileButton tile={wide} className="col-span-2" onImageClick={onImageClick} />
          <GalleryTileButton tile={a} className="col-span-1" onImageClick={onImageClick} />
          <GalleryTileButton tile={b} className="col-span-1" onImageClick={onImageClick} />
        </div>
      </>
    );
  }

  // row.kind === "two"
  const [a, b] = row.tiles;
  return (
    <>
      {/* Mobile: stacked */}
      <div className="flex flex-col gap-3 sm:hidden">
        <GalleryTileButton
          tile={a}
          className="h-[220px] w-full"
          onImageClick={onImageClick}
        />
        <GalleryTileButton
          tile={b}
          className="h-[220px] w-full"
          onImageClick={onImageClick}
        />
      </div>
      {/* Desktop: 4-col grid pair with varying spans */}
      <div className={cn("hidden gap-3 sm:grid sm:grid-cols-4", rowHeight)}>
        {row.layout === "3-1" && (
          <>
            <GalleryTileButton tile={a} className="col-span-3" onImageClick={onImageClick} />
            <GalleryTileButton tile={b} className="col-span-1" onImageClick={onImageClick} />
          </>
        )}
        {row.layout === "1-3" && (
          <>
            <GalleryTileButton tile={a} className="col-span-1" onImageClick={onImageClick} />
            <GalleryTileButton tile={b} className="col-span-3" onImageClick={onImageClick} />
          </>
        )}
        {row.layout === "2-2" && (
          <>
            <GalleryTileButton tile={a} className="col-span-2" onImageClick={onImageClick} />
            <GalleryTileButton tile={b} className="col-span-2" onImageClick={onImageClick} />
          </>
        )}
      </div>
    </>
  );
}

function BentoSkeleton() {
  const heights = ["first", "two", "two", "two"] as const;
  return (
    <div className="space-y-3">
      {heights.map((kind, i) => (
        <div
          key={i}
          className={cn(
            "gap-3",
            "h-[190px] sm:h-[230px] md:h-[270px]",
            "hidden sm:grid sm:grid-cols-4"
          )}
        >
          {kind === "first" ? (
            <>
              <div className="col-span-2 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
              <div className="col-span-1 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
              <div className="col-span-1 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            </>
          ) : (
            <>
              <div className="col-span-2 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
              <div className="col-span-2 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/** Figma-style bento rows — mixed widths, shared row height (not a square grid). */
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
  const rows = useMemo(() => buildFlowRows(images), [images]);

  if (loading) {
    return <BentoSkeleton />;
  }

  if (images.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        No photos yet for this university.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {rows.map((row, i) => (
        <BentoRowView key={`${row.kind}-${i}`} row={row} onImageClick={onImageClick} />
      ))}
    </div>
  );
}

export { BentoSkeleton as CampusGalleryBentoSkeleton };
