import {
  BookOpen,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Thermometer,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PROGRAM_FIELD_STYLES } from "../constants/programFieldStyles";
import heroGif from "../assets/hero-gif.gif";

type BrowseCategory = {
  label: string;
  icon: React.ReactNode;
  href: string;
  img: string;
  accent: string;
};

const DISCOVER_CHIPS = [
  {
    label: "#Trending",
    href: "/universities?filter=trending",
    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300",
  },
  {
    label: "#Featured",
    href: "/universities?filter=featured",
    img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=300",
  },
  {
    label: "#Top Ranked",
    href: "/universities?sort=rank",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300",
  },
  {
    label: "#Autonomous",
    href: "/universities?filter=research",
    img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=300",
  },
];

const BROWSE_CATEGORIES: BrowseCategory[] = [
  { label: "All Universities", icon: <Building2 size={16} />, href: "/universities", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400", accent: "from-blue-900/90" },
  { label: "Just for You", icon: <Sparkles size={16} />, href: "/universities?filter=featured", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400", accent: "from-amber-900/90" },
  { label: "Cities", icon: <MapPin size={16} />, href: "/universities?view=cities", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400", accent: "from-green-900/90" },
  { label: "Campus Gallery", icon: <Heart size={16} />, href: "/universities?view=gallery", img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=400", accent: "from-pink-900/90" },
  { label: "Top Ranked", icon: <Trophy size={16} />, href: "/universities?sort=rank", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400", accent: "from-amber-900/90" },
  { label: "Top Rated", icon: <Star size={16} />, href: "/universities?sort=rating", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400", accent: "from-blue-900/90" },
  { label: "Climate", icon: <Thermometer size={16} />, href: "/universities?view=climate", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400", accent: "from-teal-900/90" },
  { label: "Rare Programs", icon: <BookOpen size={16} />, href: "/programs?filter=rare", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", accent: "from-purple-900/90" },
  { label: "Nearby", icon: <MapPin size={16} />, href: "/universities?filter=nearby", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400", accent: "from-teal-900/90" },
  { label: "Discover", icon: <Sparkles size={16} />, href: "/universities", img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=400", accent: "from-indigo-900/90" },
  { label: "Institutional Excellence", icon: <GraduationCap size={16} />, href: "/universities?filter=research", img: "https://images.unsplash.com/photo-1607013407627-8ea69cad1dd3?auto=format&fit=crop&q=80&w=400", accent: "from-slate-900/90" },
  { label: "Generation", icon: <Users size={16} />, href: "/universities?filter=trending", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=400", accent: "from-rose-900/90" },
  { label: "All Programs", icon: <BookOpen size={16} />, href: "/programs", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400", accent: "from-blue-900/90" },
];

const FIELD_LABELS: Record<string, string> = {
  engineeringarchitecture: "Engineering and Architecture",
  medicinehealth: "Medicine and Health",
  businesseconomics: "Business and Economics",
  socialscienceslaw: "Social Sciences and Law",
  naturalappliedsciences: "Natural and Applied Sciences",
  technologyit: "Technology and IT",
  humanitiesartslanguages: "Humanities, Arts and Language",
  educationteaching: "Education and Teaching",
};

const FIELD_CATEGORIES = Object.entries(PROGRAM_FIELD_STYLES).map(([key, style]) => ({
  key,
  label: FIELD_LABELS[key] ?? key,
  style,
  href: `/programs?field=${key}`,
}));

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-24">

      {/* Hero gif banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 overflow-hidden rounded-3xl"
      >
        <img
          src={heroGif}
          alt="Discover"
          className="h-40 w-full object-cover"
        />
      </motion.div>

      {/* Discover something new */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-brand-blue" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Discover something new
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DISCOVER_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => navigate(chip.href)}
              className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
            >
              <img
                src={chip.img}
                alt={chip.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-left text-[11px] font-black text-white drop-shadow">
                {chip.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Browse all */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-brand-yellow" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Browse all
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BROWSE_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.label}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.href)}
              className="group relative flex h-24 items-end overflow-hidden rounded-2xl border border-slate-200/60 text-left shadow-sm transition-all hover:shadow-md dark:border-white/5"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} to-transparent`} />
              <div className="relative z-10 p-3">
                <span className="text-xs font-black text-white drop-shadow">{cat.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Browse by field */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-green-500" />
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            Browse by field
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FIELD_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(cat.href)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all hover:shadow-md ${cat.style.bg} ${cat.style.border}`}
            >
              <span className="text-2xl">{cat.style.icon}</span>
              <span className={`text-xs font-black leading-tight ${cat.style.accent}`}>
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
