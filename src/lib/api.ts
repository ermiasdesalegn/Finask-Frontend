import { emitAuthInvalid } from "./authEvents";
import * as mock from "./mockData";

/** Strip trailing slash; if the value has no scheme, prepend https:// (avoids relative URLs on the frontend origin). */
function normalizeApiBase(raw: string | undefined): string {
  const trimmed = raw?.trim().replace(/\/$/, "") ?? "";
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Local default; production builds fall back to deployed API if VITE_API_URL is unset (e.g. Vercel). */
const API_FALLBACK_DEV = "http://localhost:3000/api/v1";
const API_FALLBACK_PROD = "https://finask.onrender.com/api/v1";

const fromEnv = normalizeApiBase(import.meta.env.VITE_API_URL);

export const API_BASE =
  fromEnv || (import.meta.env.DEV ? API_FALLBACK_DEV : API_FALLBACK_PROD);

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ── Mock router ────────────────────────────────────────────────────────────
function resolveMock<T>(path: string): T | null {
  if (path.startsWith("/home")) return mock.mockHomePage() as T;
  if (path.match(/\/universities\/slug\/(.+)/)) {
    const slug = path.split("/universities/slug/")[1].split("?")[0];
    return mock.mockUniversityBySlug(decodeURIComponent(slug)) as T;
  }
  if (path.match(/\/universities\/[^/]+\/campuses/)) return mock.mockUniversityCampuses() as T;
  {
    const basePath = path.split("?")[0];
    if (
      basePath === "/universities/trending" ||
      path.startsWith("/universities/trending?")
    ) {
      return mock.mockUniversitiesTrending() as T;
    }
    if (
      basePath === "/universities/featured" ||
      path.startsWith("/universities/featured?")
    ) {
      return mock.mockUniversitiesFeatured() as T;
    }
    const topRanked = basePath.match(/^\/universities\/top-(\d+)-ranked$/);
    if (topRanked) {
      return mock.mockUniversitiesTopRanked(Number(topRanked[1])) as T;
    }
    const topRated = basePath.match(/^\/universities\/top-(\d+)-rated$/);
    if (topRated) {
      return mock.mockUniversitiesTopRated(Number(topRated[1])) as T;
    }
  }
  if (path.startsWith("/universities")) return mock.mockUniversitiesList(path) as T;
  if (path.match(/^\/programs\/rare(\?|$)/)) {
    return mock.mockRarePrograms() as T;
  }
  if (path.match(/\/programs\/slug\/([^/?]+)/)) {
    const slug = path.split("/programs/slug/")[1].split("?")[0];
    return mock.mockProgramDetail(decodeURIComponent(slug)) as T;
  }
  if (path.match(/\/programs\/([^/]+)\/universities/)) {
    const programId = path.split("/programs/")[1].split("/universities")[0];
    return mock.mockProgramUniversities(decodeURIComponent(programId)) as T;
  }
  const programOne = path.match(/^\/programs\/([^/?]+)(\?|$)/);
  if (programOne && programOne[1] !== "rare") {
    return mock.mockProgramDetail(decodeURIComponent(programOne[1])) as T;
  }
  if (path.split("?")[0] === "/programs") {
    return mock.mockProgramsList(path) as T;
  }
  if (path.split("?")[0] === "/campuses") {
    return mock.mockCampusesList() as T;
  }
  if (path.match(/\/cities\/slug\/(.+)/)) {
    const slug = path.split("/cities/slug/")[1].split("?")[0];
    return mock.mockCityByIdentifier(decodeURIComponent(slug)) as T;
  }
  const cityOne = path.match(/^\/cities\/([^/?]+)$/);
  if (cityOne) {
    return mock.mockCityByIdentifier(decodeURIComponent(cityOne[1])) as T;
  }
  if (path.startsWith("/cities")) return mock.mockCitiesList() as T;
  if (path.startsWith("/search")) {
    const q = new URLSearchParams(path.split("?")[1] ?? "").get("q") ?? "";
    return mock.mockSearch(q) as T;
  }
  if (path.split("?")[0] === "/favorites") {
    return {
      status: "success",
      results: 0,
      data: { favorites: [] },
    } as T;
  }
  return null;
}
// ──────────────────────────────────────────────────────────────────────────

let toastNotifier: ((message: string) => void) | null = null;

export function setApiToastNotifier(
  fn: ((message: string) => void) | null
): void {
  toastNotifier = fn;
}

function notifyNetwork(message: string): void {
  toastNotifier?.(message);
}

function joinUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiGet<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  if (USE_MOCK) {
    const result = resolveMock<T>(path);
    if (result !== null) return Promise.resolve(result);
  }

  let res: Response;
  try {
    res = await fetch(joinUrl(path), {
      ...init,
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(init?.headers as Record<string, string>),
      },
    });
  } catch {
    notifyNetwork("Network error. Check your connection and try again.");
    throw new ApiError("Network error", 0, null);
  }

  const body = await parseJsonSafe(res);

  if (res.status === 401) {
    emitAuthInvalid();
  }

  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: string }).message)
        : res.statusText;
    throw new ApiError(msg || "Request failed", res.status, body);
  }

  return body as T;
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown,
  init?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const { skipAuth, ...rest } = init || {};
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };

  let res: Response;
  try {
    res = await fetch(joinUrl(path), {
      ...rest,
      credentials: "include",
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    notifyNetwork("Network error. Check your connection and try again.");
    throw new ApiError("Network error", 0, null);
  }

  const parsed = await parseJsonSafe(res);

  if (res.status === 401 && !skipAuth) {
    emitAuthInvalid();
  }

  if (!res.ok) {
    const msg =
      typeof parsed === "object" && parsed !== null && "message" in parsed
        ? String((parsed as { message: string }).message)
        : res.statusText;
    throw new ApiError(msg || "Request failed", res.status, parsed);
  }

  return parsed as T;
}

export async function apiDelete<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  if (USE_MOCK && /^\/favorites\//.test(path.split("?")[0] ?? "")) {
    return {} as T;
  }

  let res: Response;
  try {
    res = await fetch(joinUrl(path), {
      ...init,
      credentials: "include",
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(init?.headers as Record<string, string>),
      },
    });
  } catch {
    notifyNetwork("Network error. Check your connection and try again.");
    throw new ApiError("Network error", 0, null);
  }

  const body = await parseJsonSafe(res);

  if (res.status === 401) {
    emitAuthInvalid();
  }

  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: string }).message)
        : res.statusText;
    throw new ApiError(msg || "Request failed", res.status, body);
  }

  return (body ?? {}) as T;
}
