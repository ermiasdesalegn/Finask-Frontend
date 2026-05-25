import { apiGet } from "../api";

export type GroupedInterests = Record<string, string[]>;

type InterestsResponse = {
  status: string;
  data?: { interests?: GroupedInterests };
};

export async function fetchInterests(): Promise<GroupedInterests> {
  const res = await apiGet<InterestsResponse>("/interests");
  return res.data?.interests ?? {};
}
