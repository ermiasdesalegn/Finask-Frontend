import { useQuery } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useParams } from "react-router-dom";
import SubpageLayout, { SubpageCard } from "../components/layout/SubpageLayout";
import { formatInterestLabel } from "../lib/userProfile";
import { fetchUserProfile } from "../lib/services/userService";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchUserProfile(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#05060c]">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <SubpageLayout
        title="Profile not found"
        subtitle="This user may have deactivated their account or the link is invalid."
        back={{ label: "Back home", to: "/" }}
        maxWidth="md"
      >
        <SubpageCard className="text-center py-12 text-slate-500">
          Try returning to a university or program page.
        </SubpageCard>
      </SubpageLayout>
    );
  }

  const initial =
    (profile.firstName?.[0] ?? profile.email?.[0] ?? "?").toUpperCase();
  const interests = profile.interests ?? [];

  return (
    <SubpageLayout
      badge={
        <>
          <User size={12} />
          Community member
        </>
      }
      title={
        <>
          {profile.firstName}{" "}
          <span className="text-slate-400 dark:text-slate-500">
            {profile.lastName}
          </span>
        </>
      }
      subtitle={
        profile.role
          ? `FinAsk ${profile.role.replace("_", " ")}`
          : "FinAsk community member"
      }
      back={{ label: "Discover", to: "/discover" }}
      maxWidth="md"
    >
      <SubpageCard>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt=""
              className="h-28 w-28 rounded-[1.5rem] object-cover ring-4 ring-brand-blue/20"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-brand-blue to-sky-400 text-4xl font-black text-white">
              {initial}
            </div>
          )}
          <div className="text-center sm:text-left">
            {profile.email && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {profile.email}
              </p>
            )}
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {profile.bio}
              </p>
            )}
            {interests.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Interests
                  </p>
                  <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    {interests.map((name) => (
                      <li
                        key={name}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-slate-200"
                      >
                        {formatInterestLabel(name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {!profile.bio && interests.length === 0 && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Public profile — reviews and questions link here when shared
                  on listing pages.
                </p>
              )}
          </div>
        </div>
      </SubpageCard>
    </SubpageLayout>
  );
}
