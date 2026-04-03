import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchHomePage } from "../services/homeService";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";

export function homeQueryOptions(tokenFingerprint: string) {
  return queryOptions({
    queryKey: queryKeys.home(tokenFingerprint),
    queryFn: fetchHomePage,
    staleTime: STALE_MS.home,
  });
}

export function useHomePageQuery(tokenFingerprint: string) {
  return useQuery(homeQueryOptions(tokenFingerprint));
}
