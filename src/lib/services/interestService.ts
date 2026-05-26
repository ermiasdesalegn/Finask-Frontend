import { apiGet } from "../api";

/** Category label → hobby names (lowercase, as stored in DB). */
export type InterestCatalog = Record<string, string[]>;

type InterestsResponse = {
  status: string;
  data?: { interests?: InterestCatalog };
};

/** GET /api/v1/interests — auth required; catalog for user.interests picker. */
export async function fetchInterestCatalog(): Promise<InterestCatalog> {
  const res = await apiGet<InterestsResponse>("/interests");
  return res.data?.interests ?? {};
}
