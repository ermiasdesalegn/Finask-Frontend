import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { ManagedUniversityDashboard } from "../../components/university-manager/ManagedUniversityDashboard";
import { fetchMyManagedUniversity } from "../../lib/services/managedUniversityService";
import { queryKeys } from "../../lib/queryKeys";

export default function UniversityManagerTab() {
  const { user } = useAuth();

  const { data: university, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.managedUniversity(),
    queryFn: fetchMyManagedUniversity,
    enabled: user?.role === "university_manager",
    staleTime: 30_000,
  });

  if (user?.role !== "university_manager") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm text-slate-500">Loading your university…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900/30 dark:bg-red-950/20">
        <p className="text-sm text-red-700">
          {(error as Error)?.message ?? "Failed to load university"}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-bold text-brand-blue"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="mb-2 text-xl font-black text-slate-900 dark:text-white">
          No university assigned
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Your account has the university manager role, but an administrator has
          not linked you to a university yet. Please contact FinAsk support or your
          institution&apos;s admin to complete setup.
        </p>
        <Link
          to="/account?tab=help"
          className="text-sm font-bold text-brand-blue hover:underline"
        >
          Go to Help & support →
        </Link>
      </div>
    );
  }

  return <ManagedUniversityDashboard university={university} />;
}
