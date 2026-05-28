/** Where unauthenticated users are sent when hitting a protected route. */
export const AUTH_LOGIN_PATH = "/login";

/** Default destination after sign-in (when no return URL). */
export const AUTH_DEFAULT_APP_PATH = "/discover";

/** Where signed-in users are sent from guest-only entry routes. */
export const AUTH_HOME_PATH = "/";

/** Paths that require a signed-in session. */
export const PROTECTED_PATH_PREFIXES = [
  "/favorites",
  "/account",
  "/chat",
  "/settings",
  "/me",
  "/compare",
] as const;

/** Paths only for guests (signed-in users are redirected away). */
export const GUEST_ONLY_PATH_PREFIXES = ["/login", "/forgot-password"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
