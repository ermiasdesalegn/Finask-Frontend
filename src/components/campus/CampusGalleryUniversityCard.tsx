import { LayoutGrid, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import FavoriteButton from "../favorites/FavoriteButton";
import {
  displayRating,
  formatRatingsQuantityCompact,
} from "../../lib/universityUi";
import { universityGalleryPath } from "../../lib/campusGalleryUtils";
import type { UniversityGalleryGroup } from "../../lib/campusGalleryUtils";
import type { University } from "../../types";
import { cn } from "../../lib/utils";

export default function CampusGalleryUniversityCard({
  group,
  index = 0,
  className,
}: {
  group: UniversityGalleryGroup;
  index?: number;
  className?: string;
}) {
  const { uni, images, cover, name, city } = group;
  const href = uni ? universityGalleryPath(uni) : "/campuses";
  const photoTotal = images.length;
  const featured = Boolean(uni?.isFeatured);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.35) }}
      className={cn(
        "group relative overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-200/50 dark:border-white/10 dark:bg-zinc-900 dark:hover:shadow-none",
        className
      )}
    >
      <Link to={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-zinc-800">
          {uni?._id && (
            <div
              className="absolute right-3 top-3 z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <FavoriteButton
                itemId={uni._id}
                onModel="University"
                size={14}
                className="!bg-black/40 !text-white backdrop-blur-md hover:!bg-black/55"
              />
            </div>
          )}
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

          {featured && (
            <span className="absolute left-3 top-3 rounded-md bg-brand-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-900">
              Featured
            </span>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-sm">
            1 / {photoTotal}
          </span>

          <span className="absolute bottom-3 left-3 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-md">
            <LayoutGrid size={14} />
          </span>
        </div>

        <div className="p-4">
          <h3 className="truncate text-base font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white md:text-lg">
            {name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {city && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} className="text-brand-blue" />
                {city}
              </span>
            )}
            {uni?.ratingsAverage != null && (
              <>
                {city && (
                  <span className="text-slate-300 dark:text-zinc-600">·</span>
                )}
                <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                  <Star
                    size={12}
                    className="text-brand-yellow"
                    fill="currentColor"
                  />
                  {displayRating(uni as University)}
                  {uni.ratingsQuantity != null && (
                    <span className="font-medium text-slate-400">
                      ({formatRatingsQuantityCompact(uni.ratingsQuantity)})
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
