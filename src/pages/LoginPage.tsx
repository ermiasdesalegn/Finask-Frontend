import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { AUTH_DEFAULT_APP_PATH } from "../lib/authRoutes";

type LoginLocationState = {
  from?: { pathname?: string; search?: string; hash?: string };
};

export default function LoginPage() {
  const { isAuthenticated, sessionStatus } = useAuth();
  const { openLogin, openSignUp } = useLoginModal();
  const location = useLocation();
  const navigate = useNavigate();
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (sessionStatus !== "ready") return;

    if (isAuthenticated) {
      const from = (location.state as LoginLocationState | null)?.from;
      const pathname = from?.pathname;
      const dest =
        pathname && pathname !== "/login"
          ? `${pathname}${from.search ?? ""}${from.hash ?? ""}`
          : AUTH_DEFAULT_APP_PATH;
      navigate(dest, { replace: true });
      return;
    }

    if (!autoOpenedRef.current) {
      autoOpenedRef.current = true;
      openLogin();
    }
  }, [
    sessionStatus,
    isAuthenticated,
    location.state,
    navigate,
    openLogin,
  ]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Checking your session…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">
        Sign in to continue
      </h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
        Access your favorites, personalized picks, and account settings.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => openLogin()}
          className="rounded-2xl bg-brand-blue px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/25 hover:bg-blue-700"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => openSignUp()}
          className="rounded-2xl border border-slate-200 px-8 py-3 text-sm font-bold text-slate-800 dark:border-white/10 dark:text-white"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
