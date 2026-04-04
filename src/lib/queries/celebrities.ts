import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  fetchCelebritiesList,
  fetchCelebrityDetail,
  type CelebritiesListFilters,
} from "../services/celebrityService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function celebritiesListQueryOptions(filters: CelebritiesListFilters) {
  return queryOptions({
    queryKey: queryKeys.celebritiesList(filters),
    queryFn: () => fetchCelebritiesList(filters),
    staleTime: STALE_MS.celebritiesList,
  });
}

export function useCelebritiesListQuery(
  filters: CelebritiesListFilters = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...celebritiesListQueryOptions(filters),
    enabled: options?.enabled !== false,
  });
}

const PENDING_KEY = "__pending__";

export function celebrityDetailQueryOptions(slugOrId: string) {
  const trimmed = slugOrId.trim();
  const cacheKey = trimmed || PENDING_KEY;
  return queryOptions({
    queryKey: queryKeys.celebrityDetail(cacheKey),
    queryFn: () => fetchCelebrityDetail(trimmed),
    staleTime: STALE_MS.celebrityDetail,
    enabled: trimmed.length > 0,
  });
}

export function useCelebrityDetailQuery(slugOrId: string | undefined) {
  const key = slugOrId?.trim() ?? "";
  return useQuery({
    ...celebrityDetailQueryOptions(key),
    enabled: key.length > 0,
  });
}
