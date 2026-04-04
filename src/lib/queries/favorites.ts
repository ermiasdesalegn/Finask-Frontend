import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { STALE_MS } from "./staleTimes";
import {
  createFavorite,
  deleteFavorite,
  fetchFavorites,
} from "../services/favoriteService";

export function favoritesQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.favorites(),
    queryFn: fetchFavorites,
    staleTime: STALE_MS.favorites,
    enabled,
  });
}

export function useFavoritesQuery(enabled: boolean) {
  return useQuery(favoritesQueryOptions(enabled));
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
    },
  });
}

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favorites() });
    },
  });
}
