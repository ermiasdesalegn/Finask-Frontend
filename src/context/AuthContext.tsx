import { useQueryClient } from "@tanstack/react-query";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { apiGet, apiPost, clearToken, getToken, saveToken } from "../lib/api";
import { subscribeAuthInvalid } from "../lib/authEvents";
import { queryKeys } from "../lib/queryKeys";

/**
 * Session: httpOnly `jwt` cookie on the API host (not localStorage). After refresh,
 * GET /users/getMe with credentials must receive that cookie. If the SPA and API
 * are different sites, the API needs JWT_COOKIE_SAMESITE=none (HTTPS) — see backend config.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_USER: AuthUser = {
  _id: "mock-user-001",
  email: "demo@finask.et",
  firstName: "Demo",
  lastName: "User",
  role: "user",
};

export type AuthSessionStatus = "loading" | "ready";

export interface AuthUser {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role?: string;
  fieldsOfInterest?: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  sessionStatus: AuthSessionStatus;
  isAuthenticated: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type GetMeResponse = { status: string; data?: { user: AuthUser } };
type AuthResponse = { status: string; token?: string; data?: { user: AuthUser } };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [sessionStatus, setSessionStatus] = useState<AuthSessionStatus>(() =>
    USE_MOCK ? "ready" : "loading"
  );
  const [user, setUser] = useState<AuthUser | null>(() =>
    USE_MOCK ? MOCK_USER : null
  );

  useEffect(() => {
    if (USE_MOCK) return;

    // If no token in storage, skip the getMe call — user is definitely not logged in
    if (!getToken()) {
      setSessionStatus("ready");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await apiGet<GetMeResponse>("/users/getMe");
        if (!cancelled && res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        // Token invalid or expired — clear it
        clearToken();
      } finally {
        if (!cancelled) setSessionStatus("ready");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    (newUser: AuthUser, token?: string) => {
      if (token) saveToken(token);
      setUser(newUser);
      void queryClient.invalidateQueries();
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    if (!USE_MOCK && user) {
      try {
        await apiPost("/users/signout", {});
      } catch {
        // still clear local session
      }
    }
    clearToken();
    setUser(null);
    void queryClient.invalidateQueries();
    void queryClient.removeQueries({ queryKey: queryKeys.favorites() });
  }, [user, queryClient]);

  useEffect(() => {
    return subscribeAuthInvalid(() => {
      clearToken();
      setUser(null);
      void queryClient.invalidateQueries();
      void queryClient.removeQueries({ queryKey: queryKeys.favorites() });
    });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      sessionStatus,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, sessionStatus, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
