import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal
          aria-label={title ?? "Photo gallery"}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index]}
              alt={title ? `${title} ${index + 1}` : `Gallery image ${index + 1}`}
              className="max-h-[85vh] w-full rounded-2xl object-contain"
            />
            {images.length > 1 && (
              <p className="mt-3 text-center text-sm font-medium text-white/70">
                {index + 1} / {images.length}
              </p>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex max-w-full -translate-x-1/2 gap-2 overflow-x-auto px-4">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={cn(
                    "h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    i === index
                      ? "border-brand-blue opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
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
