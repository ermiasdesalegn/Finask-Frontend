import { Link } from "react-router-dom";
import AuthRequiredSection from "../auth/AuthRequiredSection";
import { useAuth } from "../../context/AuthContext";
import { universityPath } from "../../lib/universityUi";
import { userHasFieldsOfInterest } from "../../lib/userProfile";
import {
  useSuggestedByLocationQuery,
  useSuggestedByProgramQuery,
} from "../../lib/queries/universities";

function SuggestedRow({
  title,
  universities,
}: {
  title: string;
  universities: { _id?: string; slug?: string; name: string }[];
}) {
  if (!universities.length) return null;
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {universities.map((u) => (
          <Link
            key={u._id ?? u.slug}
            to={universityPath(u as Parameters<typeof universityPath>[0])}
            className="block w-56 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm font-semibold transition-colors hover:border-brand-blue dark:border-white/10 dark:bg-zinc-900/80"
          >
            {u.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomeSuggested() {
  const { isAuthenticated, user } = useAuth();
  const enabled =
    isAuthenticated && userHasFieldsOfInterest(user);

  const locQ = useSuggestedByLocationQuery(enabled);
  const progQ = useSuggestedByProgramQuery(enabled);

  const loc = locQ.data?.data?.universities ?? [];
  const prog = progQ.data?.data?.universities ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">
        Recommended for you
      </h2>
      <AuthRequiredSection
        title="Sign in to see recommended universities"
        description="Sign in to see recommended universities matched to your profile, programs, and location."
      >
        {enabled && (loc.length > 0 || prog.length > 0) ? (
          <>
            <SuggestedRow title="Suggested for your location" universities={loc} />
            <SuggestedRow title="Suggested for your fields of study" universities={prog} />
          </>
        ) : isAuthenticated ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add program interests in your profile to unlock personalized university picks.{" "}
            <Link to="/account" className="font-bold text-brand-blue hover:underline">
              Update profile
            </Link>
          </p>
        ) : null}
      </AuthRequiredSection>
    </section>
  );
}
