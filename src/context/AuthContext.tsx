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
import { userHasFieldsOfInterest } from "../lib/userProfile";
import type { University } from "../types";

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
  bio?: string;
  profileImage?: string;
  role?: string;
  /** University this user manages (university_manager). */
  managedUniversity?: string | University | null;
  /** Program ObjectIds (or populated Program docs from getMe). */
  fieldsOfInterest?: string[] | { _id: string }[];
  /** Hobby tag names from Interest catalog (lowercase). */
  interests?: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  sessionStatus: AuthSessionStatus;
  isAuthenticated: boolean;
  /** Signed in but missing required fieldsOfInterest */
  needsFieldsOfInterest: boolean;
  profileComplete: boolean;
  /** Saves token and reloads the user from GET /users/getMe (source of truth for fieldsOfInterest). */
  login: (user: AuthUser, token?: string) => Promise<void>;
  updateUser: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
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
    // Attempt to fetch current user. We do this regardless of a stored
    // local token so sessions that rely on httpOnly cookies (common for
    // Google sign-in) are detected and the app can prompt for missing
    // required fields like `fieldsOfInterest`.
    let cancelled = false;

    (async () => {
      try {
        const res = await apiGet<GetMeResponse>("/users/getMe");
        if (!cancelled && res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        // No active session or token invalid/expired — clear any local token
        // (safe even if none exists) and continue.
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
    async (newUser: AuthUser, token?: string) => {
      if (token) saveToken(token);
      try {
        const res = await apiGet<GetMeResponse>("/users/getMe");
        setUser(res.data?.user ?? newUser);
      } catch {
        setUser(newUser);
      }
      void queryClient.invalidateQueries();
    },
    [queryClient]
  );

  const refreshUser = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      const res = await apiGet<GetMeResponse>("/users/getMe");
      if (res.data?.user) setUser(res.data.user);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  const updateUser = useCallback(
    (next: AuthUser) => {
      setUser(next);
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

  const value = useMemo(() => {
    const isAuthenticated = Boolean(user);
    const profileComplete = isAuthenticated && userHasFieldsOfInterest(user);
    return {
      user,
      sessionStatus,
      isAuthenticated,
      needsFieldsOfInterest: isAuthenticated && !userHasFieldsOfInterest(user),
      profileComplete,
      login,
      updateUser,
      refreshUser,
      logout,
    };
  }, [user, sessionStatus, login, updateUser, refreshUser, logout]);

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
