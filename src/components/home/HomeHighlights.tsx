import { BookOpen, ChevronRight, Heart, MapPin, Navigation, Sparkles, Star, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  displayRating,
  universityCity,
  universityCover,
  universityPath,
} from "../../lib/universityUi";
import type { HomePagePayload, Program, University } from "../../types";

// ── Shared card ────────────────────────────────────────────────────────────

function UniCard({ uni, badge }: { uni: University; badge?: React.ReactNode }) {
  return (
    <Link
      to={universityPath(uni)}
      className="group flex w-56 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md transition-all hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/80 md:w-64"
    >
      <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <img
          src={universityCover(uni)}
          alt={uni.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <div className="absolute left-2.5 top-2.5">{badge}</div>
        )}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2.5 top-2.5 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-md transition-all hover:bg-black/60"
        >
          <Heart size={12} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="mb-1 truncate text-sm font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
          {uni.name}
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <MapPin size={10} className="text-brand-blue" />
          <span className="truncate">{universityCity(uni) || "Ethiopia"}</span>
          <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
          <Star size={10} className="text-brand-yellow" fill="currentColor" />
          <span>{displayRating(uni)}</span>
        </div>
      </div>
    </Link>
  );
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      to={`/programs/${program.slug}`}
      className="group flex w-48 shrink-0 snap-start flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-md transition-all hover:border-brand-blue/30 hover:shadow-lg dark:border-white/5 dark:bg-zinc-900/80 md:w-56"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-brand-blue/10">
        <BookOpen size={18} className="text-brand-blue" />
      </div>
      <p className="text-sm font-black leading-tight text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
        {program.name}
      </p>
      {program.fieldDisplayName && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {program.fieldDisplayName}
        </p>
      )}
      {program.duration && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{program.duration} yrs</p>
      )}
    </Link>
  );
}

// ── Row wrapper ────────────────────────────────────────────────────────────

function Row({
  icon,
  title,
  subtitle,
  viewAllHref,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  viewAllHref: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mb-14"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white md:text-xl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 backdrop-blur-md transition-all hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-900/80 dark:text-slate-400"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </motion.section>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="mb-14">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-100 dark:bg-zinc-800" />
        <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-100 dark:bg-zinc-800" />
      </div>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 w-56 shrink-0 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface Props {
  home: HomePagePayload | null;
  loading: boolean;
}

const HomeHighlights = ({ home, loading }: Props) => {
  if (loading && !home) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {[1, 2, 3].map((i) => <RowSkeleton key={i} />)}
      </div>
    );
  }

  if (!home) return null;

  const featured = home.featured ?? [];
  const trending = home.trending ?? [];
  const rarePrograms = home.rarePrograms ?? [];
  const nearBy = home.nearBy ?? [];
  const suggestedByLocation = home.suggestedByLocation ?? [];
  const suggestedByProgram = home.suggestedByProgram ?? [];
  const topRanked = home.topRanked ?? [];
  const topRated = home.topRated ?? [];
  const topReviewed = home.topReviewed ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">

      {featured.length > 0 && (
        <Row
          icon={<Sparkles size={16} />}
          title="Featured Universities"
          subtitle="Hand-picked top institutions"
          viewAllHref="/universities?filter=featured"
        >
          {featured.map((u) => (
            <UniCard
              key={u.slug}
              uni={u}
              badge={
                <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-black">
                  Featured
                </span>
              }
            />
          ))}
        </Row>
      )}

      {trending.length > 0 && (
        <Row
          icon={<TrendingUp size={16} />}
          title="Trending Now"
          subtitle="What students are exploring this week"
          viewAllHref="/universities"
        >
          {trending.map((u) => (
            <UniCard key={u.slug} uni={u} />
          ))}
        </Row>
      )}

      {nearBy.length > 0 && (
        <Row
          icon={<Navigation size={16} />}
          title="Near You"
          subtitle="Universities close to your location"
          viewAllHref="/universities?filter=nearby"
        >
          {nearBy.map((u) => (
            <UniCard
              key={u.slug}
              uni={u}
              badge={
                (u as any).distanceInKm != null ? (
                  <span className="rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur-md">
                    {(u as any).distanceInKm} km
                  </span>
                ) : undefined
              }
            />
          ))}
        </Row>
      )}

      {suggestedByLocation.length > 0 && (
        <Row
          icon={<MapPin size={16} />}
          title="Similar Climate"
          subtitle="Universities in regions like yours"
          viewAllHref="/universities"
        >
          {suggestedByLocation.map((u) => (
            <UniCard key={u.slug} uni={u} />
          ))}
        </Row>
      )}

      {suggestedByProgram.length > 0 && (
        <Row
          icon={<Trophy size={16} />}
          title="Matching Your Interests"
          subtitle="Based on programs you've explored"
          viewAllHref="/universities"
        >
          {suggestedByProgram.map((u) => (
            <UniCard key={u.slug} uni={u} />
          ))}
        </Row>
      )}

      {topRanked.length > 0 && (
        <Row
          icon={<Trophy size={16} />}
          title="Top Ranked"
          subtitle="Ethiopia's highest ranked universities"
          viewAllHref="/universities?sort=rank"
        >
          {topRanked.map((u, i) => (
            <UniCard
              key={u.slug}
              uni={u}
              badge={
                <span className="rounded-full bg-brand-blue px-2 py-0.5 text-[9px] font-black text-white">
                  #{i + 1}
                </span>
              }
            />
          ))}
        </Row>
      )}

      {topRated.length > 0 && (
        <Row
          icon={<Star size={16} />}
          title="Top Rated"
          subtitle="Highest student satisfaction scores"
          viewAllHref="/universities?sort=rating"
        >
          {topRated.map((u) => (
            <UniCard key={u.slug} uni={u} />
          ))}
        </Row>
      )}

      {topReviewed.length > 0 && (
        <Row
          icon={<TrendingUp size={16} />}
          title="Most Reviewed"
          subtitle="Universities with the most student feedback"
          viewAllHref="/universities"
        >
          {topReviewed.map((u) => (
            <UniCard key={u.slug} uni={u} />
          ))}
        </Row>
      )}

      {rarePrograms.length > 0 && (
        <Row
          icon={<BookOpen size={16} />}
          title="Rare Programs"
          subtitle="Unique offerings you won't find everywhere"
          viewAllHref="/programs"
        >
          {rarePrograms.map((p) => (
            <ProgramCard key={p.slug} program={p} />
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomeHighlights;
