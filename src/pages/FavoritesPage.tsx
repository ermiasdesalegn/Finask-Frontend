import { Building2, GraduationCap, Heart, MapPin, Star, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlickeringGrid } from "../components/ui/flickering-grid";
import { useAuth } from "../context/AuthContext";
import {
    displayRating,
    formatRatingsQuantityCompact,
    universityCity,
    universityCover,
    universityPath,
} from "../lib/universityUi";
import { cn } from "../lib/utils";

// ── Static mock favorites (replace with real API data when backend is ready) ──
import { MOCK_PROGRAMS, MOCK_UNIVERSITIES } from "../lib/favoritesData";

type Tab = "universities" | "programs" | "cities" | "campuses";

const TABS: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "universities", label: "Universities", icon: Building2 },
  { id: "programs", label: "Programs", icon: GraduationCap },
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "campuses", label: "Campuses", icon: Users },
];

const EmptyState = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-32 text-center"
  >
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-slate-200/60 bg-white shadow-xl dark:border-white/5 dark:bg-zinc-900">
      <Heart size={32} className="text-slate-300 dark:text-slate-600" />
    </div>
    <h3 className="mb-2 text-xl font-black text-slate-900 dark:text-white">
      No favorite {label} yet
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Heart items while browsing and they'll appear here.
    </p>
  </motion.div>
);

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("universities");
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen w-full pb-24 transition-colors duration-300 dark:bg-[#121212]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(900px_circle_at_top_left,white,transparent)]"
          squareSize={5}
          gridGap={7}
          color="#2563eb"
          maxOpacity={0.06}
          flickerChance={0.08}
        />
        <div className="absolute -right-[10%] top-0 h-[50%] w-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
        <div className="absolute -left-[10%] bottom-0 h-[40%] w-[40%] rounded-full bg-brand-yellow/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-blue-400">
            <Heart size={12} className="fill-brand-blue text-brand-blue" />
            Your Collection
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Your <span className="text-brand-blue">Favorites</span>
          </h1>
          {user?.firstName && (
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Welcome back, {user.firstName}. Here's everything you've saved.
            </p>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200",
                  active
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30"
                    : "border border-slate-200/80 bg-white/80 text-slate-600 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-zinc-900/80 dark:text-slate-400 dark:hover:bg-zinc-800"
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {activeTab === "universities" && (
              MOCK_UNIVERSITIES.length === 0
                ? <EmptyState label="universities" />
                : MOCK_UNIVERSITIES.map((uni) => (
                  <motion.div
                    key={uni._id}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(universityPath(uni))}
                    className="group cursor-pointer rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-2 backdrop-blur-md transition-all hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    <div className="relative mb-3 h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                      <img
                        src={universityCover(uni)}
                        alt={uni.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-brand-blue backdrop-blur-md transition-all hover:scale-110"
                      >
                        <Heart size={14} className="fill-brand-blue" />
                      </button>
                    </div>
                    <div className="px-3 pb-3">
                      <h3 className="mb-1 truncate font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <MapPin size={11} className="text-brand-blue" />
                        {universityCity(uni) || "—"}
                        <span className="mx-1 text-slate-300 dark:text-slate-600">•</span>
                        <Star size={11} className="text-brand-yellow" fill="currentColor" />
                        {displayRating(uni)}
                        <span className="text-slate-400">({formatRatingsQuantityCompact(uni.ratingsQuantity)})</span>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}

            {activeTab === "programs" && (
              MOCK_PROGRAMS.length === 0
                ? <EmptyState label="programs" />
                : MOCK_PROGRAMS.map((prog) => (
                  <motion.div
                    key={prog._id}
                    whileHover={{ y: -4 }}
                    className="group cursor-pointer rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-5 backdrop-blur-md transition-all hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-blue dark:bg-brand-blue/10">
                        {prog.fieldDisplayName ?? prog.field}
                      </span>
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-brand-blue transition-all hover:scale-110"
                      >
                        <Heart size={14} className="fill-brand-blue" />
                      </button>
                    </div>
                    <h3 className="mb-1 font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                      {prog.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {prog.overview}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <GraduationCap size={11} />
                      {prog.duration} yrs
                    </div>
                  </motion.div>
                ))
            )}

            {(activeTab === "cities" || activeTab === "campuses") && (
              <EmptyState label={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
