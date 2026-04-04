import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    // Retrying 429/4xx makes rate limits and auth errors worse
    if (error.status === 429) return false;
    if (error.status >= 400 && error.status < 500) return false;
  }
  return failureCount < 1;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: false,
      },
    },
  });
}
