import { UNIVERSITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import { universityCover } from "./universityUi";
import { unwrapMarkdownLink } from "./unwrapMarkdownLink";
import type { Campus, University } from "../types";

export type UniRef = University & { _id: string; name: string };

export type UniversityGalleryGroup = {
  key: string;
  uni: UniRef | null;
  campuses: Campus[];
  images: string[];
  cover: string;
  name: string;
  city: string;
};

/** Normalize stored image values (plain URL, markdown link, or nested object). */
export function resolveImageUrl(raw: unknown): string {
  if (raw == null) return "";
  if (typeof raw === "object") {
    const o = raw as { url?: string; secure_url?: string };
    const nested = o.url ?? o.secure_url;
    if (nested) return resolveImageUrl(nested);
    return "";
  }
  const trimmed = String(raw).trim();
  if (!trimmed) return "";
  const unwrapped = unwrapMarkdownLink(trimmed);
  return (unwrapped || trimmed).trim();
}

function pushUnique(seen: Set<string>, imgs: string[], raw: unknown) {
  const s = resolveImageUrl(raw);
  if (!s || s === UNIVERSITY_IMAGE_FALLBACK || seen.has(s)) return;
  seen.add(s);
  imgs.push(s);
}

export function campusImages(c: Campus): string[] {
  const imgs: string[] = [];
  const seen = new Set<string>();
  for (const src of [c.coverImage, ...(c.images ?? [])]) {
    pushUnique(seen, imgs, src);
  }
  return imgs.length ? imgs : [UNIVERSITY_IMAGE_FALLBACK];
}

export function uniFromCampus(c: Campus): UniRef | null {
  const u = c.university;
  if (typeof u === "object" && u && "name" in u && u.name) {
    return u as UniRef;
  }
  return null;
}

export function uniKey(c: Campus): string {
  const u = c.university;
  if (typeof u === "object" && u) {
    return (
      (u as { _id?: string; slug?: string })._id ??
      (u as { slug?: string }).slug ??
      "unknown"
    );
  }
  return String(u ?? "unknown");
}

/**
 * Full gallery for a university: all `university.images`, then `coverImage` if not
 * already listed, then any campus photos not already included.
 */
export function collectGalleryImages(
  uni: University | UniRef | null,
  campuses: Campus[]
): string[] {
  const seen = new Set<string>();
  const imgs: string[] = [];

  if (uni) {
    for (const src of uni.images ?? []) {
      pushUnique(seen, imgs, src);
    }
    pushUnique(seen, imgs, uni.coverImage);
  }

  for (const c of campuses) {
    for (const src of [c.coverImage, ...(c.images ?? [])]) {
      pushUnique(seen, imgs, src);
    }
  }

  if (imgs.length > 0) return imgs;

  if (uni) return [universityCover(uni as University)];
  return [UNIVERSITY_IMAGE_FALLBACK];
}

/** @deprecated Use collectGalleryImages */
export function universityModelImages(
  uni: University | UniRef | null
): string[] {
  return collectGalleryImages(uni, []);
}

/** @deprecated Use collectGalleryImages */
export function collectUniversityImages(
  campuses: Campus[],
  uni?: UniRef | null
): string[] {
  return collectGalleryImages(uni ?? null, campuses);
}

export function displayUniversityName(
  uni: UniRef | null,
  campuses: Campus[]
): string {
  if (uni?.name) return uni.name;
  const first = campuses[0]?.name?.trim();
  if (first) return first;
  return "University";
}

export function universityGalleryPath(uni: University | UniRef): string {
  // Prefer ID (requested) so the gallery route always works even if slug changes.
  const id = (uni as { _id?: string })._id;
  if (id) return `/campuses/gallery/${id}`;
  const slug = uni.slug;
  return slug ? `/campuses/gallery/${slug}` : "/campuses";
}

export function groupCampusesByUniversity(
  campuses: Campus[]
): UniversityGalleryGroup[] {
  const map = new Map<string, { uni: UniRef | null; campuses: Campus[] }>();

  for (const c of campuses) {
    const key = uniKey(c);
    if (!map.has(key)) {
      map.set(key, { uni: uniFromCampus(c), campuses: [] });
    }
    const entry = map.get(key)!;
    entry.campuses.push(c);
    if (!entry.uni) {
      const u = uniFromCampus(c);
      if (u) entry.uni = u;
    }
  }

  return Array.from(map.entries()).map(([key, { uni, campuses: list }]) => {
    const images = collectGalleryImages(uni, list);
    const name = displayUniversityName(uni, list);
    const city =
      uni?.address?.city ??
      list.find((c) => c.address?.city)?.address?.city ??
      "";
    const cover =
      images[0] ??
      (uni ? universityCover(uni as University) : UNIVERSITY_IMAGE_FALLBACK);

    return { key, uni, campuses: list, images, cover, name, city };
  });
}

export function filterGalleryGroups(
  groups: UniversityGalleryGroup[],
  query: string
): UniversityGalleryGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups.filter((g) => {
    const campusNames = g.campuses.some((c) =>
      (c.name ?? "").toLowerCase().includes(q)
    );
    return (
      g.name.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q) ||
      campusNames
    );
  });
}

export type GallerySort = "popular" | "name-asc" | "name-desc" | "photos-desc";

export function sortGalleryGroups(
  groups: UniversityGalleryGroup[],
  sort: GallerySort
): UniversityGalleryGroup[] {
  const copy = [...groups];
  if (sort === "popular") {
    copy.sort(
      (a, b) =>
        (b.uni?.ratingsAverage ?? 0) - (a.uni?.ratingsAverage ?? 0)
    );
    return copy;
  }
  if (sort === "photos-desc") {
    copy.sort((a, b) => b.images.length - a.images.length);
    return copy;
  }
  if (sort === "name-desc") {
    copy.sort((a, b) => b.name.localeCompare(a.name));
    return copy;
  }
  copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy;
}
