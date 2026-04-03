import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiPost } from "../lib/api";
import { subscribeAuthInvalid } from "../lib/authEvents";
import { queryKeys } from "../lib/queryKeys";

const TOKEN_KEY = "token";

export interface AuthUser {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (newToken: string, newUser: AuthUser) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      void queryClient.invalidateQueries({ queryKey: queryKeys.homeRoot });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    if (localStorage.getItem(TOKEN_KEY)) {
      try {
        await apiPost("/users/signout", {});
      } catch {
        // still clear local session
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    void queryClient.invalidateQueries({ queryKey: queryKeys.homeRoot });
  }, [queryClient]);

  useEffect(() => {
    return subscribeAuthInvalid(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.homeRoot });
    });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, login, logout]
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
