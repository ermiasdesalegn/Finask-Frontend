import type { University } from "../types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600";

export function universityPath(uni: University): string {
  const s = uni.slug || uni._id || uni.id;
  return s ? `/universities/${s}` : "/universities";
}

export function universityCover(uni: University): string {
  return uni.coverImage || uni.images?.[0] || FALLBACK_IMG;
}

export function universityCity(uni: University): string {
  if (uni.address?.city) return uni.address.city;
  if (uni.city && typeof uni.city === "object" && "name" in uni.city) {
    return (uni.city as { name?: string }).name || "";
  }
  return "";
}

/** Mongo id for `/cities/:id` — works for string ref or populated city doc. */
export function universityCityId(uni: University): string | null {
  const c = uni.city;
  if (!c) return null;
  if (typeof c === "string") return c;
  if (typeof c === "object") {
    const o = c as { _id?: string; id?: string };
    if (typeof o._id === "string") return o._id;
    if (typeof o.id === "string") return o.id;
  }
  return null;
}

export function universityRank(uni: University): number | string {
  const r = uni.rank?.eduRank?.ethiopiaRank;
  return r != null ? r : "—";
}

export function formatRatingsQuantityCompact(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function displayRating(uni: University): string {
  const v = uni.ratingsAverage;
  return v != null ? v.toFixed(1) : "—";
}
