import { apiGet } from "../api";
import type { HomeApiResponse } from "../../types";

/** GET /api/v1/home — session cookie (optional) for personalized sections */
export async function fetchHomePage(): Promise<HomeApiResponse> {
  return apiGet<HomeApiResponse>("/home");
}
