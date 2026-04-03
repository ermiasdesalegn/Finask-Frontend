import { ChevronRight, Heart, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UNIVERSITIES } from "../../constants";
import { cn } from "../../lib/utils";

const DiscoveryHub = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Discovery Hub</h2>
            <p className="text-slate-600 dark:text-slate-400">Find the perfect program for your future career</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl">
            {["All", "Featured", "Top Rated", "Nearby"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeFilter === filter 
                    ? "bg-white dark:bg-brand-blue text-brand-blue dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNIVERSITIES.map((uni) => (
            <motion.div
              key={uni.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={uni.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={uni.name} 
                />
                <button className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors">
                  <Heart size={20} />
                </button>
                {uni.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-brand-yellow text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 dark:text-white group-hover:text-brand-blue transition-colors">{uni.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <MapPin size={14} /> {uni.location}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center gap-1.5 font-bold dark:text-white">
                    <Star size={16} className="text-brand-yellow" fill="currentColor" />
                    {uni.rating} <span className="text-xs text-slate-400 font-medium">({uni.reviews})</span>
                  </div>
                  <Link to={`/universities/${uni.id}`} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHub;
