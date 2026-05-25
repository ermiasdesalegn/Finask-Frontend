import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  VerificationOtpInput,
  emptyOtpCells,
} from "../components/layout/VerificationOtpInput";
import { ApiError, showApiToast } from "../lib/api";
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "../lib/services/authService";
import { useAuth } from "../context/AuthContext";

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(emptyOtpCells());
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [pending, setPending] = useState(false);

  const otpCode = otp.join("");

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await forgotPassword(email.trim());
      showApiToast("If that email exists, a code was sent.");
      setStep("code");
    } catch (err) {
      showApiToast(err instanceof ApiError ? err.message : "Request failed");
    } finally {
      setPending(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await verifyResetCode(email.trim(), otpCode);
      setStep("password");
    } catch (err) {
      showApiToast(err instanceof ApiError ? err.message : "Invalid code");
    } finally {
      setPending(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      showApiToast("Passwords do not match");
      return;
    }
    setPending(true);
    try {
      const res = await resetPassword(password, passwordConfirm);
      const u = res.data?.user as Parameters<typeof login>[0] | undefined;
      if (u && res.token) await login(u, res.token);
      navigate("/");
    } catch (err) {
      showApiToast(
        err instanceof ApiError
          ? err.message
          : "Reset failed. Use VITE_DEV_API_PROXY=true for cookie-based reset locally."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-blue">
        <ArrowLeft size={16} /> Back home
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Reset password
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        {step === "email" && "Enter your account email."}
        {step === "code" && "Enter the code from your email."}
        {step === "password" && "Choose a new password."}
      </p>

      {step === "email" && (
        <form onSubmit={submitEmail} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 font-semibold text-white"
          >
            {pending && <Loader2 className="animate-spin" size={18} />}
            Send code
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={submitCode} className="space-y-4">
          <VerificationOtpInput cells={otp} onCellsChange={setOtp} />
          <button
            type="submit"
            disabled={pending || otpCode.length < 6}
            className="w-full rounded-xl bg-brand-blue py-3 font-semibold text-white"
          >
            Verify code
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={submitPassword} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
          />
          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-xl border px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-brand-blue py-3 font-semibold text-white"
          >
            Reset password
          </button>
        </form>
      )}
    </div>
  );
}
