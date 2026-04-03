import { apiGet } from "../api";
import type {
  CampusesListResponse,
  UniversitiesListResponse,
  UniversitySlugResponse,
} from "../../types";

export type UniversitiesListFilters = {
  limit?: number;
  /** e.g. -ratingsAverage */
  sort?: string;
  /** Backend city_ filter: city_region=Amhara */
  cityRegion?: string | null;
  ratingsAverageGte?: number | null;
  isFeatured?: boolean | null;
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
  return apiGet<UniversitiesListResponse>(
    `/universities?${params.toString()}`
  );
}

/** GET /api/v1/universities/slug/:slug — mounted before /:id in Express */
export async function fetchUniversityBySlug(
  slug: string
): Promise<UniversitySlugResponse> {
  return apiGet<UniversitySlugResponse>(
    `/universities/slug/${encodeURIComponent(slug)}`
  );
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
