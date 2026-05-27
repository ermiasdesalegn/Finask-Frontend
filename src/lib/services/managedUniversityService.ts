import { apiGet } from "../api";
import type { University } from "../../types";

type ManagedUniversityResponse = {
  status: string;
  data: { managedUniversity: University | null };
};

export async function fetchMyManagedUniversity(): Promise<University | null> {
  const res = await apiGet<ManagedUniversityResponse>(
    "/users/me/managedUniversity"
  );
  return res.data?.managedUniversity ?? null;
}
