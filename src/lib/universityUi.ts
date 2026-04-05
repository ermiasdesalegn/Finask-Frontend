import { UNIVERSITY_IMAGE_FALLBACK } from "../constants/defaultMediaFallbacks";
import type { City, University } from "../types";

const EXCELLENCE_KEYS = new Set([
  "research",
  "general",
  "specialized",
  "applied",
]);

const EXCELLENCE_LABEL: Record<string, string> = {
  research: "Research",
  general: "General",
  specialized: "Specialized",
  applied: "Applied",
};

const REGION_LABEL: Record<string, string> = {
  addis: "Addis Ababa",
  afar: "Afar",
  amhara: "Amhara",
  benishangul: "Benishangul-Gumuz",
  cers: "Central Ethiopia",
  dire: "Dire Dawa",
  gambella: "Gambella",
  harari: "Harari",
  oromia: "Oromia",
  sidama: "Sidama",
  sers: "South Ethiopia",
  somali: "Somali",
  swepr: "South West Ethiopia",
  tigray: "Tigray",
};

export function universityPath(uni: University): string {
  const s = uni.slug || uni._id || uni.id;
  return s ? `/universities/${s}` : "/universities";
}

export function universityCover(uni: University): string {
  return uni.coverImage || uni.images?.[0] || UNIVERSITY_IMAGE_FALLBACK;
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

/** Climate from populated city, excellence tags, bestKnownFor, or region — for home/compare previews. */
export function universityClimateFocus(uni: University): string {
  const city = uni.city;
  if (city && typeof city === "object") {
    const clim = (city as City).climate;
    if (clim) {
      const parts: string[] = [];
      if (clim.minTemperature != null && clim.maxTemperature != null) {
        parts.push(`${clim.minTemperature}–${clim.maxTemperature}°C`);
      }
      if (clim.climateTag) parts.push(clim.climateTag);
      if (clim.elevationZone) parts.push(clim.elevationZone);
      if (parts.length) return parts.join(", ");
    }
  }

  const tags = uni.tags ?? [];
  const names = uni.tagsDisplayNames ?? [];
  const focus: string[] = [];
  tags.forEach((t, i) => {
    if (EXCELLENCE_KEYS.has(t)) {
      focus.push(names[i] ?? EXCELLENCE_LABEL[t] ?? t);
    }
  });
  if (focus.length) return focus.join(" / ");

  const known = uni.bestKnownFor?.filter(Boolean) ?? [];
  if (known.length) return known.slice(0, 3).join(" · ");

  const cityObj = city && typeof city === "object" ? (city as City) : null;
  if (cityObj?.regionDisplayName?.trim()) {
    return cityObj.regionDisplayName.trim();
  }
  const regionCode =
    (cityObj?.region?.toLowerCase?.() ?? "") ||
    (uni.address?.region?.toLowerCase?.() ?? "");
  if (regionCode && REGION_LABEL[regionCode]) {
    return REGION_LABEL[regionCode];
  }
  if (regionCode) {
    return regionCode.replace(/-/g, " ");
  }

  const fallback = names[0] ?? tags[0];
  return fallback || "—";
}
