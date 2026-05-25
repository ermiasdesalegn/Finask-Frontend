/** Minimal types for Google Identity Services (GIS) loaded from CDN. */
type GoogleCredentialResponse = { credential?: string };

type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: string;
      theme?: string;
      size?: string;
      text?: string;
      width?: number;
    }
  ) => void;
  prompt: () => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } };
  }
}

let scriptPromise: Promise<void> | null = null;
let callbackRef: ((credential: string) => void) | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google script failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function getGoogleClientId(): string | undefined {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  return id || undefined;
}

/** Initialize GIS once; callback may be updated on each call. */
export async function ensureGoogleIdentity(
  onCredential: (credential: string) => void
): Promise<boolean> {
  const clientId = getGoogleClientId();
  if (!clientId) return false;

  callbackRef = onCredential;
  await loadGoogleScript();

  const idApi = window.google?.accounts?.id;
  if (!idApi) return false;

  idApi.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response.credential && callbackRef) {
        callbackRef(response.credential);
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  return true;
}

/** Opens Google account picker via a temporary GIS button (works with custom UI). */
export async function triggerGoogleSignIn(): Promise<void> {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("Google Sign-In is not configured (missing VITE_GOOGLE_CLIENT_ID).");
  }

  await loadGoogleScript();
  const idApi = window.google?.accounts?.id;
  if (!idApi) throw new Error("Google Sign-In failed to initialize.");

  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
  document.body.appendChild(host);

  idApi.renderButton(host, { type: "standard", theme: "outline", size: "large" });

  await new Promise((r) => setTimeout(r, 80));

  const btn =
    host.querySelector<HTMLElement>('[role="button"]') ??
    host.querySelector<HTMLElement>("div");

  if (!btn) {
    host.remove();
    throw new Error("Could not open Google Sign-In.");
  }

  btn.click();
  window.setTimeout(() => host.remove(), 30_000);
}
