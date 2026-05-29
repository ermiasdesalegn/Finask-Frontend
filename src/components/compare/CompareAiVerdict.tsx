import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { formatAiSummary } from "../../lib/formatAiSummary";

type CompareAiVerdictProps = {
  summary: string | null;
  personalized?: boolean;
};

export default function CompareAiVerdict({
  summary,
  personalized = false,
}: CompareAiVerdictProps) {
  if (!summary) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-[2rem] border border-dashed border-slate-200 bg-white/60 p-6 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          AI verdict
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {personalized
            ? "No personalized recommendation yet. Check your API key or try again."
            : "Personalize below and tap Get AI recommendation for a tailored verdict."}
        </p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/20">
          <Sparkles className="h-5 w-5 text-amber-600 dark:text-brand-yellow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-brand-yellow" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              AI verdict
              {personalized ? " · Personalized" : ""}
            </p>
          </div>
          <h2 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            Our recommendation
          </h2>
        </div>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {formatAiSummary(summary)}
      </div>
    </motion.section>
  );
}
