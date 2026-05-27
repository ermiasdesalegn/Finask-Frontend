import { Camera } from "lucide-react";
import { cn } from "../../lib/utils";

/** Figma-style masonry: mixed aspect tiles in a responsive column layout. */
export default function CampusGalleryMasonry({
  images,
  onImageClick,
  className,
}: {
  images: string[];
  onImageClick: (index: number) => void;
  className?: string;
}) {
  if (images.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        No photos yet for this university.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4",
        className
      )}
    >
      {images.map((src, i) => {
        const tall = i % 5 === 0 || i % 5 === 3;
        return (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onImageClick(i)}
            className={cn(
              "group mb-3 w-full break-inside-avoid overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800",
              tall ? "aspect-[3/4]" : "aspect-[4/3]"
            )}
          >
            <div className="relative h-full w-full">
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/35">
                <Camera
                  size={28}
                  className="text-white opacity-0 transition group-hover:opacity-100"
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
