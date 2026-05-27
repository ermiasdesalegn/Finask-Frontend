import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  MapPin,
  Share2,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampusGalleryMasonry, {
  CampusGalleryBentoSkeleton,
} from "../components/campus/CampusGalleryMasonry";
import CampusGallerySectionTitle from "../components/campus/CampusGallerySectionTitle";
import FavoriteButton from "../components/favorites/FavoriteButton";
import GalleryModal from "../components/shared/GalleryModal";
import { collectGalleryImages } from "../lib/campusGalleryUtils";
import {
  useUniversityBySlugQuery,
  useUniversityCampusesQuery,
} from "../lib/queries";
import { showApiToast } from "../lib/api";
import {
  displayRating,
  formatRatingsQuantityCompact,
  universityCity,
  universityPath,
} from "../lib/universityUi";
import type { University } from "../types";

function institutionalTypeLabel(uni: University): string | null {
  if (uni.institutionalType === "public") return "Public University";
  if (uni.institutionalType === "private") return "Private University";
  return null;
}

export default function UniversityCampusGalleryPage() {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const uniQuery = useUniversityBySlugQuery(universityId);
  const uni = uniQuery.data;
  const uniId = uni?._id ?? "";

  const campusesQuery = useUniversityCampusesQuery(uniId);
  const campuses = campusesQuery.data?.data?.campuses ?? [];

  const images = useMemo(
    () => collectGalleryImages(uni ?? null, campuses),
    [uni, campuses]
  );


  const loading = uniQuery.isPending || (uniId && campusesQuery.isPending);
  const error =
    uniQuery.isError || campusesQuery.isError
      ? "Could not load this gallery."
      : null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: uni?.name ?? "Campus gallery",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        showApiToast("Link copied to clipboard.");
      }
    } catch {
      /* user cancelled */
    }
  };

  if (!universityId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-[#0a0a0a]">
      <div className="border-b border-slate-200/80 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <nav
            className="mb-4 flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-brand-blue">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/universities" className="hover:text-brand-blue">
              Universities
            </Link>
            <ChevronRight size={12} />
            <Link to="/campuses" className="hover:text-brand-blue">
              Campus gallery
            </Link>
            {uni?.name && (
              <>
                <ChevronRight size={12} />
                <span className="truncate text-slate-700 dark:text-slate-200">
                  {uni.name}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-900 dark:text-slate-200"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                {loading ? (
                  <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
                ) : (
                  <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
                    {uni?.name ?? "University"}
                    {uni?.isFeatured && (
                      <BadgeCheck
                        size={22}
                        className="text-brand-blue"
                        aria-label="Featured"
                      />
                    )}
                  </h1>
                )}
                {uni && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    {(universityCity(uni) || uni.address?.city) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {universityCity(uni) || uni.address?.city}
                        {uni.address?.region ? `, Ethiopia` : ""}
                      </span>
                    )}
                    {uni.ratingsAverage != null && (
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                        <Star
                          size={14}
                          className="text-brand-yellow"
                          fill="currentColor"
                        />
                        {displayRating(uni)}
                        {uni.ratingsQuantity != null && (
                          <span className="font-medium text-slate-400">
                            ({formatRatingsQuantityCompact(uni.ratingsQuantity)})
                          </span>
                        )}
                      </span>
                    )}
                    {institutionalTypeLabel(uni) && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                        {institutionalTypeLabel(uni)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {uni?._id && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <FavoriteButton
                  itemId={uni._id}
                  onModel="University"
                  className="!rounded-xl !border !border-slate-200 !bg-white !px-4 !py-2.5 dark:!border-white/10 dark:!bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-blue/25 hover:bg-blue-700"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <Link
                  to={universityPath(uni)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-blue/30 dark:border-white/10 dark:bg-zinc-900 dark:text-slate-200"
                >
                  University profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        {loading && !error && <CampusGalleryBentoSkeleton />}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CampusGallerySectionTitle title="Campus Gallery" />
            <p className="-mt-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
              {images.length} photo{images.length === 1 ? "" : "s"} across{" "}
              {campuses.length} campus{campuses.length === 1 ? "" : "es"}
            </p>
            <CampusGalleryMasonry
              images={images}
              onImageClick={(index) => {
                setGalleryIndex(index);
                setGalleryOpen(true);
              }}
            />
          </motion.div>
        )}
      </div>

      <GalleryModal
        images={images}
        title={uni?.name ?? "Campus gallery"}
        open={galleryOpen}
        initialIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
}
