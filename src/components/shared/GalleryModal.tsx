import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

type Props = {
  images: string[];
  title?: string;
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
};

export default function GalleryModal({
  images,
  title,
  open,
  onClose,
  initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, images.length, onClose]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  if (!images.length) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex flex-col bg-black/95"
          role="dialog"
          aria-modal
          aria-label={title ?? "Photo gallery"}
          onClick={onClose}
        >
          {/* Top row: close button sits inside the modal, never clipped */}
          <div
            className="flex shrink-0 items-center justify-end px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
              aria-label="Close gallery"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main image area */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-10 lg:px-16"
            onClick={onClose}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25"
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-2xl">
                <img
                  src={images[index]}
                  alt={
                    title ? `${title} ${index + 1}` : `Gallery image ${index + 1}`
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </motion.div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25"
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {/* Title + counter — bottom-right corner of image area */}
            {(title || images.length > 1) && (
              <div
                className="absolute bottom-3 right-4 z-10 rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm font-semibold text-white/90">
                  {title && <span className="mr-2">{title}</span>}
                  {images.length > 1 && (
                    <span className="text-white/60">{index + 1} / {images.length}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="shrink-0 py-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center gap-1.5 overflow-x-auto px-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      i === index
                        ? "border-brand-blue opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Button to open gallery from cover + images array */
export function ViewGalleryButton({
  coverImage,
  images = [],
  title,
  className,
}: {
  coverImage?: string;
  images?: string[];
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const all = [
    ...(coverImage ? [coverImage] : []),
    ...images.filter((u) => u && u !== coverImage),
  ];

  if (all.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        View gallery{all.length > 1 ? ` (${all.length})` : ""}
      </button>
      <GalleryModal
        images={all}
        title={title}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
