import { motion } from "motion/react";
import { blurReveal } from "../../lib/motion/pageMotion";

type ComparePageHeroProps = {
  subtitle?: string;
  children?: React.ReactNode;
};

export default function ComparePageHero({
  subtitle = "Make data-driven decisions with side-by-side analysis of rank, climate, programs, and campus life.",
  children,
}: ComparePageHeroProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={blurReveal}
      className="mb-8 scroll-mt-32 text-center md:mb-10 md:scroll-mt-36"
    >
      <span className="mb-4 inline-block rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-blue">
        Compare · Side by side
      </span>
      <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
        Compare{" "}
        <span className="bg-gradient-to-r from-brand-blue to-indigo-500 bg-clip-text text-transparent">
          universities
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400 md:text-base">
        {subtitle}
      </p>
      {children}
    </motion.div>
  );
}
