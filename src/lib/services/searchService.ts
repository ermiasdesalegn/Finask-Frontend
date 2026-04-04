import type { University } from "../../types";
import { apiGet } from "../api";

/** Minimal shape returned by Atlas Search projection for universities */
export type SearchUniversity = Pick<University, "name" | "slug" | "coverImage"> & {
  "address.city"?: string;
};

export type SearchResults = {
  universities: SearchUniversity[];
  programs: { _id: string; name: string; slug: string; field: string }[];
  cities: { _id: string; name: string; slug: string; coverImage?: string }[];
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
