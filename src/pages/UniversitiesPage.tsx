import {
  ArrowUpDown,
  Building2,
  Check,
  ChevronRight,
  CloudSun,
  Filter,
  Heart,
  Landmark,
  Map as MapIcon,
  MapPin,
  Plane,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trees,
  Trophy
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedGridPattern } from '../components/ui/animated-grid-pattern';
import { cn } from '../lib/utils';

// --- Expanded Mock Data ---
const REGIONS = ['All', 'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama', 'SNNPR', 'Somali'];

const UNIVERSITIES = [
  { id: 'aau', name: 'Addis Ababa University', location: 'Addis Ababa', rating: '4.8', reviews: '11k', region: 'Addis Ababa', featured: true, type: 'Public', setting: 'Urban', excellence: 'Research', rank: '1 in Ethiopia', distance: 'City', climate: 'Mild', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600' },
  { id: 'bdu', name: 'Bahir Dar University', location: 'Bahir Dar', rating: '4.6', reviews: '7.6k', region: 'Amhara', featured: false, type: 'Public', setting: 'Suburban', excellence: 'Research', rank: '3 in Ethiopia', distance: 'City', climate: 'Warm, Tropical', image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600' },
  { id: 'dtu', name: 'Debre Tabor University', location: 'Debre Tabor', rating: '3.9', reviews: '2.8k', region: 'Amhara', featured: false, type: 'Public', setting: 'Rural', excellence: 'General', rank: '15 in Ethiopia', distance: '75km', climate: 'Cool, Temperate', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600' },
  { id: 'ju', name: 'Jimma University', location: 'Jimma', rating: '4.6', reviews: '8k', region: 'Oromia', featured: true, type: 'Public', setting: 'Rural', excellence: 'Research', rank: '2 in Ethiopia', distance: '353km', climate: 'Warm, Subtropical', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600' },
  { id: 'mu', name: 'Mekelle University', location: 'Mekelle', rating: '4.7', reviews: '7k', region: 'Tigray', featured: false, type: 'Public', setting: 'Urban', excellence: 'Research', rank: '4 in Ethiopia', distance: '780km', climate: 'Semi-Arid', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600' },
  { id: 'amu', name: 'Arba Minch University', location: 'Arba Minch', rating: '4.4', reviews: '4k', region: 'SNNPR', featured: false, type: 'Public', setting: 'Suburban', excellence: 'Applied', rank: '8 in Ethiopia', distance: '434km', climate: 'Hot, Tropical', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600' },
  { id: 'gu', name: 'University of Gondar', location: 'Gondar', rating: '4.5', reviews: '10k', region: 'Amhara', featured: false, type: 'Public', setting: 'Rural', excellence: 'Research', rank: '5 in Ethiopia', distance: '180km', climate: 'Mild, Temperate', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600' },
  { id: 'aastu', name: 'AASTU', location: 'Addis Ababa', rating: '4.8', reviews: '9k', region: 'Addis Ababa', featured: true, type: 'Public', setting: 'Urban', excellence: 'Specialized', rank: '12 in Ethiopia', distance: 'City', climate: 'Mild', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600' },
  { id: 'astu', name: 'ASTU', location: 'Adama', rating: '4.6', reviews: '5k', region: 'Oromia', featured: false, type: 'Public', setting: 'Urban', excellence: 'Specialized', rank: '11 in Ethiopia', distance: '100km', climate: 'Warm', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600' },
  { id: 'aku', name: 'Aksum University', location: 'Aksum', rating: '3.4', reviews: '1.1k', region: 'Tigray', featured: false, type: 'Public', setting: 'Rural', excellence: 'Applied', rank: '29 in Ethiopia', distance: '1000km', climate: 'Semi-Arid', image: 'https://images.unsplash.com/photo-1565022536102-f7645c84354a?auto=format&fit=crop&q=80&w=600' },
  { id: 'hu', name: 'Hawassa University', location: 'Hawassa', rating: '4.5', reviews: '6.2k', region: 'Sidama', featured: true, type: 'Public', setting: 'Urban', excellence: 'Research', rank: '6 in Ethiopia', distance: '275km', climate: 'Warm, Temperate', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600' }
];

const CITIES = [
  { id: 'addis', name: 'Addis Ababa', universities: 'AAU and AASTU', climate: 'Mild, Temperate', type: 'Capital', airport: 'Available', distance: 'Base City', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600' },
  { id: 'bahir', name: 'Bahir Dar', universities: 'Bahir Dar University', climate: 'Warm, Tropical Wet', type: 'Amhara', airport: 'Available', distance: '484km NW from Addis', image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600' },
  { id: 'dire', name: 'Dire Dawa', universities: 'Dire Dawa University', climate: 'Hot, Semi-Arid', type: 'Dire Dawa', airport: 'Available', distance: '452km E from Addis', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600' },
  { id: 'jimma', name: 'Jimma', universities: 'Jimma University', climate: 'Warm, Subtropical', type: 'Oromia', airport: 'Available', distance: '353km SW from Addis', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600' },
];

// --- Animations ---
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } };

type FilterState = { minRating: number | null; featuredOnly: boolean; type: string | null; setting: string | null; };
type SortOption = 'rating-desc' | 'name-asc' | 'name-desc';

const UniversitiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  
  const [filters, setFilters] = useState<FilterState>({ minRating: null, featuredOnly: false, type: null, setting: null });
  const navigate = useNavigate();

  const activeFilterCount = Object.values(filters).filter(v => v !== null && v !== false).length;
  const clearFilters = () => setFilters({ minRating: null, featuredOnly: false, type: null, setting: null });

  const isBrowsingMode = searchQuery === '' && activeFilterCount === 0 && activeRegion === 'All';

  const filteredAndSortedUniversities = useMemo(() => {
    let result = UNIVERSITIES.filter(u => {
      const matchRegion = activeRegion === 'All' || u.region === activeRegion;
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRating = filters.minRating === null || parseFloat(u.rating) >= filters.minRating;
      const matchFeatured = !filters.featuredOnly || u.featured;
      const matchType = filters.type === null || u.type === filters.type;
      const matchSetting = filters.setting === null || u.setting === filters.setting;
      return matchRegion && matchSearch && matchRating && matchFeatured && matchType && matchSetting;
    });

    return result.sort((a, b) => {
      if (sortBy === 'rating-desc') return parseFloat(b.rating) - parseFloat(a.rating);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [searchQuery, activeRegion, filters, sortBy]);

  // --- Reusable Horizontal Scroll Row Component ---
  const HorizontalRow = ({ title, subtitle, items, renderItem }: any) => (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-brand-blue to-brand-yellow rounded-full shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        <button className="text-brand-blue font-bold text-sm hover:underline hidden sm:block">See All</button>
      </div>
      <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 lg:mx-0 lg:px-0">
        {items.map((item: any) => renderItem(item))}
      </div>
    </section>
  );

  // --- Render Functions for Cards ---
  const renderUniCard = (uni: typeof UNIVERSITIES[0]) => (
    <motion.div 
      variants={itemVariants}
      key={uni.id} 
      onClick={() => navigate(`/universities/${uni.id}`)}
      className="flex-shrink-0 w-72 md:w-80 snap-start group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-slate-200/60 dark:border-white/5 rounded-[1.5rem] p-2 hover:shadow-xl hover:shadow-brand-blue/5 hover:border-brand-blue/30 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-44 md:h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 mb-3">
        <img src={uni.image} alt={uni.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        <button className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95" onClick={(e) => e.stopPropagation()}>
          <Heart size={14} />
        </button>
      </div>
      <div className="px-3 pb-3">
        <h3 className="font-black text-base md:text-lg text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors truncate">{uni.name}</h3>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
          <MapPin size={12} className="text-brand-blue" /> {uni.location}
          <span className="mx-1 text-slate-300 dark:text-slate-600">•</span>
          <Star size={12} className="text-brand-yellow" fill="currentColor" /> {uni.rating}
        </div>
        <div className="flex gap-2 flex-wrap">
          {uni.rank && (
            <span className="px-2.5 py-1 bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
              <Trophy size={10} /> {uni.rank}
            </span>
          )}
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
             <CloudSun size={10}/> {uni.climate.split(',')[0]}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const renderCityCard = (city: typeof CITIES[0]) => (
    <motion.div 
      variants={itemVariants}
      key={city.id}
      className="flex-shrink-0 w-80 md:w-96 snap-start group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-slate-200/60 dark:border-white/5 rounded-[1.5rem] overflow-hidden hover:shadow-xl hover:shadow-brand-blue/5 hover:border-brand-blue/30 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
        <h3 className="absolute bottom-4 left-5 font-black text-2xl text-white tracking-tight">{city.name}</h3>
        <button className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95">
          <Heart size={14} />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Landmark size={14} className="text-slate-400" /> {city.universities}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2"><CloudSun size={14} /> {city.climate}</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> {city.type}</div>
          <div className="flex items-center gap-2"><Plane size={14} /> {city.airport}</div>
          <div className="flex items-center gap-2"><MapIcon size={14} /> {city.distance}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full pb-20 relative pt-4 min-h-screen transition-colors duration-300">
      
      {/* Fixed Animated Grid Pattern Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.2}
          duration={3}
          repeatDelay={1}
          className={cn(
            "absolute inset-0 h-full w-full",
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "skew-y-12"
          )}
        />
      </div>
      
      {/* Soft Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-blue/5 dark:bg-brand-blue/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-yellow/5 dark:bg-brand-yellow/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* 1. Hero Title */}
        <section className="pt-4 pb-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-md text-brand-blue dark:text-blue-400 rounded-full text-xs font-bold mb-4 border border-slate-200/60 dark:border-white/10 shadow-sm uppercase tracking-wider"
            >
              <Sparkles size={14} className="text-brand-yellow" />
              University Directory
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Find Your <span className="text-brand-blue">Perfect Fit</span>
            </motion.h1>
          </div>
        </section>

        {/* 2. The Command Center (Search, Filter, Sort, Map) */}
        <section className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-2 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col md:flex-row items-center gap-2 relative z-30"
          >
            {/* Search Input */}
            <div className="relative w-full flex-grow flex items-center h-12 md:h-14 group">
              <Search className="absolute left-5 h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
              <input
                type="text"
                className="w-full h-full pl-12 pr-6 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-base"
                placeholder="Search by university, program, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-1.5 pr-2">
              <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-2" />
              
              <button 
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Filter size={14} /> Filter
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-blue text-white text-[10px] flex items-center justify-center ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    showSort ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ArrowUpDown size={14} /> Sort
                </button>
                
                <AnimatePresence>
                  {showSort && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 p-1"
                    >
                      {[
                        { id: 'rating-desc', label: 'Highest Rated' },
                        { id: 'name-asc', label: 'Name (A-Z)' },
                        { id: 'name-desc', label: 'Name (Z-A)' }
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id as SortOption); setShowSort(false); }}
                          className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl flex items-center justify-between transition-colors ${
                            sortBy === option.id 
                              ? 'bg-blue-50 dark:bg-brand-blue/10 text-brand-blue' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {option.label}
                          {sortBy === option.id && <Check size={14} className="text-brand-blue" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors">
                <MapIcon size={14} /> Map
              </button>
            </div>

            {/* Mobile Action Buttons */}
            <div className="w-full flex md:hidden items-center gap-2 overflow-x-auto pb-2 px-2 snap-x [&::-webkit-scrollbar]:hidden">
              <button 
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border ${showFilters || activeFilterCount > 0 ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200'}`}
              >
                <Filter size={12} /> Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <button 
                onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                className="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200"
              >
                <ArrowUpDown size={12} /> Sort
              </button>
              <button className="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200">
                <MapIcon size={12} /> Map
              </button>
            </div>
          </motion.div>

          {/* Expandable Compact Advanced Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden relative z-20"
              >
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-5 lg:p-6 shadow-xl shadow-slate-200/30 dark:shadow-none text-left">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-zinc-800/50">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                      <SlidersHorizontal size={14} className="text-brand-blue" /> Advanced Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs font-bold text-brand-blue hover:text-blue-700 dark:hover:text-blue-400 transition-colors bg-blue-50 dark:bg-brand-blue/10 px-3 py-1 rounded-lg">
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Compact Grid Layout for Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Star size={10}/> Min Rating</p>
                      <div className="flex bg-slate-100/80 dark:bg-zinc-800/80 p-1 rounded-xl w-full">
                        {([null, 4.0, 4.4, 4.7] as (number | null)[]).map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => setFilters(f => ({ ...f, minRating: val }))}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                              filters.minRating === val ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {val === null ? 'Any' : `${val}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building2 size={10}/> Status</p>
                      <div className="flex bg-slate-100/80 dark:bg-zinc-800/80 p-1 rounded-xl w-full">
                        {([null, 'Public', 'Private']).map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => setFilters(f => ({ ...f, type: val }))}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                              filters.type === val ? 'bg-white dark:bg-zinc-700 text-brand-blue shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {val === null ? 'Any' : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Trees size={10}/> Setting</p>
                      <div className="flex bg-slate-100/80 dark:bg-zinc-800/80 p-1 rounded-xl w-full">
                        {([null, 'Urban', 'Suburban', 'Rural']).map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => setFilters(f => ({ ...f, setting: val }))}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                              filters.setting === val ? 'bg-white dark:bg-zinc-700 text-brand-blue shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {val === null ? 'Any' : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={10}/> Highlights</p>
                      <button
                        onClick={() => setFilters(f => ({ ...f, featuredOnly: !f.featuredOnly }))}
                        className={`w-full flex items-center justify-between py-1.5 px-3 rounded-xl border transition-all duration-300 ${
                          filters.featuredOnly 
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30' 
                            : 'bg-white dark:bg-zinc-800/50 border-slate-200 dark:border-white/5 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-xs font-bold ${filters.featuredOnly ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          Featured Only
                        </span>
                        <div className={`w-8 h-4.5 rounded-full p-0.5 flex items-center transition-colors duration-300 ${filters.featuredOnly ? 'bg-brand-yellow' : 'bg-slate-300 dark:bg-zinc-600'}`}>
                          <motion.div 
                            layout 
                            className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" 
                            animate={{ x: filters.featuredOnly ? 14 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Region Pills */}
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="w-full mt-5"
          >
            <div className="flex items-center overflow-x-auto gap-2.5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`flex-shrink-0 snap-start px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeRegion === region 
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30' 
                      : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- DYNAMIC CONTENT AREA --- */}
        {isBrowsingMode ? (
          /* DISCOVERY DASHBOARD (When not searching/filtering) */
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            
            <HorizontalRow 
              title="Universities Near You" 
              subtitle="Based in Bahir Dar, Amhara"
              items={UNIVERSITIES.filter(u => u.region === 'Amhara' || u.location === 'Bahir Dar').slice(0,4)}
              renderItem={renderUniCard}
            />

            <HorizontalRow 
              title="Institutional Excellence" 
              subtitle="Top Research Institutions in Ethiopia"
              items={UNIVERSITIES.filter(u => u.excellence === 'Research')}
              renderItem={renderUniCard}
            />

            <HorizontalRow 
              title="Explore Cities" 
              subtitle="Discover universities by major hubs"
              items={CITIES}
              renderItem={renderCityCard}
            />

            <HorizontalRow 
              title="Matching your Interests" 
              subtitle="Specialized programs based on your views"
              items={UNIVERSITIES.filter(u => u.excellence === 'Specialized' || u.featured)}
              renderItem={renderUniCard}
            />

          </motion.div>
        ) : (
          /* SEARCH/FILTER RESULTS GRID */
          <section className="mb-20">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-brand-blue rounded-full shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
                 <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Campus Directory</h2>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {filteredAndSortedUniversities.length} {filteredAndSortedUniversities.length === 1 ? 'Result' : 'Results'}
                </span>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key="directory-grid"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredAndSortedUniversities.map(renderUniCard)}
                
                {filteredAndSortedUniversities.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex w-16 h-16 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl items-center justify-center mb-4 text-slate-300 dark:text-slate-600 border border-slate-200/60 dark:border-white/5"
                    >
                       <Search size={24} />
                    </motion.div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No campuses found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Try tweaking your search terms or clearing the filters.</p>
                    <button onClick={clearFilters} className="mt-4 text-sm text-brand-blue font-bold hover:underline">
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

      </div>
    </div>
  );
};

export default UniversitiesPage;