import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UniversitiesListFilters } from "../services/universityService";
import {
  DISCOVER_TOP_LIMIT,
  fetchFeaturedUniversities,
  fetchTopRankedUniversities,
  fetchTopRatedUniversities,
  fetchTopReviewedUniversities,
  fetchTrendingUniversities,
  fetchUniversitiesNear,
  fetchSuggestedByLocation,
  fetchSuggestedByProgram,
  fetchUniversitiesList,
  fetchUniversityCampuses,
  fetchUniversityDetail,
  fetchUniversityPrograms,
} from "../services/universityService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function universitiesListQueryOptions(filters: UniversitiesListFilters) {
  return queryOptions({
    queryKey: queryKeys.universitiesList(filters),
    queryFn: () => fetchUniversitiesList(filters),
    staleTime: STALE_MS.list,
  });
}

export function useUniversitiesListQuery(
  filters: UniversitiesListFilters,
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...universitiesListQueryOptions(filters),
    enabled: options?.enabled !== false,
  });
}

export function useTrendingUniversitiesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.universitiesTrending(),
    queryFn: () => fetchTrendingUniversities(),
    staleTime: STALE_MS.list,
    enabled: options?.enabled !== false,
  });
}

export function useFeaturedUniversitiesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.universitiesFeatured(),
    queryFn: () => fetchFeaturedUniversities(),
    staleTime: STALE_MS.list,
    enabled: options?.enabled !== false,
  });
}

export function useTopRankedUniversitiesQuery(
  limit = DISCOVER_TOP_LIMIT,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.universitiesTopRanked(limit),
    queryFn: () => fetchTopRankedUniversities(limit),
    staleTime: STALE_MS.list,
    enabled: options?.enabled !== false,
  });
}

export function useTopRatedUniversitiesQuery(
  limit = DISCOVER_TOP_LIMIT,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.universitiesTopRated(limit),
    queryFn: () => fetchTopRatedUniversities(limit),
    staleTime: STALE_MS.list,
    enabled: options?.enabled !== false,
  });
}

export function useTopReviewedUniversitiesQuery(
  limit = DISCOVER_TOP_LIMIT,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.universitiesTopReviewed(limit),
    queryFn: () => fetchTopReviewedUniversities(limit),
    staleTime: STALE_MS.list,
    enabled: options?.enabled !== false,
  });
}

export function useUniversitiesNearQuery(
  coords: { lat: number; lng: number } | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.universitiesNear(coords?.lat ?? 0, coords?.lng ?? 0),
    queryFn: () => fetchUniversitiesNear(coords!.lat, coords!.lng),
    enabled: Boolean(coords) && options?.enabled !== false,
  });
}

export function useSuggestedByLocationQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.universitiesSuggestedLocation(),
    queryFn: fetchSuggestedByLocation,
    enabled,
    staleTime: STALE_MS.list,
  });
}

export function useSuggestedByProgramQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.universitiesSuggestedProgram(),
    queryFn: fetchSuggestedByProgram,
    enabled,
    staleTime: STALE_MS.list,
  });
}

const PENDING_KEY = "__pending__";

export function universityBySlugQueryOptions(slug: string) {
  const keySlug = slug.trim() || PENDING_KEY;
  return queryOptions({
    queryKey: queryKeys.universityBySlug(keySlug),
    queryFn: () => fetchUniversityDetail(slug),
    enabled: Boolean(slug?.trim()),
    staleTime: STALE_MS.universityDetail,
  });
}

export function useUniversityBySlugQuery(slug: string | undefined) {
  const s = slug?.trim() ?? "";
  return useQuery(universityBySlugQueryOptions(s));
}

export function universityCampusesQueryOptions(universityId: string) {
  const keyId = universityId || PENDING_KEY;
  return queryOptions({
    queryKey: queryKeys.universityCampuses(keyId),
    queryFn: () => fetchUniversityCampuses(universityId),
    enabled: Boolean(universityId),
    staleTime: STALE_MS.universityCampuses,
  });
}

export function useUniversityCampusesQuery(universityId: string | undefined) {
  const id = universityId ?? "";
  return useQuery(universityCampusesQueryOptions(id));
}

export function universityProgramsQueryOptions(universityId: string) {
  const keyId = universityId || PENDING_KEY;
  return queryOptions({
    queryKey: queryKeys.universityPrograms(keyId),
    queryFn: () => fetchUniversityPrograms(universityId, { limit: 120, sort: "-yearOffered" }),
    enabled: Boolean(universityId),
    staleTime: STALE_MS.universityPrograms,
  });
}

export function useUniversityProgramsQuery(universityId: string | undefined) {
  const id = universityId ?? "";
  return useQuery(universityProgramsQueryOptions(id));
}
