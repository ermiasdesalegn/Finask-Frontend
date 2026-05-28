import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AUTH_LOGIN_PATH } from "../../lib/authRoutes";
import AuthLoadingGate from "./AuthLoadingGate";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * Blocks guests and sends them to `/login` with return state.
 * Waits for session bootstrap before deciding.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, sessionStatus } = useAuth();
  const location = useLocation();

  if (sessionStatus === "loading") {
    return <AuthLoadingGate message="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={AUTH_LOGIN_PATH} replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
}
