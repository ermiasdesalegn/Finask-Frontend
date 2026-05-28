import { GitCompare, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCompare } from "../../context/CompareContext";
import { AUTH_LOGIN_PATH } from "../../lib/authRoutes";
import { comparePathFromUniversityIds } from "../../lib/compareQueue";

/** Slim bar when exactly two schools are queued for compare. */
export default function CompareBar() {
  const { ids, clear } = useCompare();
  const { isAuthenticated, sessionStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (ids.length !== 2) return null;

  const compareHref = comparePathFromUniversityIds(ids);
  const authReady = sessionStatus === "ready";

  const handleCompare = () => {
    if (authReady && !isAuthenticated) {
      navigate(AUTH_LOGIN_PATH, { state: { from: location }, replace: false });
      return;
    }
    navigate(compareHref);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] flex w-[min(100%,28rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-brand-blue/30 bg-white px-4 py-3 shadow-xl shadow-brand-blue/15 dark:border-brand-blue/40 dark:bg-zinc-900">
      <GitCompare size={18} className="shrink-0 text-brand-blue" />
      <p className="min-w-0 flex-1 text-sm font-bold text-slate-800 dark:text-slate-200">
        2 schools ready to compare
      </p>
      <button
        type="button"
        onClick={handleCompare}
        className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-xs font-black text-white"
      >
        Compare now
      </button>
      <button
        type="button"
        onClick={() => clear()}
        className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800"
        aria-label="Clear compare list"
      >
        <X size={16} />
      </button>
    </div>
  );
}
