import { Clock, GraduationCap, Heart, MapPin, Search, Sparkles, Star, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNIVERSITIES } from '../constants';

const PROGRAM_CATEGORIES = [
  {
    id: 'engineering', name: 'Engineering & Technology', icon: '⚙️',
    accent: 'text-brand-blue', border: 'border-blue-500/20',
    bg: 'bg-blue-50 dark:bg-blue-500/10', pill: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    bar: 'bg-brand-blue', description: 'Build the infrastructure of tomorrow', duration: '5 yrs',
    programs: ['Software Engineering', 'Computer Science', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Technology'],
  },
  {
    id: 'medicine', name: 'Health & Medical Sciences', icon: '🩺',
    accent: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20',
    bg: 'bg-sky-50 dark:bg-sky-500/10', pill: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
    bar: 'bg-sky-500', description: 'Heal and transform lives', duration: '6 yrs',
    programs: ['Medicine', 'Health Sciences', 'Pharmacy', 'Nursing', 'Veterinary Medicine'],
  },
  {
    id: 'business', name: 'Business & Economics', icon: '📊',
    accent: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10', pill: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    bar: 'bg-brand-yellow', description: 'Lead organizations and shape policy', duration: '4 yrs',
    programs: ['Business', 'Economics', 'Management', 'Accounting'],
  },
  {
    id: 'social', name: 'Social Science & Law', icon: '🌍',
    accent: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10', pill: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    bar: 'bg-indigo-500', description: 'Understand society and culture', duration: '4 yrs',
    programs: ['Law', 'Sociology', 'Psychology', 'History', 'Social Sciences'],
  },
  {
    id: 'agriculture', name: 'Agriculture & Environment', icon: '🌱',
    accent: 'text-green-600 dark:text-green-400', border: 'border-green-500/20',
    bg: 'bg-green-50 dark:bg-green-500/10', pill: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
    bar: 'bg-green-500', description: 'Feed the nation, sustain the planet', duration: '4 yrs',
    programs: ['Agriculture', 'Environmental Science', 'Water Technology', 'Natural Sciences'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const ProgramsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredCategories = PROGRAM_CATEGORIES
    .filter(cat => !activeCategory || cat.id === activeCategory)
    .filter(cat =>
      !search ||
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.programs.some(p => p.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="w-full min-h-screen pb-24 bg-white dark:bg-[#121212] transition-colors duration-300 relative">
      <div className="fixed top-0 right-0 w-[45%] h-[45%] bg-brand-blue/5 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[45%] h-[45%] bg-brand-yellow/5 blur-[140px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      {/* HERO */}
      <section className="relative z-10 pt-10 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-brand-blue rounded-full text-sm font-bold border border-blue-100 dark:border-blue-500/20">
              <Sparkles size={15} className="text-brand-yellow" /> Browse 200+ Programs across Ethiopia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-center text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.92] mb-4"
          >
            Find Your<br /><span className="text-brand-blue">Perfect Program</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-center text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto"
          >
            Explore fields of study across Ethiopia's top universities and start shaping your future.
          </motion.p>

          {/* Search + filter card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-white/10">
              <Search className="w-5 h-5 text-brand-blue flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Search programs, e.g. Medicine, Engineering..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-2 px-5 py-4">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-[2rem] text-sm font-bold transition-all duration-200 ${activeCategory === null ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
              >All Fields</button>
              {PROGRAM_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 rounded-[2rem] text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                >
                  <span>{cat.icon}</span><span className="hidden sm:inline">{cat.name.split(' &')[0]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROGRAM SECTIONS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-20">
        {filteredCategories.map((cat, catIndex) => {
          const matchedPrograms = cat.programs.filter(p => !search || p.toLowerCase().includes(search.toLowerCase()));
          if (matchedPrograms.length === 0) return null;
          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ delay: catIndex * 0.04 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 ${cat.bar} rounded-full shadow-lg`} />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-2xl">{cat.icon}</span>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{cat.name}</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
                  </div>
                </div>
                <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cat.bg} ${cat.accent} border ${cat.border}`}>
                  <Clock size={11} /> {cat.duration}
                </span>
              </div>

              <div className="space-y-10">
                {matchedPrograms.map(program => {
                  const unis = UNIVERSITIES.filter(u => u.programs.some(p => p.toLowerCase() === program.toLowerCase()));
                  if (unis.length === 0) return null;
                  return (
                    <div key={program}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${cat.pill}`}>{program}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{unis.length} {unis.length === 1 ? 'university' : 'universities'}</span>
                        </div>
                        <button className={`text-xs font-bold ${cat.accent} hover:underline hidden sm:block`}>See All</button>
                      </div>
                      <motion.div
                        variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      >
                        {unis.map(uni => (
                          <motion.div
                            variants={itemVariants} key={uni.id}
                            onClick={() => navigate(`/universities/${uni.id}`)}
                            className="flex-shrink-0 w-64 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 hover:border-brand-blue/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              {uni.featured && (
                                <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand-yellow text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                  <Star size={9} fill="currentColor" /> Featured
                                </div>
                              )}
                              <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full text-white transition-all hover:scale-110" onClick={e => e.stopPropagation()}>
                                <Heart size={13} />
                              </button>
                            </div>
                            <div className="p-4">
                              <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-blue transition-colors">{uni.name}</h4>
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <MapPin size={11} className="text-brand-blue flex-shrink-0" /> {uni.location}
                              </div>
                              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                                  <Star size={11} className="text-brand-yellow" fill="currentColor" />
                                  {uni.rating} <span className="text-slate-400 font-normal">({uni.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                  <GraduationCap size={11} /> {cat.duration}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}

        {filteredCategories.filter(cat => cat.programs.some(p => !search || p.toLowerCase().includes(search.toLowerCase()))).length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-32 text-center">
            <div className="inline-flex w-20 h-20 bg-white dark:bg-zinc-900 shadow-xl rounded-[2rem] items-center justify-center mb-6 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-white/5">
              <Search size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No programs found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try a different search term or clear the filter.</p>
            <button onClick={() => { setSearch(''); setActiveCategory(null); }} className="px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/30">
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;
