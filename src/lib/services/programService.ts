import { apiGet } from "../api";
import type {
  ProgramsListResponse,
  UniversityProgramsForProgramResponse,
} from "../../types";

export async function fetchProgramsList(options?: {
  limit?: number;
  sort?: string;
}): Promise<ProgramsListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 500));
  params.set("sort", options?.sort ?? "name");
  return apiGet<ProgramsListResponse>(`/programs?${params.toString()}`);
}

/** GET /api/v1/programs/:programId/universities */
export async function fetchUniversitiesForProgram(
  programId: string,
  options?: { limit?: number }
): Promise<UniversityProgramsForProgramResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 50));
  return apiGet<UniversityProgramsForProgramResponse>(
    `/programs/${encodeURIComponent(programId)}/universities?${params.toString()}`
  );
}
