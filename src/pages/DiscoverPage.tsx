import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Building2,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Star,
  Thermometer,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchDropdown } from "../components/ui/SearchDropdown";
import { FlickeringGrid } from "../components/ui/flickering-grid";
import {
  PROGRAM_FIELD_LABELS,
  PROGRAM_FIELD_STYLES,
} from "../constants/programFieldStyles";
import { useDebounce } from "../lib/hooks/useDebounce";
import { useDocumentDark } from "../lib/hooks/useDocumentDark";
import {
  blurReveal,
  slideInRight,
  springPop,
  staggerBlurContainer,
  staggerBlurItem,
} from "../lib/motion/pageMotion";
import { useSearchQuery } from "../lib/queries/search";

// --- TYPES & DATA ---
type BrowseCategory = {
  label: string;
  icon: React.ReactNode;
  href: string;
  img: string;
  accent: string;
};

const DISCOVER_CHIPS = [
  { label: "#Trending", href: "/universities?filter=trending", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300" },
  { label: "#Featured", href: "/universities?filter=featured", img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=300" },
  { label: "#Top Ranked", href: "/universities?sort=rank", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300" },
  { label: "#Autonomous", href: "/universities?filter=research", img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=300" },
];

const BROWSE_CATEGORIES: BrowseCategory[] = [
  { label: "All Universities", icon: <Building2 size={16} />, href: "/universities", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400", accent: "from-blue-900/90" },
  { label: "Just for You", icon: <Sparkles size={16} />, href: "/universities?filter=featured", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400", accent: "from-amber-900/90" },
  { label: "Cities", icon: <MapPin size={16} />, href: "/cities", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400", accent: "from-green-900/90" },
  { label: "Campus Gallery", icon: <Heart size={16} />, href: "/campuses", img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=400", accent: "from-pink-900/90" },
  { label: "Top Ranked", icon: <Trophy size={16} />, href: "/universities?sort=rank", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400", accent: "from-amber-900/90" },
  { label: "Top Rated", icon: <Star size={16} />, href: "/universities?sort=rating", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400", accent: "from-blue-900/90" },
  { label: "Climate", icon: <Thermometer size={16} />, href: "/universities?view=climate", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400", accent: "from-teal-900/90" },
  { label: "Rare Programs", icon: <BookOpen size={16} />, href: "/programs?filter=rare", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", accent: "from-purple-900/90" },
];

const FIELD_CATEGORIES = Object.entries(PROGRAM_FIELD_STYLES).map(([key, style]) => ({
  key,
  label: PROGRAM_FIELD_LABELS[key] ?? key,
  style,
  href: `/programs?field=${key}`,
}));

// --- ANIMATION VARIANTS (blur + stagger) ---
const containerVariants = staggerBlurContainer;
const itemVariants = staggerBlurItem;

const DiscoverPage: React.FC = () => {
  const isDark = useDocumentDark();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const isSearching = debouncedQuery.trim().length >= 2;
  const searchResults = useSearchQuery(debouncedQuery, 10);
  const searchLoading = isSearching && searchResults.isFetching;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FAFAFA]/80 pb-24 transition-colors duration-300 dark:bg-[#050505]/80">
      <div className="pointer-events-none fixed inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_100%_65%_at_50%_0%,white,transparent)]"
          squareSize={5}
          gridGap={7}
          color={isDark ? "#818cf8" : "#4f46e5"}
          maxOpacity={isDark ? 0.2 : 0.16}
          flickerChance={0.18}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_90%_58%_at_50%_0%,#000_50%,transparent_100%)]"
          aria-hidden
        />
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-brand-blue/12 blur-[115px] mix-blend-multiply dark:mix-blend-screen dark:bg-brand-blue/22" />
        <div className="absolute top-[-8%] right-[-12%] h-[44%] w-[44%] rounded-full bg-violet-400/12 blur-[125px] mix-blend-multiply dark:mix-blend-screen dark:bg-violet-500/18" />
        <div className="absolute bottom-[-15%] left-1/2 h-[35%] w-[70%] -translate-x-1/2 rounded-full bg-brand-yellow/6 blur-[100px] mix-blend-multiply dark:mix-blend-screen dark:bg-brand-yellow/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 md:pt-32">

        {/* --- TYPOGRAPHIC HERO WITH SEARCH --- */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={blurReveal}
          className="mx-auto mb-24 flex max-w-4xl flex-col items-center text-center"
        >
          {/* Subtle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-8 backdrop-blur-md">
            <Sparkles size={14} className="text-brand-yellow" />
            Exploration Hub
          </div>
          
          {/* Massive Hero Title */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-500">Perfect Fit</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-12 max-w-2xl">
            Dive into thousands of programs, discover top-rated campuses, and map out your academic future across Ethiopia.
          </p>

          {/* Search — same behavior as Home hero (debounced GET /search + dropdown) */}
          <div className="relative z-30 w-full max-w-2xl">
            <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 px-6 py-4 shadow-2xl shadow-brand-blue/10 backdrop-blur-xl transition-all focus-within:border-brand-blue/50 focus-within:ring-4 focus-within:ring-brand-blue/10 hover:shadow-brand-blue/20 dark:border-white/10 dark:bg-zinc-900/90 md:py-5">
              <Search size={24} className="shrink-0 text-brand-blue" />
              <input
                type="text"
                placeholder="Search universities, programs, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white md:text-lg"
              />
              <AnimatePresence mode="wait">
                {searchLoading && (
                  <motion.div
                    key="spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-brand-blue border-t-transparent"
                  />
                )}
                {!searchLoading && searchQuery && (
                  <motion.button
                    key="clear"
                    type="button"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <SearchDropdown
              open={isSearching}
              results={searchResults.data?.data ?? null}
              loading={searchLoading}
              query={debouncedQuery}
              onClose={() => setSearchQuery("")}
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px", amount: 0.08 }}
          className="pt-4"
        >

          {/* --- DISCOVER SOMETHING NEW --- */}
          <section className="mb-20">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideInRight}
              className="mb-6 flex items-center gap-3"
            >
              <div className="h-6 w-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Trending Highlights
              </h2>
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 lg:mx-0 lg:px-0">
              {DISCOVER_CHIPS.map((chip) => (
                <motion.button
                  variants={itemVariants}
                  key={chip.label}
                  type="button"
                  onClick={() => navigate(chip.href)}
                  className="group relative h-36 w-44 md:h-44 md:w-60 shrink-0 overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-1.5 transition-all duration-400 border border-slate-200/50 dark:border-white/5"
                >
                  <img src={chip.img} alt={chip.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent group-hover:from-brand-blue/90 transition-colors duration-500" />
                  <span className="absolute bottom-5 left-5 right-5 text-left text-sm md:text-base font-black text-white drop-shadow-md">
                    {chip.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* --- BROWSE ALL --- */}
          <section className="mb-20">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={springPop}
              className="mb-6 flex items-center gap-3"
            >
              <div className="h-6 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Browse Directory
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {BROWSE_CATEGORIES.map((cat) => (
                <motion.button
                  variants={itemVariants}
                  key={cat.label}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(cat.href)}
                  className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[1.5rem] p-4 md:p-5 h-36 md:h-44 overflow-hidden shadow-sm border border-slate-200/60 dark:border-white/5 hover:shadow-xl hover:shadow-brand-blue/10 hover:border-brand-blue/40 hover:-translate-y-1 transition-all duration-400 text-left"
                >
                  {/* Subtle Top Gradient for text readability */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 dark:from-black/20 to-transparent z-0" />

                  {/* Text positioned top-left */}
                  <span className="relative z-10 text-sm md:text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-brand-blue transition-colors max-w-[75%] block leading-tight drop-shadow-sm">
                    {cat.label}
                  </span>
                  
                  {/* Angled Image Slice positioned bottom-right */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 rotate-[-12deg] overflow-hidden rounded-2xl group-hover:rotate-[-4deg] group-hover:scale-110 transition-all duration-500 shadow-2xl border-4 border-white dark:border-zinc-800 z-10">
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* --- BROWSE BY FIELD --- */}
          <section>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={blurReveal}
              className="mb-6 flex items-center gap-3"
            >
              <div className="h-6 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Fields of Study
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FIELD_CATEGORIES.map((cat) => (
                <motion.button
                  variants={itemVariants}
                  key={cat.key}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(cat.href)}
                  className={`flex items-center gap-4 rounded-[1.5rem] border p-4 md:p-5 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cat.style.bg} ${cat.style.border}`}
                >
                  <div className="w-14 h-14 shrink-0 rounded-[1.2rem] bg-white/60 dark:bg-black/20 flex items-center justify-center shadow-inner backdrop-blur-sm">
                    <span className="text-3xl">{cat.style.icon}</span>
                  </div>
                  <span className={`text-sm md:text-base font-black leading-tight ${cat.style.accent}`}>
                    {cat.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
};

export default DiscoverPage;