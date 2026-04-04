import { apiGet } from "../api";
import { unwrapMarkdownLink } from "../unwrapMarkdownLink";
import type {
  CampusesListResponse,
  Program,
  UniversitiesListResponse,
  University,
  UniversityByIdResponse,
  UniversityProgramOffering,
  UniversityProgramsForProgramResponse,
  UniversitySlugResponse,
} from "../../types";

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

/** Max items for Discover top-ranked / top-rated slices (backend route uses this in the path). */
export const DISCOVER_TOP_LIMIT = 100;

export type UniversitiesListFilters = {
  limit?: number;
  /** e.g. -ratingsAverage */
  sort?: string;
  /** Backend city_ filter: city_region=Amhara */
  cityRegion?: string | null;
  ratingsAverageGte?: number | null;
  isFeatured?: boolean | null;
  /** Matches universities whose `tags` array contains this value (e.g. research). */
  tags?: string | null;
  /** Backend elevation_ filter against joined elevation zone (e.g. dega, kolla). */
  elevationName?: string | null;
};

/** GET /api/v1/universities — matches Express aggregation list handler */
export async function fetchUniversitiesList(
  filters: UniversitiesListFilters = {}
): Promise<UniversitiesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? 250));
  params.set("sort", filters.sort ?? "-ratingsAverage");
  if (filters.cityRegion) {
    params.set("city_region", filters.cityRegion);
  }
  if (filters.ratingsAverageGte != null) {
    params.set("ratingsAverage[gte]", String(filters.ratingsAverageGte));
  }
  if (filters.isFeatured === true) {
    params.set("isFeatured", "true");
  }
  if (filters.tags) {
    params.set("tags", filters.tags);
  }
  if (filters.elevationName) {
    params.set("elevation_name", filters.elevationName);
  }
  return apiGet<UniversitiesListResponse>(
    `/universities?${params.toString()}`
  );
}

/** Some API docs / older deploys return `data.data` instead of `data.universities`. */
type LooseUniversitiesPayload = {
  status: string;
  results?: number;
  totalResults?: number;
  data?: {
    universities?: University[];
    data?: University[];
  };
};

function normalizeUniversitiesListResponse(
  res: LooseUniversitiesPayload
): UniversitiesListResponse {
  const list =
    res.data?.universities ??
    (Array.isArray(res.data?.data) ? res.data!.data! : []);
  return {
    status: res.status,
    totalResults: res.totalResults ?? list.length,
    results: res.results ?? list.length,
    data: { universities: list },
  };
}

/** GET /api/v1/universities/trending */
export async function fetchTrendingUniversities(): Promise<UniversitiesListResponse> {
  const res = await apiGet<LooseUniversitiesPayload>("/universities/trending");
  return normalizeUniversitiesListResponse(res);
}

/** GET /api/v1/universities/featured */
export async function fetchFeaturedUniversities(): Promise<UniversitiesListResponse> {
  const res = await apiGet<LooseUniversitiesPayload>("/universities/featured");
  return normalizeUniversitiesListResponse(res);
}

/** GET /api/v1/universities/top-:n-ranked */
export async function fetchTopRankedUniversities(
  limit = DISCOVER_TOP_LIMIT
): Promise<UniversitiesListResponse> {
  const res = await apiGet<LooseUniversitiesPayload>(
    `/universities/top-${limit}-ranked`
  );
  return normalizeUniversitiesListResponse(res);
}

/** GET /api/v1/universities/top-:n-rated */
export async function fetchTopRatedUniversities(
  limit = DISCOVER_TOP_LIMIT
): Promise<UniversitiesListResponse> {
  const res = await apiGet<LooseUniversitiesPayload>(
    `/universities/top-${limit}-rated`
  );
  return normalizeUniversitiesListResponse(res);
}

/** GET /api/v1/universities/slug/:slug — mounted before /:id in Express */
export async function fetchUniversityBySlug(
  slug: string
): Promise<UniversitySlugResponse> {
  return apiGet<UniversitySlugResponse>(
    `/universities/slug/${encodeURIComponent(slug)}`
  );
}

/**
 * Resolves `/universities/:param` where param is either a slug or a Mongo ObjectId.
 * Slug: GET /universities/slug/:slug → `data.data` or `data.university`
 * Id: GET /universities/:id → `data.university`
 */
export async function fetchUniversityDetail(
  slugOrId: string
): Promise<University> {
  const param = slugOrId.trim();
  if (MONGO_OBJECT_ID_RE.test(param)) {
    const res = await apiGet<UniversityByIdResponse>(
      `/universities/${encodeURIComponent(param)}`
    );
    const u = res.data.university;
    if (!u) throw new Error("University not found.");
    return u;
  }
  const res = await fetchUniversityBySlug(param);
  const u = res.data.data ?? res.data.university;
  if (!u) throw new Error("University not found.");
  return u;
}

/** GET /api/v1/universities/:universityId/campuses */
export async function fetchUniversityCampuses(
  universityId: string,
  options?: { limit?: number; sort?: string }
): Promise<CampusesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 40));
  params.set("sort", options?.sort ?? "name");
  return apiGet<CampusesListResponse>(
    `/universities/${encodeURIComponent(universityId)}/campuses?${params.toString()}`
  );
}

/** GET /api/v1/universities/:universityId/programs — same envelope as program-side universities list */
export async function fetchUniversityPrograms(
  universityId: string,
  options?: { limit?: number; sort?: string }
): Promise<UniversityProgramsForProgramResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 120));
  params.set("sort", options?.sort ?? "yearOffered");
  const raw = await apiGet<UniversityProgramsForProgramResponse>(
    `/universities/${encodeURIComponent(universityId)}/programs?${params.toString()}`
  );
  const rows = raw.data?.universityprograms ?? [];
  const universityprograms: UniversityProgramOffering[] = rows.map((row) => {
    const p = row.program;
    if (typeof p !== "object" || p == null) return row;
    const prog = p as Program;
    const coverImage =
      unwrapMarkdownLink(prog.coverImage) || prog.coverImage || undefined;
    return {
      ...row,
      program: { ...prog, ...(coverImage ? { coverImage } : {}) },
    };
  });
  return {
    ...raw,
    results: raw.results ?? universityprograms.length,
    data: { universityprograms },
  };
}
