import { ArrowLeft, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { blurReveal, springPop } from "../../lib/motion/pageMotion";
import { cn } from "../../lib/utils";

export const formInputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-white/10 dark:bg-zinc-800/80 dark:text-white dark:focus:bg-zinc-800";

export function SubpageCard({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "danger";
}) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border p-6 shadow-sm backdrop-blur-md transition-colors",
        variant === "danger"
          ? "border-rose-200/80 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20"
          : "border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-zinc-900/60",
        className
      )}
    >
      {children}
    </section>
  );
}

type SubpageLayoutProps = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  back?: { label: string; to: string };
  maxWidth?: "md" | "lg" | "xl" | "3xl";
  children: React.ReactNode;
  headerAction?: React.ReactNode;
};

const maxW = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "3xl": "max-w-3xl",
};

export default function SubpageLayout({
  badge,
  title,
  subtitle,
  back,
  maxWidth = "lg",
  children,
  headerAction,
}: SubpageLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 pb-24 transition-colors dark:bg-[#05060c]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-20 top-0 h-[45%] w-[45%] rounded-full bg-brand-blue/8 blur-[100px] dark:bg-brand-blue/15" />
        <div className="absolute -left-24 top-1/3 h-[40%] w-[40%] rounded-full bg-brand-yellow/10 blur-[90px] dark:bg-brand-yellow/5" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto px-6 pt-10 lg:px-8",
          maxW[maxWidth]
        )}
      >
        {back && (
          <Link
            to={back.to}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:border-brand-blue/30 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-900/60 dark:text-slate-300"
          >
            <ArrowLeft size={16} />
            {back.label}
          </Link>
        )}

        <motion.header
          initial="hidden"
          animate="show"
          variants={springPop}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            {badge && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50 dark:text-slate-400">
                {badge}
              </div>
            )}
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </motion.header>

        <motion.div
          initial="hidden"
          animate="show"
          variants={blurReveal}
          transition={{ delay: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function SignInGate({
  title,
  description,
  onSignIn,
}: {
  title: string;
  description: string;
  onSignIn: () => void;
}) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <h1 className="mb-3 text-3xl font-black text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">{description}</p>
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-8 py-4 font-black text-white shadow-lg shadow-brand-blue/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <LogIn size={18} />
          Sign in
        </button>
      </motion.div>
    </div>
  );
}
