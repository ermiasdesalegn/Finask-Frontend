import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil, Star, Upload } from "lucide-react";
import { queryKeys } from "../../lib/queryKeys";
import {
  deleteUniversityGalleryImages,
  uploadUniversityGallery,
} from "../../lib/services/universityManagerService";
import { showApiToast } from "../../lib/api";
import { universityCover, universityPath } from "../../lib/universityUi";
import { cn } from "../../lib/utils";
import type { University } from "../../types";
import EntityMap from "../shared/EntityMap";
import { CampusManagement } from "./CampusManagement";
import { ImageDropzone } from "./ImageDropzone";
import { UniversityEditDialog } from "./UniversityEditDialog";

const TABS = [
  "overview",
  "academic",
  "contact",
  "social",
  "rankings",
  "campuses",
  "gallery",
] as const;

type TabId = (typeof TABS)[number];

const TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  academic: "Academic",
  contact: "Contact",
  social: "Social",
  rankings: "Rankings",
  campuses: "Campuses",
  gallery: "Gallery",
};

function getCityName(city: University["city"]): string {
  if (!city) return "—";
  if (typeof city === "object" && "name" in city) return city.name;
  return String(city);
}

function formatCoordinates(
  coordinates?: [number, number] | number[]
): string | null {
  if (!coordinates || coordinates.length < 2) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

interface ManagedUniversityDashboardProps {
  university: University;
}

export function ManagedUniversityDashboard({
  university,
}: ManagedUniversityDashboardProps) {
  const queryClient = useQueryClient();
  const universityId = university._id ?? university.id ?? "";
  const [tab, setTab] = useState<TabId>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const uploadMutation = useMutation({
    mutationFn: () =>
      uploadUniversityGallery(universityId, { gallery: galleryFiles }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managedUniversity() });
      setGalleryFiles([]);
      showApiToast("Images uploaded");
    },
    onError: (err: Error) => showApiToast(err.message),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (url: string) =>
      deleteUniversityGalleryImages(universityId, [url]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managedUniversity() });
      showApiToast("Image removed");
    },
    onError: (err: Error) => showApiToast(err.message),
  });

  const images = university.images ?? [];
  const coordinatesLabel = formatCoordinates(university.location?.coordinates);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="relative h-48 bg-slate-200 dark:bg-zinc-800">
          <img
            src={universityCover(university)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {university.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {getCityName(university.city)}
              {university.ratingsAverage != null && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {university.ratingsAverage.toFixed(1)}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={universityPath(university)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold dark:border-white/10"
            >
              <ExternalLink className="size-4" />
              View public page
            </Link>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white"
            >
              <Pencil className="size-4" />
              Edit university
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-bold transition-colors",
              tab === t
                ? "bg-brand-blue text-white"
                : "bg-white text-slate-700 dark:bg-zinc-900 dark:text-slate-200"
            )}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        {tab === "overview" && (
          <div className="space-y-4 text-sm">
            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {university.overview || "—"}
            </p>
            {university.bestKnownFor?.length ? (
              <div className="flex flex-wrap gap-2">
                {university.bestKnownFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-zinc-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
            {university.wikipediaLink && (
              <a
                href={university.wikipediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-blue hover:underline"
              >
                Wikipedia →
              </a>
            )}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Location
              </h3>
              <EntityMap
                coordinates={university.location?.coordinates}
                label={university.name}
                heightClass="h-56 sm:h-64"
              />
              {coordinatesLabel && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Coordinates: {coordinatesLabel}
                </p>
              )}
            </div>
          </div>
        )}

        {tab === "academic" && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-slate-500">Abbreviation</dt>
              <dd>{university.academicProfile?.abbreviation ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Year founded</dt>
              <dd>{university.academicProfile?.yearFounded ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Undergrad programs</dt>
              <dd>
                {university.academicProfile?.undergraduateProgramsCount ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Campuses (count)</dt>
              <dd>{university.academicProfile?.numberOfCampuses ?? "—"}</dd>
            </div>
          </dl>
        )}

        {tab === "contact" && (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-bold text-slate-500">Website</dt>
              <dd>
                {university.contacts?.websiteUrl ? (
                  <a
                    href={university.contacts.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline"
                  >
                    {university.contacts.websiteUrl}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Emails</dt>
              <dd>{university.contacts?.emails?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Phones</dt>
              <dd>{university.contacts?.phoneNumbers?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Address</dt>
              <dd>
                {[university.address?.street, university.address?.city]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </dd>
            </div>
          </dl>
        )}

        {tab === "social" && (
          <ul className="space-y-2 text-sm">
            {Object.entries(university.socialLinks ?? {}).map(([key, url]) =>
              url ? (
                <li key={key}>
                  <span className="font-bold capitalize">{key}: </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ) : null
            )}
            {!Object.values(university.socialLinks ?? {}).some(Boolean) && (
              <p className="text-slate-500">No social links.</p>
            )}
          </ul>
        )}

        {tab === "rankings" && (
          <div className="grid gap-6 sm:grid-cols-2 text-sm">
            {(["eduRank", "uniRank"] as const).map((key) => {
              const rank = university.rank?.[key];
              if (!rank) return null;
              return (
                <div key={key} className="rounded-xl border p-4">
                  <h4 className="mb-2 font-bold">
                    {key === "eduRank" ? "EduRank" : "UniRank"}
                  </h4>
                  <ul className="space-y-1 text-slate-600">
                    {rank.ethiopiaRank != null && (
                      <li>Ethiopia: #{rank.ethiopiaRank}</li>
                    )}
                    {rank.africaRank != null && (
                      <li>Africa: #{rank.africaRank}</li>
                    )}
                    {rank.worldRank != null && (
                      <li>World: #{rank.worldRank}</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {tab === "campuses" && (
          <CampusManagement
            universityId={universityId}
            universityName={university.name}
          />
        )}

        {tab === "gallery" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <ImageDropzone
                  label="Upload gallery images"
                  maxFiles={10}
                  files={galleryFiles}
                  onChange={setGalleryFiles}
                />
              </div>
              <button
                type="button"
                disabled={!galleryFiles.length || uploadMutation.isPending}
                onClick={() => uploadMutation.mutate()}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                <Upload className="size-4" />
                Upload
              </button>
            </div>
            {images.length === 0 ? (
              <p className="text-sm text-slate-500">No gallery images yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-xl border"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Remove this image?")) {
                          deleteImageMutation.mutate(url);
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-white text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <UniversityEditDialog
        university={university}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
