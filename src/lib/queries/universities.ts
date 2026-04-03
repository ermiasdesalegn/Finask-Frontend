import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UniversitiesListFilters } from "../services/universityService";
import {
  fetchUniversitiesList,
  fetchUniversityBySlug,
  fetchUniversityCampuses,
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

export function useUniversitiesListQuery(filters: UniversitiesListFilters) {
  return useQuery(universitiesListQueryOptions(filters));
}

const PENDING_KEY = "__pending__";

export function universityBySlugQueryOptions(slug: string) {
  const keySlug = slug.trim() || PENDING_KEY;
  return queryOptions({
    queryKey: queryKeys.universityBySlug(keySlug),
    queryFn: () => fetchUniversityBySlug(slug),
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
