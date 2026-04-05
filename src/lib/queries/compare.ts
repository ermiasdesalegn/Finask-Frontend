import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { fetchUniversitiesCompare } from "../services/compareService";
import { STALE_MS } from "./staleTimes";

export type UseUniversitiesCompareArgs = {
  /** 2–3 ids in display order (backend preserves this order) */
  universityIds: string[];
  userCoordinates: { lat: number; lng: number } | null;
  enabled?: boolean;
};

export function useUniversitiesCompareQuery({
  universityIds,
  userCoordinates,
  enabled = true,
}: UseUniversitiesCompareArgs) {
  const idsKey = universityIds.join(",");
  const lat = userCoordinates?.lat ?? null;
  const lng = userCoordinates?.lng ?? null;

  return useQuery({
    queryKey: queryKeys.universitiesCompare(idsKey, lat, lng),
    queryFn: () =>
      fetchUniversitiesCompare({
        universityIds,
        ...(userCoordinates
          ? { userCoordinates: userCoordinates }
          : {}),
      }),
    enabled:
      enabled &&
      universityIds.length >= 2 &&
      universityIds.length <= 3,
    staleTime: STALE_MS.universitiesCompare,
  });
}
