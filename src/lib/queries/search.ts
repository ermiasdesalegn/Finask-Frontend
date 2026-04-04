import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { fetchSearchResults } from "../services/searchService";
import { STALE_MS } from "./staleTimes";

export function searchQueryOptions(q: string, limit?: number) {
  const trimmed = q.trim();
  return queryOptions({
    queryKey: queryKeys.search(trimmed, limit),
    queryFn: () => fetchSearchResults(trimmed, { limit }),
    // Only fire when at least 2 chars — avoids hammering Atlas Search on every keystroke
    enabled: trimmed.length >= 2,
    staleTime: STALE_MS.list,
  });
}

/** Debounce `q` in the parent before passing in, or use a small enabled threshold */
export function useSearchQuery(q: string, limit?: number) {
  return useQuery(searchQueryOptions(q, limit));
}
