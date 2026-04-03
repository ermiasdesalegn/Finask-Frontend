import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight, Compass, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { UNIVERSITIES } from "../../constants";

// --- Custom HTML Markers (Replaces default Leaflet pins) ---
const createCustomMarker = (isFeatured: boolean) => L.divIcon({
  className: 'bg-transparent border-0',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 group cursor-pointer">
      <div class="absolute w-full h-full rounded-full ${isFeatured ? 'bg-brand-yellow' : 'bg-brand-blue'} opacity-30 animate-ping"></div>
      <div class="relative w-4 h-4 rounded-full ${isFeatured ? 'bg-brand-yellow' : 'bg-brand-blue'} border-[3px] border-white dark:border-zinc-900 shadow-md group-hover:scale-125 transition-transform duration-300"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Helper component to set map view
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const EthiopiaMap = () => {
  const [activeUniversity, setActiveUniversity] = useState<string | null>(null);
  const navigate = useNavigate();

  // Calibrated to match your screenshot perfectly
  const defaultCenter: [number, number] = [9.145, 39.5]; 
  const defaultZoom = 6; 

  return (
    <section className="py-24 px-6 bg-slate-50/50 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-20 left-1/4 w-[40%] h-[400px] bg-brand-blue/5 dark:bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-md text-brand-blue dark:text-blue-400 rounded-full text-xs font-bold mb-4 border border-slate-200/60 dark:border-white/10 shadow-sm uppercase tracking-wider"
            >
              <Compass size={14} className={activeUniversity ? "animate-spin-slow" : ""} />
              Interactive Map
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">Discover Campuses</h2>
            <p className="text-slate-500 dark:text-slate-400">Explore top universities mapped across all regions of Ethiopia</p>
          </div>
          
          <Link to="/universities" className="hidden md:flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold transition-all shadow-sm group">
            View Directory <ChevronRight size={16} className="text-brand-blue group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* LEFT: The Leaflet Map (Takes up 7 columns on LG) */}
          <div className="lg:col-span-7 relative h-[550px] bg-white dark:bg-[#121212] rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-white/5 overflow-hidden z-0 group">
            
            <MapContainer 
              center={defaultCenter} 
              zoom={defaultZoom} 
              scrollWheelZoom={false}
              attributionControl={false} // Removes Leaflet Watermark
              className="w-full h-full relative z-10 bg-[#f8f9fa] dark:bg-[#121212]"
            >
              {/* CartoDB Minimalist Tiles - Inverts smoothly in dark mode */}
              <TileLayer
                className="dark:invert dark:hue-rotate-180 dark:brightness-90 dark:contrast-125 transition-all duration-500"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              
              <MapController center={defaultCenter} zoom={defaultZoom} />

              {/* Render Universities as Custom Markers */}
              {UNIVERSITIES.map((uni) => {
                if (!uni.lat || !uni.lng) return null; 

                return (
                  <Marker 
                    key={uni.id} 
                    position={[uni.lat, uni.lng]} 
                    icon={createCustomMarker(uni.featured)}
                    eventHandlers={{ click: () => setActiveUniversity(uni.name) }}
                  >
                    <Popup>
                      <div className="w-64 bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-slate-100 dark:border-white/10 shadow-2xl overflow-hidden p-2">
                        <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
                          {uni.featured && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-brand-yellow/90 backdrop-blur-md text-amber-900 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-sm">
                              <Star size={8} fill="currentColor" /> Featured
                            </div>
                          )}
                        </div>
                        <div className="p-3 pb-2">
                          <h4 className="font-black text-slate-900 dark:text-white text-base mb-2 leading-tight">{uni.name}</h4>
                          <div className="flex items-center justify-between text-xs mb-4">
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                              <MapPin size={12} className="text-brand-blue" /> {uni.location}
                            </span>
                            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold">
                              <Star size={12} className="text-amber-400 fill-current" /> {uni.rating}
                            </span>
                          </div>
                          <button 
                            onClick={() => navigate(`/universities/${uni.id}`)}
                            className="w-full bg-slate-50 dark:bg-zinc-800 hover:bg-brand-blue dark:hover:bg-brand-blue text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300"
                          >
                            Explore Campus <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Floating Status Pill */}
            <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-black/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 px-5 py-3 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 z-[400] shadow-lg shadow-slate-200/20 dark:shadow-none">
              <span className={`w-2.5 h-2.5 rounded-full ${activeUniversity ? 'bg-brand-yellow animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-brand-blue shadow-[0_0_8px_rgba(37,99,235,0.6)]'}`} />
              {activeUniversity ? activeUniversity : "Select a pin to preview"}
            </div>
          </div>

          {/* RIGHT: Top Universities List (Takes up 5 columns on LG) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-1.5 h-6 bg-gradient-to-b from-brand-blue to-brand-yellow rounded-full" />
               <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Top Rated</h3>
            </div>
            
            <div className="space-y-4 flex-grow">
              {UNIVERSITIES.slice(0, 4).map((uni, index) => (
                <motion.div 
                  key={uni.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/universities/${uni.id}`)}
                  className="p-2.5 bg-white dark:bg-zinc-900/80 backdrop-blur-md rounded-[1.5rem] shadow-sm border border-slate-200/80 dark:border-white/5 flex gap-4 hover:shadow-xl hover:shadow-brand-blue/5 hover:border-brand-blue/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    <img src={uni.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" alt={uni.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="flex flex-col justify-center pr-2 py-1 flex-grow">
                    <h4 className="font-black text-base text-slate-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors line-clamp-1">{uni.name}</h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <MapPin size={12} className="text-brand-blue" /> {uni.location}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                        <Star size={12} className="text-amber-400" fill="currentColor" /> {uni.rating}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/universities" className="mt-2 md:hidden flex items-center justify-center gap-2 w-full py-4 bg-slate-100 dark:bg-zinc-800 hover:bg-brand-blue text-slate-700 dark:text-white hover:text-white rounded-2xl font-bold transition-all duration-300 group">
              View Directory <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EthiopiaMap;