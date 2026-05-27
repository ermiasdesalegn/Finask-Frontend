import { Link, useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import SettingsPage from "./SettingsPage";
import MePage from "./MePage";
import UniversityManagerTab from "./account/UniversityManagerTab";

const BASE_TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Account & security" },
  { id: "preferences", label: "Preferences" },
  { id: "activity", label: "My activity" },
  { id: "help", label: "Help & support" },
  { id: "legal", label: "Legal & info" },
] as const;

const MANAGER_TAB = { id: "university" as const, label: "University" };

type BaseTabId = (typeof BASE_TABS)[number]["id"];
type TabId = BaseTabId | "university";

export default function AccountPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const isManager = user?.role === "university_manager";
  const tabs = isManager
    ? [
        BASE_TABS[0],
        BASE_TABS[1],
        MANAGER_TAB,
        ...BASE_TABS.slice(2),
      ]
    : [...BASE_TABS];
  const tab = (params.get("tab") as TabId) || "profile";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 dark:bg-[#05060c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 lg:flex-row">
        <aside className="lg:w-56 shrink-0">
          <h1 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">
            Account
          </h1>
          <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setParams({ tab: t.id })}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-colors",
                  tab === t.id
                    ? "bg-brand-blue text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {tab === "university" ? (
            <UniversityManagerTab />
          ) : tab === "activity" ? (
            <MePage embedded />
          ) : tab === "help" ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
              <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
                Help & support
              </h2>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Questions about Finask? Reach out or browse common topics.
              </p>
              <ul className="list-inside list-disc space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Email: support@finask.et</li>
                <li>
                  <Link to="/about" className="font-bold text-brand-blue hover:underline">
                    About Finask
                  </Link>
                </li>
              </ul>
            </div>
          ) : tab === "legal" ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
              <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
                Legal & info
              </h2>
              <Link
                to="/about"
                className="text-sm font-bold text-brand-blue hover:underline"
              >
                About Finask →
              </Link>
            </div>
          ) : (
            <SettingsPage embedded section={tab} />
          )}
        </main>
      </div>
    </div>
  );
}

export function SettingsRedirect() {
  return <Navigate to="/account?tab=profile" replace />;
}

export function MeRedirect() {
  return <Navigate to="/account?tab=activity" replace />;
}
