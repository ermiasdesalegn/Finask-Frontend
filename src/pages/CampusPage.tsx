import { useQuery } from "@tanstack/react-query";
import { Building2, GraduationCap, Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ReviewsSection from "../components/community/ReviewsSection";
import QuestionsSection from "../components/community/QuestionsSection";
import FavoriteButton from "../components/favorites/FavoriteButton";
import CollapsibleSection from "../components/shared/CollapsibleSection";
import EntityMap from "../components/shared/EntityMap";
import GalleryModal from "../components/shared/GalleryModal";
import SubpageLayout, { SubpageCard } from "../components/layout/SubpageLayout";
import { UNIVERSITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import {
  fetchCampusDetail,
  fetchCampusPrograms,
} from "../lib/services/campusService";
import { universityPath } from "../lib/universityUi";
import type { Program, University } from "../types";

export default function CampusPage() {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const campusQ = useQuery({
    queryKey: ["campus", slugOrId],
    queryFn: () => fetchCampusDetail(slugOrId!),
    enabled: Boolean(slugOrId),
  });
  const campus = campusQ.data;
  const programsQ = useQuery({
    queryKey: ["campus-programs", campus?._id],
    queryFn: () => fetchCampusPrograms(campus!._id),
    enabled: Boolean(campus?._id),
  });

  if (campusQ.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#05060c]">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }

  if (!campus) {
    return (
      <SubpageLayout
        title="Campus not found"
        back={{ label: "All campuses", to: "/campuses" }}
        maxWidth="lg"
      >
        <SubpageCard className="py-12 text-center text-slate-500">
          Check the link or browse the campus directory.
        </SubpageCard>
      </SubpageLayout>
    );
  }

  const uni =
    typeof campus.university === "object"
      ? (campus.university as University)
      : null;
  const galleryImages = [
    ...(campus.coverImage ? [campus.coverImage] : []),
    ...(campus.images ?? []),
  ].filter(Boolean) as string[];
  const cover = galleryImages[0] || UNIVERSITY_IMAGE_FALLBACK;
  const programs = (programsQ.data ?? []) as Program[];

  return (
    <SubpageLayout
      badge={
        <>
          <Building2 size={12} />
          Campus
        </>
      }
      title={campus.name}
      subtitle={campus.overview || "Campus profile and programs offered here."}
      back={{ label: "All campuses", to: "/campuses" }}
      maxWidth="lg"
      headerAction={
        <FavoriteButton itemId={campus._id} onModel="Campus" className="shrink-0" />
      }
    >
      <div className="mb-8 overflow-hidden rounded-[1.5rem] border border-slate-200/80 shadow-lg dark:border-white/10">
        <div className="relative h-56 md:h-64">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-900 shadow-lg"
          >
            View gallery
            {galleryImages.length > 1 ? ` (${galleryImages.length})` : ""}
          </button>
          {uni && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <MapPin size={14} />
              {campus.address?.city ?? campus.address?.fullAddress ?? "Ethiopia"}
              <span className="text-white/50">·</span>
              <Link
                to={universityPath(uni)}
                className="font-bold text-white hover:text-brand-yellow"
              >
                {uni.name}
              </Link>
            </div>
          )}
        </div>
      </div>
      <GalleryModal
        images={galleryImages.length ? galleryImages : [cover]}
        title={campus.name}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {uni && (
          <SubpageCard>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Parent university
            </p>
            <Link
              to={universityPath(uni)}
              className="mt-1 inline-block text-base font-black text-brand-blue hover:underline"
            >
              {uni.name}
            </Link>
          </SubpageCard>
        )}
        {campus.distanceFromMainCampus != null && (
          <SubpageCard>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Distance from main campus
            </p>
            <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
              {campus.distanceFromMainCampus} km
            </p>
          </SubpageCard>
        )}
      </div>

      {campus.overview && (
        <SubpageCard className="mb-6">
          <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
            Overview
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {campus.overview}
          </p>
        </SubpageCard>
      )}

      <SubpageCard className="mb-6">
        <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
          View on map
        </h2>
        <EntityMap
          coordinates={campus.location?.coordinates}
          label={campus.name}
        />
      </SubpageCard>

      <SubpageCard>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
          <GraduationCap size={20} className="text-brand-blue" />
          Programs at this campus
        </h2>
        {programsQ.isPending ? (
          <Loader2 className="animate-spin text-brand-blue" size={24} />
        ) : programs.length > 0 ? (
          <CollapsibleSection
            items={programs}
            limit={8}
            gridClassName="grid gap-3 sm:grid-cols-2"
            renderItem={(p) => (
              <Link
                key={p._id}
                to={`/programs/${p.slug || p._id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 font-semibold text-slate-800 transition-colors hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800/50 dark:text-slate-200"
              >
                <GraduationCap size={18} className="shrink-0 text-brand-blue" />
                <span className="line-clamp-2">{p.name}</span>
              </Link>
            )}
          />
        ) : (
          <p className="text-sm text-slate-500">No programs listed for this campus.</p>
        )}
      </SubpageCard>

      {campus._id && (
        <>
          <ReviewsSection parentType="campus" parentId={campus._id} />
          <QuestionsSection parentType="campus" parentId={campus._id} />
        </>
      )}
    </SubpageLayout>
  );
}
