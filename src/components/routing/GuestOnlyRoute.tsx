import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AUTH_HOME_PATH } from "../../lib/authRoutes";
import AuthLoadingGate from "./AuthLoadingGate";

type GuestOnlyRouteProps = {
  children: React.ReactNode;
};

/**
 * For landing/login entry points — signed-in users go to the main app.
 */
export default function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated, sessionStatus } = useAuth();

  if (sessionStatus === "loading") {
    return <AuthLoadingGate />;
  }

  if (isAuthenticated) {
    return <Navigate to={AUTH_HOME_PATH} replace />;
  }

  return <>{children}</>;
}
