import { BookOpen, Building2, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

type UniResult = {
  _id: string;
  name: string;
  slug?: string;
  coverImage?: string;
  address?: { city?: string };
  score?: number;
};

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

function universityPathSegment(u: UniResult): string | null {
  const s = u.slug?.trim();
  if (s) return s;
  if (OBJECT_ID_RE.test(u._id)) return u._id;
  return null;
}

type ProgramResult = {
  _id: string;
  name: string;
  slug: string;
  field: string;
};

type CityResult = {
  _id: string;
  name: string;
  slug: string;
  coverImage?: string;
  score?: number;
};

type SearchResults = {
  universities: UniResult[];
  programs: ProgramResult[];
  cities: CityResult[];
};

interface Props {
  open: boolean;
  results: SearchResults | null;
  loading: boolean;
  query: string;
  onClose: () => void;
}

const Section = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="mb-1">
    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
      {icon}
      {label}
    </div>
    {children}
  </div>
);

const Row = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-zinc-800"
  >
    {children}
  </button>
);

export function SearchDropdown({ open, results, loading, query, onClose }: Props) {
  const navigate = useNavigate();

  const unis = (results?.universities ?? []) as UniResult[];
  const programs = (results?.programs ?? []) as ProgramResult[];
  const cities = (results?.cities ?? []) as CityResult[];
  const isEmpty =
    !loading &&
    unis.length === 0 &&
    programs.length === 0 &&
    cities.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="search-dropdown-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            key="search-dropdown-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-900"
          >
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
            </div>
          )}

          {!loading && isEmpty && (
            <p className="py-8 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!loading && unis.length > 0 && (
            <Section icon={<Building2 size={10} />} label="Universities">
              {unis.slice(0, 5).map((u) => (
                <Row
                  key={u._id}
                  onClick={() => {
                    const seg = universityPathSegment(u);
                    if (seg) {
                      navigate(`/universities/${encodeURIComponent(seg)}`);
                      onClose();
                    }
                  }}
                >
                  {u.coverImage ? (
                    <img src={u.coverImage} alt={u.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-brand-blue/10">
                      <Building2 size={14} className="text-brand-blue" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 dark:text-white">{u.name}</p>
                    {u.address?.city && (
                      <p className="truncate text-xs text-slate-400">{u.address.city}</p>
                    )}
                  </div>
                </Row>
              ))}
            </Section>
          )}

          {!loading && programs.length > 0 && (
            <Section icon={<BookOpen size={10} />} label="Programs">
              {programs.slice(0, 5).map((p) => (
                <Row
                  key={p.slug}
                  onClick={() => { navigate(`/programs/${p.slug}`); onClose(); }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-brand-yellow/10">
                    <BookOpen size={14} className="text-brand-yellow" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="truncate text-xs capitalize text-slate-400">
                      {p.field?.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                  </div>
                </Row>
              ))}
            </Section>
          )}

          {!loading && cities.length > 0 && (
            <Section icon={<MapPin size={10} />} label="Cities">
              {cities.slice(0, 4).map((c) => (
                <Row
                  key={c.slug}
                  onClick={() => { navigate(`/universities?city=${c.slug}`); onClose(); }}
                >
                  {c.coverImage ? (
                    <img src={c.coverImage} alt={c.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                      <MapPin size={14} className="text-green-500" />
                    </div>
                  )}
                  <p className="truncate font-bold text-slate-900 dark:text-white">{c.name}</p>
                </Row>
              ))}
            </Section>
          )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
