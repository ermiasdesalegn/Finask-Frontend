import { apiGet } from "../api";

export type SearchUniversity = {
  _id: string;
  name: string;
  slug: string;
  coverImage?: string;
  address?: { city?: string };
  score?: number;
};

export type SearchResults = {
  universities: SearchUniversity[];
  programs: { _id: string; name: string; slug: string; field: string }[];
  cities: { _id: string; name: string; slug: string; coverImage?: string; score?: number }[];
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
