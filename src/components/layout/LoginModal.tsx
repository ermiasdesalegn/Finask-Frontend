import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import finaskLogo from "../../assets/finask-logo.png";
import { useAuth, type AuthUser } from "../../context/AuthContext";
import { ApiError, apiPost } from "../../lib/api";

type Mode = "signin" | "signup";

interface AuthResponse {
  status: string;
  token: string;
  data: { user: AuthUser };
}

interface SignupResponse {
  status: string;
  message: string;
}

// Google "G" SVG icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoginModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetState = () => {
    setError(null);
    setSuccessMsg(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const switchMode = (m: Mode) => {
    resetState();
    setMode(m);
  };

  // ── Sign in ──────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        return Promise.resolve({
          status: "success",
          token: "mock-token-static",
          data: { user: { _id: "mock-user-001", email: body.email, firstName: "Demo", lastName: "User", role: "user" } },
        } as AuthResponse);
      }
      return apiPost<AuthResponse>("/users/login", body, { skipAuth: true });
    },
    onSuccess: (res) => {
      if (res.token && res.data?.user) {
        login(res.token, res.data.user);
        resetState();
        onClose();
      } else {
        setError("Unexpected response from server");
      }
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Login failed");
    },
  });

  // ── Sign up ──────────────────────────────────────────────────────────────
  const signupMutation = useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }) => apiPost<SignupResponse>("/users/signup", body, { skipAuth: true }),
    onSuccess: (res) => {
      setSuccessMsg(res.message ?? "Account created! Check your email to verify.");
      setError(null);
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Sign up failed");
    },
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate({
      firstName,
      lastName,
      email: signupEmail,
      password: signupPassword,
      passwordConfirm: confirmPassword,
    });
  };

  const submitting = loginMutation.isPending || signupMutation.isPending;

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-700";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative mb-8 w-full max-w-md overflow-y-auto rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-blue-400 to-brand-yellow" />

            <div className="p-8">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <img src={finaskLogo} alt="Finask" className="h-7 w-auto" />
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mode tabs */}
              <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 dark:bg-zinc-800">
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-black transition-all duration-200 ${
                      mode === m
                        ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {/* Success message */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {mode === "signin" ? (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleSignIn}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Password
                        </label>
                        <button type="button" className="text-xs font-bold text-brand-blue hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`${inputClass} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-2xl bg-brand-blue py-3.5 font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                    >
                      {submitting ? "Signing in…" : "Sign In"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      <span className="text-xs font-bold text-slate-400">or continue with</span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                      No account?{" "}
                      <button type="button" onClick={() => switchMode("signup")} className="font-bold text-brand-blue hover:underline">
                        Create one
                      </button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleSignUp}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="signup-first" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          First Name
                        </label>
                        <input
                          id="signup-first"
                          type="text"
                          autoComplete="given-name"
                          required
                          placeholder="Abebe"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-last" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Last Name
                        </label>
                        <input
                          id="signup-last"
                          type="text"
                          autoComplete="family-name"
                          required
                          placeholder="Girma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          placeholder="Min. 8 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className={`${inputClass} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-confirm" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Confirm Password
                      </label>
                      <input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-2xl bg-brand-blue py-3.5 font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                    >
                      {submitting ? "Creating account…" : "Create Account"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      <span className="text-xs font-bold text-slate-400">or</span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    >
                      <GoogleIcon />
                      Sign up with Google
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchMode("signin")} className="font-bold text-brand-blue hover:underline">
                        Sign in
                      </button>
                    </p>

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                      By creating an account you agree to our{" "}
                      <a href="#" className="underline hover:text-brand-blue">Terms</a>{" "}
                      and{" "}
                      <a href="#" className="underline hover:text-brand-blue">Privacy Policy</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
