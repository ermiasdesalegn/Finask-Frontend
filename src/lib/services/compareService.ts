import { apiPost } from "../api";
import type { CompareApiPreferences } from "../comparePreferences";
import type { CompareUniversitiesApiResponse } from "../../types";

export type CompareRequestBody = {
  universityIds: string[];
  userCoordinates?: { lat: number; lng: number };
  preferences?: CompareApiPreferences;
};

/**
 * POST /universities/compare
 * Body: { universityIds: 2–3 Mongo ids, userCoordinates?, preferences? }
 * Response: universities (columns), comparisonFacts (rows keyed by abbreviation), aiSummary
 */
export function fetchUniversitiesCompare(
  body: CompareRequestBody
): Promise<CompareUniversitiesApiResponse> {
  return apiPost<CompareUniversitiesApiResponse>("/universities/compare", {
    universityIds: body.universityIds,
    ...(body.userCoordinates
      ? { userCoordinates: body.userCoordinates }
      : {}),
    ...(body.preferences ? { preferences: body.preferences } : {}),
  });
}
