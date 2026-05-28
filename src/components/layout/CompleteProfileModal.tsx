import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import finaskLogo from "../../assets/finask-logo.png";
import { useAuth } from "../../context/AuthContext";
import { ApiError, apiPatch } from "../../lib/api";
import { useLogoutConfirm } from "../../lib/hooks/useLogoutConfirm";
import FieldsOfStudyPicker from "./FieldsOfStudyPicker";

type UpdateMeResponse = {
  status: string;
  data?: { user: import("../../context/AuthContext").AuthUser };
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-700";

/**
 * Shown when a signed-in user has no fieldsOfInterest (e.g. legacy Google account).
 * Cannot dismiss until at least one field is saved.
 */
export default function CompleteProfileModal() {
  const { user, needsFieldsOfInterest, updateUser } = useAuth();
  const { requestLogout, LogoutConfirmDialog } = useLogoutConfirm();
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setSelectedProgramIds([]);
    setError(null);
  }, [user?._id]);

  const saveMutation = useMutation({
    mutationFn: (body: {
      fieldsOfInterest: string[];
      firstName?: string;
      lastName?: string;
    }) => apiPatch<UpdateMeResponse>("/users/updateMe", body),
    onSuccess: (res) => {
      if (res.data?.user) {
        updateUser(res.data.user);
      }
    },
    onError: (err: unknown) => {
      setError(
        err instanceof ApiError ? err.message : "Could not save your profile"
      );
    },
  });

  if (!needsFieldsOfInterest || !user) return null;

  const toggleProgram = (id: string) => {
    setSelectedProgramIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selectedProgramIds.length === 0) {
      setError("Please select at least one field of interest.");
      return;
    }
    saveMutation.mutate({
      fieldsOfInterest: selectedProgramIds,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
  };

  return (
    <>
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="complete-profile-title"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 flex max-h-[min(90vh,calc(100dvh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]"
      >
        <motion.div className="h-1 w-full shrink-0 bg-gradient-to-r from-brand-blue via-blue-400 to-brand-yellow" />

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-8"
        >
          <div className="mb-6">
            <img src={finaskLogo} alt="Finask" className="h-7 w-auto" />
          </div>

          <h2
            id="complete-profile-title"
            className="text-lg font-black text-slate-900 dark:text-white"
          >
            Complete your profile
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You&apos;re signed in
            {user.email ? (
              <>
                {" "}
                as{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.email}
                </span>
              </>
            ) : null}
            . Choose at least one field of study to use Finask — the same step as email sign-up.
          </p>

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="complete-first"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  First Name
                </label>
                <input
                  id="complete-first"
                  type="text"
                  required
                  minLength={2}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="complete-last"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Last Name
                </label>
                <input
                  id="complete-last"
                  type="text"
                  required
                  minLength={2}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <FieldsOfStudyPicker
              selectedIds={selectedProgramIds}
              onToggle={toggleProgram}
              enabled
            />

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full rounded-2xl bg-brand-blue py-3.5 font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving…" : "Save & continue"}
            </button>

            <button
              type="button"
              onClick={requestLogout}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Log out instead
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
    {LogoutConfirmDialog}
    </>
  );
}
