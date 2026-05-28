import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLoginModal } from "../../context/LoginModalContext";
import AuthLoadingGate from "../routing/AuthLoadingGate";

type AuthRequiredSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const DEFAULT_TITLE = "Sign in to see personalized recommendations";
const DEFAULT_DESCRIPTION =
  "Sign in to see recommended universities matched to your profile.";

/**
 * Renders children only for signed-in users; guests see a sign-in prompt.
 */
export default function AuthRequiredSection({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  children,
}: AuthRequiredSectionProps) {
  const { isAuthenticated, sessionStatus } = useAuth();
  const { openLogin, openSignUp } = useLoginModal();

  if (sessionStatus === "loading") {
    return <AuthLoadingGate message="Loading…" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 p-6 text-center dark:bg-brand-blue/10">
        <p className="text-sm font-black text-slate-900 dark:text-white">{title}</p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openLogin()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-black text-white"
          >
            <LogIn size={16} />
            Log in
          </button>
          <button
            type="button"
            onClick={() => openSignUp()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-black transition-all hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            <UserPlus size={16} />
            Sign up
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
