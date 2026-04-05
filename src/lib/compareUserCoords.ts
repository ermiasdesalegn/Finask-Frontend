const SESSION_KEY = "finask_compare_user_coords";

export type CompareUserCoords = { lat: number; lng: number };

export function loadCompareUserCoords(): CompareUserCoords | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { lat?: unknown; lng?: unknown };
    const lat = Number(o.lat);
    const lng = Number(o.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

export function saveCompareUserCoords(c: CompareUserCoords): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(c));
}

export function clearCompareUserCoords(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
