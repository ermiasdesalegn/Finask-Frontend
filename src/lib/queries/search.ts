import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "../services/searchService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function searchQueryOptions(q: string, limit?: number) {
  const trimmed = q.trim();
  return queryOptions({
    queryKey: queryKeys.search(trimmed, limit),
    queryFn: () => fetchSearchResults(trimmed, { limit }),
    enabled: trimmed.length > 0,
    staleTime: STALE_MS.list,
  });
}

/** Debounce `q` in the parent before passing in, or use a small enabled threshold */
export function useSearchQuery(q: string, limit?: number) {
  return useQuery(searchQueryOptions(q, limit));
}
