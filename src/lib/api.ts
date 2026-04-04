import { emitAuthInvalid } from "./authEvents";
import * as mock from "./mockData";

const TOKEN_KEY = "token";

export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api/v1";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ── Mock router ────────────────────────────────────────────────────────────
function resolveMock<T>(path: string): T | null {
  if (path.startsWith("/home")) return mock.mockHomePage() as T;
  if (path.match(/\/universities\/slug\/(.+)/)) {
    const slug = path.split("/universities/slug/")[1].split("?")[0];
    return mock.mockUniversityBySlug(decodeURIComponent(slug)) as T;
  }
  if (path.match(/\/universities\/[^/]+\/campuses/)) return mock.mockUniversityCampuses() as T;
  if (path.startsWith("/universities")) return mock.mockUniversitiesList() as T;
  if (path.match(/\/programs\/([^/]+)\/universities/)) {
    const programId = path.split("/programs/")[1].split("/universities")[0];
    return mock.mockProgramUniversities(decodeURIComponent(programId)) as T;
  }
  if (path.startsWith("/programs")) return mock.mockProgramsList() as T;
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

function authHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
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
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeader(),
        ...(init?.headers as Record<string, string>),
      },
    });
  } catch {
    notifyNetwork("Network error. Check your connection and try again.");
    throw new ApiError("Network error", 0, null);
  }

  const body = await parseJsonSafe(res);

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
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
  if (!skipAuth) Object.assign(headers, authHeader());

  let res: Response;
  try {
    res = await fetch(joinUrl(path), {
      ...rest,
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
    localStorage.removeItem(TOKEN_KEY);
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
