import { emitAuthInvalid } from "./authEvents";

const TOKEN_KEY = "token";

export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

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
