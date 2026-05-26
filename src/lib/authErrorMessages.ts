const GOOGLE_CONFIG_PATTERNS = [
  /vite_google_client_id/i,
  /google sign-in is not configured/i,
  /missing.*google.*client/i,
];

/** Shown when Google OAuth is not set up in the deployment. */
export const GOOGLE_SIGN_IN_UNAVAILABLE =
  "Google sign-in isn't available right now. Please use your email and password, or try again later.";

export function isGoogleConfigurationError(message: string): boolean {
  return GOOGLE_CONFIG_PATTERNS.some((p) => p.test(message));
}

const GOOGLE_ERROR_CODES: Record<string, string> = {
  GOOGLE_SIGN_IN_UNAVAILABLE: GOOGLE_SIGN_IN_UNAVAILABLE,
  GOOGLE_SIGN_IN_PROMPT_FAILED:
    "Google sign-in didn't open. Please try again, or sign in with your email and password.",
};

export function formatGoogleSignInError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "";

  if (raw && GOOGLE_ERROR_CODES[raw]) {
    return GOOGLE_ERROR_CODES[raw];
  }

  if (!raw || isGoogleConfigurationError(raw)) {
    return GOOGLE_SIGN_IN_UNAVAILABLE;
  }

  const lower = raw.toLowerCase();

  if (lower.includes("failed to load") || lower.includes("script failed")) {
    return "We couldn't load Google sign-in. Check your connection and try again, or use email and password.";
  }

  if (lower.includes("failed to initialize") || lower.includes("could not open")) {
    return "Google sign-in didn't open. Please try again, or sign in with your email and password.";
  }

  if (lower.includes("popup") || lower.includes("closed")) {
    return "Google sign-in was cancelled. Try again when you're ready.";
  }

  if (lower.includes("network") || lower.includes("fetch")) {
    return "Connection problem. Check your internet and try again.";
  }

  return raw.length > 120
    ? "Google sign-in failed. Please try again or use email and password."
    : raw;
}

function errorStatus(err: unknown): number {
  if (err && typeof err === "object" && "status" in err) {
    const s = Number((err as { status: number }).status);
    return Number.isFinite(s) ? s : 0;
  }
  return 0;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message.trim();
  if (typeof err === "string") return err.trim();
  return "";
}

export function formatLoginError(err: unknown): string {
  const status = errorStatus(err);
  const msg = errorMessage(err);
  const lower = msg.toLowerCase();

  if (status === 0 && lower.includes("network")) {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  if (lower.includes("not verified")) {
    return "Your email isn't verified yet. Check your inbox for the 6-digit code, or create an account again.";
  }

  if (lower.includes("deactivated")) {
    return msg || "This account is deactivated. Contact support for help.";
  }

  if (
    status === 401 ||
    lower.includes("invalid credentials") ||
    lower.includes("incorrect") ||
    lower.includes("unauthorized")
  ) {
    return "That email or password doesn't match our records. Try again or use Forgot password.";
  }

  if (msg) return msg;
  return "We couldn't sign you in. Check your email and password.";
}

export function formatAuthApiError(err: unknown, fallback: string): string {
  const msg = errorMessage(err) || fallback;
  if (isGoogleConfigurationError(msg)) {
    return GOOGLE_SIGN_IN_UNAVAILABLE;
  }
  return msg;
}
