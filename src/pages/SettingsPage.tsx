import { Camera, Loader2, Shield, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubpageLayout, {
  SubpageCard,
  SignInGate,
  formInputClass,
} from "../components/layout/SubpageLayout";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { ApiError, showApiToast } from "../lib/api";
import { deleteMe, updatePassword } from "../lib/services/authService";
import { updateMe, updateMePhoto } from "../lib/services/userService";

export default function SettingsPage() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const { openLogin } = useLoginModal();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pending, setPending] = useState(false);
  const [profilePending, setProfilePending] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setBio(user.bio ?? "");
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 dark:bg-[#05060c]">
        <SignInGate
          title="Account settings"
          description="Sign in to update your profile, password, and preferences."
          onSignIn={openLogin}
        />
      </div>
    );
  }

  const initial =
    (user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePending(true);
    try {
      await updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
      });
      await refreshUser();
      showApiToast("Profile updated.");
    } catch (err) {
      showApiToast(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setProfilePending(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await updatePassword(oldPw, newPw, confirmPw);
      showApiToast("Password updated.");
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      showApiToast(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setPending(false);
    }
  };

  const onPhoto = async (file: File) => {
    try {
      await updateMePhoto(file);
      await refreshUser();
      showApiToast("Photo updated.");
    } catch (err) {
      showApiToast(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete your account permanently? This cannot be undone."))
      return;
    try {
      await deleteMe();
      await logout();
      navigate("/");
    } catch (err) {
      showApiToast(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  return (
    <SubpageLayout
      badge={
        <>
          <User size={12} />
          Account
        </>
      }
      title={
        <>
          Account{" "}
          <span className="bg-gradient-to-r from-brand-blue to-sky-400 bg-clip-text text-transparent">
            settings
          </span>
        </>
      }
      subtitle="Manage your profile, photo, password, and account security."
      maxWidth="md"
    >
      <div className="space-y-6">
        <SubpageCard>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
            <Camera size={20} className="text-brand-blue" />
            Profile photo
          </h2>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="h-24 w-24 rounded-[1.25rem] object-cover ring-4 ring-white dark:ring-zinc-800"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-brand-blue to-sky-400 text-3xl font-black text-white ring-4 ring-white dark:ring-zinc-800">
                {initial}
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onPhoto(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800 dark:text-slate-200"
              >
                Upload new photo
              </button>
            </div>
          </div>
        </SubpageCard>

        <SubpageCard>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
            <User size={20} className="text-brand-blue" />
            Profile details
          </h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={formInputClass}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={formInputClass}
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="A short intro for your public profile…"
                className={formInputClass}
              />
            </div>
            <button
              type="submit"
              disabled={profilePending}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              {profilePending && <Loader2 className="animate-spin" size={18} />}
              Save profile
            </button>
          </form>
        </SubpageCard>

        <SubpageCard>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
            <Shield size={20} className="text-brand-blue" />
            Change password
          </h2>
          <form onSubmit={changePassword} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className={formInputClass}
              autoComplete="current-password"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className={formInputClass}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={formInputClass}
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              {pending && <Loader2 className="animate-spin" size={18} />}
              Save password
            </button>
          </form>
        </SubpageCard>

        <SubpageCard variant="danger">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-rose-700 dark:text-rose-400">
            <Trash2 size={20} />
            Danger zone
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Permanently delete your account and all associated data.
          </p>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
          >
            <Trash2 size={16} />
            Delete account
          </button>
        </SubpageCard>
      </div>
    </SubpageLayout>
  );
}
