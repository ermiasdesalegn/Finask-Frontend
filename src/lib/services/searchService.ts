import { apiGet } from "../api";

/** GET /api/v1/search?q= — multi-model autocomplete */
export type SearchResults = {
  universities: unknown[];
  programs: unknown[];
  cities: unknown[];
};

export async function fetchSearchResults(
  q: string,
  options?: { limit?: number }
): Promise<{ status: string; data: SearchResults }> {
  const params = new URLSearchParams();
  params.set("q", q);
  if (options?.limit != null) params.set("limit", String(options.limit));
  return apiGet<{ status: string; data: SearchResults }>(
    `/search?${params.toString()}`
  );
}
