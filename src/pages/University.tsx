import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Mock Data extracted & enhanced with Icons ---
const UNIVERSITY_DATA = {
  name: "Addis Ababa University",
  location: "Addis Ababa",
  rating: "4.8",
  reviewCount: "11k",
  overview: "Addis Ababa University offers broader program options and ranks higher nationally, making it a strong choice for students prioritizing academic reputation. AAU has a more urban campus with more international exposure, while BDU offers a quieter campus life in a smaller city.",
  facts: [
    { label: "Rank", value: "#1 in Ethiopia", icon: Award },
    { label: "UG Programs", value: "66", icon: Building2 },
    { label: "Climate", value: "10-24°C, Mild", icon: Sparkles },
    { label: "Region", value: "Addis Ababa", icon: Globe },
    { label: "Distance", value: "404 Km SE", icon: Navigation },
    { label: "Airport", value: "Available", icon: Plane },
    { label: "Campuses", value: "14", icon: Building2 },
    { label: "Founded", value: "1950", icon: Calendar },
    { label: "Excellence", value: "Research", icon: Star },
    { label: "Generation", value: "First", icon: ShieldCheck },
    { label: "City Pop", value: "3.98M", icon: Users },
    { label: "Autonomous", value: "Yes", icon: ShieldCheck }
  ],
  campuses: [
    {
      id: 1,
      name: "School of Commerce",
      location: "Kirkos, Addis Ababa",
      photoCount: "3 / 42",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      name: "Yared School of Music",
      location: "Yeka, Addis Ababa",
      photoCount: "3 / 42",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      name: "School of Medicine",
      location: "Lideta, Addis Ababa",
      photoCount: "3 / 42",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      name: "School of Information Science",
      location: "Gulele, Addis Ababa",
      rating: "4.4",
      reviews: "4k",
      photoCount: "3 / 42",
      image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1565022536102-f7645c84354a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
  ]
};

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

const UniversityPage: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] pb-20 transition-colors duration-300">

      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-blue/5 dark:bg-brand-blue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute top-1/2 left-0 w-[50%] h-[50%] bg-brand-yellow/5 dark:bg-brand-yellow/10 blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4" />
      </div>

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-6 py-4 flex items-center justify-between transition-colors duration-300 shadow-sm">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-1.5 h-6 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">
              {UNIVERSITY_DATA.name}
            </h1>
          </div>
          
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-all duration-300 shadow-sm"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-brand-blue text-brand-blue' : 'text-slate-700 dark:text-slate-300'}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          
          {/* 2. Desktop Hero Gallery (Masonry-inspired) */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-[50vh] min-h-[400px] mb-12">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] shadow-md border-4 border-white dark:border-zinc-800/50">
              <img src={UNIVERSITY_DATA.gallery[0]} alt="Main Campus" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="hidden md:block relative group overflow-hidden rounded-[1.5rem] shadow-sm border-2 border-white dark:border-zinc-800/50">
              <img src={UNIVERSITY_DATA.gallery[1]} alt="Campus View" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            
            <div className="hidden md:block relative group overflow-hidden rounded-[1.5rem] shadow-sm border-2 border-white dark:border-zinc-800/50">
              <img src={UNIVERSITY_DATA.gallery[2]} alt="Campus View" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            
            <div className="hidden md:block md:col-span-2 relative group overflow-hidden rounded-[1.5rem] shadow-sm border-2 border-white dark:border-zinc-800/50 cursor-pointer">
              <img src={UNIVERSITY_DATA.gallery[3]} alt="Campus View" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-end p-4">
                <div className="bg-white/90 dark:bg-black/70 backdrop-blur-md text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                  View all 42 photos <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Two-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT COLUMN: Overview & Campuses */}
            <div className="lg:col-span-2 space-y-12">

              {/* Title & Overview Bento */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center flex-wrap gap-3 mb-6 text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-brand-blue dark:text-blue-400">
                    <MapPin className="w-4 h-4" /> {UNIVERSITY_DATA.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{UNIVERSITY_DATA.rating}</span>
                    <span className="opacity-70">({UNIVERSITY_DATA.reviewCount})</span>
                  </span>
                </div>

                {/* AI Comparison Bento Box */}
                <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/80 dark:from-blue-900/10 dark:to-amber-900/10 p-6 md:p-8 rounded-[2rem] border border-white/60 dark:border-white/5 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-yellow/10 dark:bg-brand-yellow/5 rounded-full blur-2xl" />
                  
                  <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                      <Sparkles className="w-5 h-5 text-brand-blue" />
                    </div>
                    AI-Powered Overview
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-medium relative z-10">
                    {UNIVERSITY_DATA.overview}
                  </p>
                </div>
              </motion.div>

              {/* Explore Campuses Grid */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2 h-8 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]"></div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore Campuses</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Browse specialized schools and campus locations.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {UNIVERSITY_DATA.campuses.map((campus) => (
                    <div key={campus.id} className="group bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-white/5 rounded-[2rem] p-2 hover:shadow-xl hover:shadow-brand-blue/5 hover:border-brand-blue/30 transition-all duration-300 cursor-pointer flex flex-col">
                      
                      {/* Inner Framed Image */}
                      <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-zinc-800">
                        <img src={campus.image} alt={campus.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {campus.photoCount}
                        </div>
                      </div>

                      <div className="p-4 pt-3 flex flex-col flex-grow">
                        <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors line-clamp-1">{campus.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mt-auto">
                          <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                          <span>{campus.location}</span>
                          {campus.rating && (
                            <>
                              <span className="mx-1 text-slate-300 dark:text-zinc-700">•</span>
                              <Star className="w-3.5 h-3.5 text-brand-yellow fill-current" />
                              <span className="text-slate-700 dark:text-slate-300">{campus.rating}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Sticky Key Facts Sidebar */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-[2rem] p-6 sticky top-28 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-brand-yellow rounded-full shadow-[0_0_10px_#facc15]"></div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Key Facts</h3>
                </div>

                {/* Mini-Bento Grid for Facts */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {UNIVERSITY_DATA.facts.map((fact, index) => {
                    const Icon = fact.icon;
                    return (
                      <div key={index} className="bg-slate-50 dark:bg-zinc-800/50 rounded-[1.25rem] p-3 flex flex-col gap-1.5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                          <Icon size={14} className="text-brand-blue dark:text-blue-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{fact.label}</span>
                        </div>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">
                          {fact.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-zinc-800">
                  <button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-brand-blue/30 flex items-center justify-center gap-2">
                    Start Application
                  </button>
                  <button className="w-full bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-white font-bold py-3.5 rounded-[1.5rem] transition-colors">
                    Compare University
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UniversityPage;