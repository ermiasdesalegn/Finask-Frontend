/** Visual tokens per backend `program.field` value */
export const PROGRAM_FIELD_STYLES: Record<
  string,
  {
    icon: string;
    accent: string;
    border: string;
    bg: string;
    pill: string;
    bar: string;
  }
> = {
  engineeringarchitecture: {
    icon: "⚙️",
    accent: "text-brand-blue",
    border: "border-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    pill: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
    bar: "bg-brand-blue",
  },
  medicinehealth: {
    icon: "🩺",
    accent: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/20",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    pill: "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300",
    bar: "bg-sky-500",
  },
  businesseconomics: {
    icon: "📊",
    accent: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    pill: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    bar: "bg-brand-yellow",
  },
  socialscienceslaw: {
    icon: "🌍",
    accent: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    pill: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
    bar: "bg-indigo-500",
  },
  naturalappliedsciences: {
    icon: "🌱",
    accent: "text-green-600 dark:text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-50 dark:bg-green-500/10",
    pill: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300",
    bar: "bg-green-500",
  },
  technologyit: {
    icon: "💻",
    accent: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    pill: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    bar: "bg-cyan-500",
  },
  humanitiesartslanguages: {
    icon: "🎨",
    accent: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/20",
    bg: "bg-pink-50 dark:bg-pink-500/10",
    pill: "bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300",
    bar: "bg-pink-500",
  },
  educationteaching: {
    icon: "📚",
    accent: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    pill: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300",
    bar: "bg-orange-500",
  },
};

export const DEFAULT_PROGRAM_FIELD_STYLE = {
  icon: "✨",
  accent: "text-brand-blue",
  border: "border-blue-500/20",
  bg: "bg-blue-50 dark:bg-blue-500/10",
  pill: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
  bar: "bg-brand-blue",
};

export type ProgramFieldStyle =
  | (typeof PROGRAM_FIELD_STYLES)[string]
  | typeof DEFAULT_PROGRAM_FIELD_STYLE;
