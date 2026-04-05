import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import finaskLogo from "../../assets/finask-logo.png";
import { useAuth, type AuthUser } from "../../context/AuthContext";
import { ApiError, apiPost } from "../../lib/api";
import { queryKeys } from "../../lib/queryKeys";
import { fetchProgramsList } from "../../lib/services/programService";
import {
  VerificationOtpInput,
  emptyOtpCells,
} from "./VerificationOtpInput";

type Mode = "signin" | "signup";
type FlowStep = "form" | "verifyEmail";

interface AuthResponse {
  status: string;
  data: { user: AuthUser };
}

interface SignupResponse {
  status: string;
  message: string;
}

interface ResendVerificationResponse {
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
  const [flowStep, setFlowStep] = useState<FlowStep>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);

  const [verificationEmail, setVerificationEmail] = useState("");
  const [otpCells, setOtpCells] = useState<string[]>(() => emptyOtpCells());

  const signupProgramsFilters = useMemo(
    () =>
      ({
        limit: 300,
        sort: "name" as const,
        fields: "_id,name",
      }) as const,
    []
  );

  const programsQuery = useQuery({
    queryKey: queryKeys.programsList(signupProgramsFilters),
    queryFn: () => fetchProgramsList(signupProgramsFilters),
    enabled: open && mode === "signup" && flowStep === "form",
  });

  const programs = programsQuery.data?.data.programs ?? [];

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.left = "";
      document.body.style.right = "";
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMode("signin");
      setFlowStep("form");
      setError(null);
      setInfoMsg(null);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setSelectedProgramIds([]);
      setVerificationEmail("");
      setOtpCells(emptyOtpCells());
    }
  }, [open]);

  const resetFormFields = () => {
    setError(null);
    setInfoMsg(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setSelectedProgramIds([]);
    setOtpCells(emptyOtpCells());
    setFlowStep("form");
    setVerificationEmail("");
  };

  const switchMode = (m: Mode) => {
    resetFormFields();
    setMode(m);
  };

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        return Promise.resolve({
          status: "success",
          data: {
            user: {
              _id: "mock-user-001",
              email: body.email,
              firstName: "Demo",
              lastName: "User",
              role: "user",
            },
          },
        } as AuthResponse);
      }
      return apiPost<AuthResponse>("/users/login", body, { skipAuth: true });
    },
    onSuccess: (res) => {
      if (res.data?.user) {
        login(res.data.user);
        resetFormFields();
        onClose();
      } else {
        setError("Unexpected response from server");
      }
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Login failed");
    },
  });

  const signupMutation = useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      passwordConfirm: string;
      fieldsOfInterest: string[];
    }) => apiPost<SignupResponse>("/users/signup", body, { skipAuth: true }),
    onSuccess: (_res, variables) => {
      setError(null);
      setInfoMsg(null);
      setVerificationEmail(variables.email);
      setOtpCells(emptyOtpCells());
      setFlowStep("verifyEmail");
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Sign up failed");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (body: { email: string; code: string }) => {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        return Promise.resolve({
          status: "success",
          data: {
            user: {
              _id: "mock-user-new",
              email: body.email,
              firstName: firstName || "Demo",
              lastName: lastName || "User",
              role: "user",
            },
          },
        } as AuthResponse);
      }
      return apiPost<AuthResponse>("/users/verifyEmail", body, {
        skipAuth: true,
      });
    },
    onSuccess: (res) => {
      if (res.data?.user) {
        login(res.data.user);
        resetFormFields();
        onClose();
      } else {
        setError("Unexpected response from server");
      }
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : "Verification failed");
    },
  });

  const resendMutation = useMutation({
    mutationFn: (body: { email: string }) =>
      apiPost<ResendVerificationResponse>("/users/resendVerification", body, {
        skipAuth: true,
      }),
    onSuccess: (res) => {
      setInfoMsg(res.message ?? "A new code has been sent.");
      setError(null);
      setOtpCells(emptyOtpCells());
    },
    onError: (err: unknown) => {
      setError(
        err instanceof ApiError ? err.message : "Could not resend the code."
      );
    },
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  const toggleProgramInterest = (id: string) => {
    setSelectedProgramIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (selectedProgramIds.length === 0) {
      setError("Please select at least one field of study.");
      return;
    }
    signupMutation.mutate({
      firstName,
      lastName,
      email: signupEmail,
      password: signupPassword,
      passwordConfirm: confirmPassword,
      fieldsOfInterest: selectedProgramIds,
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otpCells.join("");
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    verifyEmailMutation.mutate({ email: verificationEmail, code });
  };

  const handleResend = () => {
    setError(null);
    resendMutation.mutate({ email: verificationEmail });
  };

  const submitting =
    loginMutation.isPending ||
    signupMutation.isPending ||
    verifyEmailMutation.isPending;

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-700";

  const handleClose = () => {
    resetFormFields();
    setMode("signin");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={flowStep === "verifyEmail" ? "verify-title" : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 flex max-h-[min(90vh,calc(100dvh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a] overscroll-y-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full shrink-0 bg-gradient-to-r from-brand-blue via-blue-400 to-brand-yellow" />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-8">
              <div className="mb-6 flex items-center justify-between">
                <img src={finaskLogo} alt="Finask" className="h-7 w-auto" />
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {flowStep === "form" && (
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
              )}

              <AnimatePresence>
                {infoMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                  >
                    {infoMsg}
                  </motion.div>
                )}
              </AnimatePresence>

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

              {flowStep === "verifyEmail" ? (
                <motion.form
                  key="verify"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  <div>
                    <h2
                      id="verify-title"
                      className="text-lg font-black text-slate-900 dark:text-white"
                    >
                      Verify your email
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {verificationEmail}
                      </span>
                      . Enter it below to finish signing up.
                    </p>
                  </div>

                  <div>
                    <span className="mb-3 block text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                      Verification code
                    </span>
                    <VerificationOtpInput
                      cells={otpCells}
                      onCellsChange={setOtpCells}
                      disabled={submitting || resendMutation.isPending}
                      autoFocus
                      idPrefix="verify-otp"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || resendMutation.isPending}
                    className="w-full rounded-2xl bg-brand-blue py-3.5 font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                  >
                    {verifyEmailMutation.isPending
                      ? "Verifying…"
                      : "Verify & continue"}
                  </button>

                  <div className="flex flex-col gap-2 text-center text-sm">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendMutation.isPending || submitting}
                      className="font-bold text-brand-blue hover:underline disabled:opacity-50"
                    >
                      {resendMutation.isPending ? "Sending…" : "Resend code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFlowStep("form");
                        setOtpCells(emptyOtpCells());
                        setError(null);
                        setInfoMsg(null);
                        setMode("signup");
                      }}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      Use a different email
                    </button>
                  </div>
                </motion.form>
              ) : (
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

                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        <span className="text-xs font-bold text-slate-400">or continue with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      </div>

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
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Fields of study
                        </span>
                        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                          Pick at least one program you care about (required).
                        </p>
                        {programsQuery.isPending && (
                          <p className="text-sm text-slate-500">Loading programs…</p>
                        )}
                        {programsQuery.isError && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Could not load programs. Check your connection and try again.
                          </p>
                        )}
                        {!programsQuery.isPending && !programsQuery.isError && programs.length === 0 && (
                          <p className="text-sm text-slate-500">No programs available.</p>
                        )}
                        {programs.length > 0 && (
                          <div
                            className="max-h-44 space-y-2 overflow-y-auto overscroll-y-contain rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-zinc-800/80"
                            role="group"
                            aria-label="Fields of study"
                          >
                            {programs.map((p) => {
                              const id = p._id || p.id;
                              if (!id) return null;
                              const checked = selectedProgramIds.includes(id);
                              return (
                                <label
                                  key={id}
                                  className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-800 hover:bg-white dark:text-slate-200 dark:hover:bg-zinc-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleProgramInterest(id)}
                                    className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                  />
                                  <span>{p.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
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

                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        <span className="text-xs font-bold text-slate-400">or</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      </div>

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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
