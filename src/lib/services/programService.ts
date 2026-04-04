import { apiGet } from "../api";
import { unwrapMarkdownLink } from "../unwrapMarkdownLink";
import type {
  Program,
  ProgramDetailResponse,
  ProgramsListResponse,
  RareProgramsResponse,
  University,
  UniversityProgramOffering,
  UniversityProgramsForProgramResponse,
} from "../../types";

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export type ProgramsListFilters = {
  limit?: number;
  sort?: string;
  /** Backend query filter: `?field=technologyit` */
  field?: string | null;
  /**
   * Optional field projection, e.g. `name,slug,field,duration,ratingsAverage`
   * (see GET /programs docs). Omit for full documents.
   */
  fields?: string | null;
};

type LooseProgramsList = {
  status: string;
  results?: number;
  data?: { programs?: Program[]; docs?: Program[] };
};

function normalizeProgramsListResponse(
  res: LooseProgramsList
): ProgramsListResponse {
  const programs =
    res.data?.programs ??
    (Array.isArray(res.data?.docs) ? res.data!.docs! : []);
  return {
    status: res.status,
    results: res.results ?? programs.length,
    data: { programs },
  };
}

export async function fetchProgramsList(
  filters: ProgramsListFilters = {}
): Promise<ProgramsListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit ?? 500));
  params.set("sort", filters.sort ?? "name");
  if (filters.field?.trim()) {
    params.set("field", filters.field.trim());
  }
  if (filters.fields?.trim()) {
    params.set("fields", filters.fields.trim());
  }
  const res = await apiGet<LooseProgramsList>(
    `/programs?${params.toString()}`
  );
  return normalizeProgramsListResponse(res);
}

/** GET /api/v1/programs/rare — backend returns `data.docs` (optional `?limit=`). */
export async function fetchRarePrograms(options?: {
  limit?: number;
}): Promise<Program[]> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 80));
  const res = await apiGet<
    RareProgramsResponse & { data?: { docs?: Program[]; data?: Program[] } }
  >(`/programs/rare?${params.toString()}`);
  const d = res.data;
  if (!d) return [];
  if (Array.isArray(d.docs)) return d.docs;
  if (Array.isArray(d.data)) return d.data;
  return [];
}

/** Some backends nest as `data.data.program` instead of `data.program`. */
type ProgramDetailPayload = ProgramDetailResponse & {
  data?: ProgramDetailResponse["data"] & { data?: { program?: Program } };
};

function pickProgramFromDetailPayload(res: ProgramDetailPayload): Program | null {
  const d = res.data;
  if (!d) return null;
  return d.program ?? d.data?.program ?? null;
}

function normalizeUniversityMedia(u: University): University {
  const coverImage = unwrapMarkdownLink(u.coverImage) || undefined;
  const wikipediaLink = unwrapMarkdownLink(u.wikipediaLink) || undefined;
  let images: string[] | undefined;
  if (Array.isArray(u.images)) {
    const next = u.images.map((x) => unwrapMarkdownLink(x)).filter(Boolean);
    images = next.length ? next : undefined;
  }
  return { ...u, coverImage, wikipediaLink, images };
}

/** `university` may be an ObjectId string; nested program may use markdown URLs. */
function coalesceUniversityRef(
  u: string | University | undefined | null
): University | null {
  if (u == null) return null;
  if (typeof u === "string") {
    const id = u.trim();
    if (!id) return null;
    return { _id: id, name: "University", slug: id };
  }
  const id = u._id?.trim() || u.id?.trim();
  const slug = u.slug?.trim() || id || "";
  if (!slug && !id) return null;
  const name = u.name?.trim() || "University";
  return normalizeUniversityMedia({
    ...u,
    name,
    slug: slug || id || "",
  });
}

function normalizeNestedProgramInOffering(p: Program | string | undefined): Program | string | undefined {
  if (p == null || typeof p === "string") return p;
  const coverImage = unwrapMarkdownLink(p.coverImage) || undefined;
  const images =
    p.images == null
      ? undefined
      : p.images.map((x) => unwrapMarkdownLink(x)).filter(Boolean);
  return {
    ...p,
    coverImage,
    ...(images !== undefined ? { images: images.length ? images : undefined } : {}),
  };
}

function normalizeUniversityProgramRows(
  rows: UniversityProgramOffering[]
): UniversityProgramOffering[] {
  return rows
    .map((row) => {
      const university = coalesceUniversityRef(
        row.university as string | University | undefined
      );
      if (!university) return { ...row, university: undefined };
      return {
        ...row,
        university,
        program: normalizeNestedProgramInOffering(
          row.program as Program | string | undefined
        ),
      };
    })
    .filter((row): row is UniversityProgramOffering & { university: University } =>
      Boolean(row.university)
    );
}

/** Normalize GET /programs/:id and GET /programs/slug/:slug payloads for the client. */
export function normalizeProgramDetailProgram(p: Program): Program {
  const coverImage = unwrapMarkdownLink(p.coverImage) || undefined;
  const wikipediaLink = unwrapMarkdownLink(p.wikipediaLink) || undefined;
  const images =
    p.images == null
      ? undefined
      : p.images.map((x) => unwrapMarkdownLink(x)).filter(Boolean);
  const universityOfferings = p.universityOfferings
    ?.map((o) => {
      const university = coalesceUniversityRef(
        o.university as string | University | undefined
      );
      if (!university) return null;
      return {
        ...o,
        university: normalizeUniversityMedia(university),
      };
    })
    .filter((o): o is NonNullable<typeof o> => o != null);
  return {
    ...p,
    coverImage,
    wikipediaLink,
    ...(images !== undefined ? { images: images.length ? images : undefined } : {}),
    universityOfferings,
  };
}

function programFromDetailResponse(res: ProgramDetailPayload): Program {
  const p = pickProgramFromDetailPayload(res);
  if (!p) throw new Error("Program not found.");
  return normalizeProgramDetailProgram(p);
}

/**
 * Slug: GET /programs/slug/:slug
 * Mongo id: GET /programs/:id
 */
export async function fetchProgramDetail(slugOrId: string): Promise<Program> {
  const param = slugOrId.trim();
  if (MONGO_OBJECT_ID_RE.test(param)) {
    const res = await apiGet<ProgramDetailPayload>(
      `/programs/${encodeURIComponent(param)}`
    );
    return programFromDetailResponse(res);
  }
  const res = await apiGet<ProgramDetailPayload>(
    `/programs/slug/${encodeURIComponent(param)}`
  );
  return programFromDetailResponse(res);
}

/** GET /api/v1/programs/:programId/universities */
export async function fetchUniversitiesForProgram(
  programId: string,
  options?: { limit?: number }
): Promise<UniversityProgramsForProgramResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 50));
  const raw = await apiGet<UniversityProgramsForProgramResponse>(
    `/programs/${encodeURIComponent(programId)}/universities?${params.toString()}`
  );
  const rows = raw.data?.universityprograms ?? [];
  const universityprograms = normalizeUniversityProgramRows(rows);
  return {
    ...raw,
    results: raw.results ?? universityprograms.length,
    data: { universityprograms },
  };
}
