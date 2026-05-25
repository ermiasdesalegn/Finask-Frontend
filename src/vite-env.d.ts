/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Set to `"true"` to use Vite’s `/api/v1` proxy on :5173 (cookies with remote API). */
  readonly VITE_DEV_API_PROXY?: string;
  /** Google OAuth 2.0 Web client ID (same as API GOOGLE_CLIENT_ID). */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
