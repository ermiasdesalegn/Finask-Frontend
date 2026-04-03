import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight, Compass, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import {
  displayRating,
  universityCity,
  universityCover,
  universityPath,
} from "../../lib/universityUi";
import type { University } from "../../types";

const createCustomMarker = (isFeatured: boolean) =>
  L.divIcon({
    className: "border-0 bg-transparent",
    html: `
    <div class="relative flex h-8 w-8 cursor-pointer items-center justify-center group">
      <div class="absolute h-full w-full rounded-full ${isFeatured ? "bg-brand-yellow" : "bg-brand-blue"} opacity-30 animate-ping"></div>
      <div class="relative h-4 w-4 rounded-full ${isFeatured ? "bg-brand-yellow" : "bg-brand-blue"} border-[3px] border-white shadow-md transition-transform duration-300 group-hover:scale-125 dark:border-zinc-900"></div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const MapController = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const EthiopiaMap = ({
  universities,
  loading,
}: {
  universities: University[];
  loading: boolean;
}) => {
  const [activeUniversity, setActiveUniversity] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const defaultCenter: [number, number] = [9.145, 39.5];
  const defaultZoom = 6;

  const withCoords = universities.filter((u) => {
    const c = u.location?.coordinates;
    return Array.isArray(c) && c.length >= 2;
  });

  const sidebar = universities.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-slate-50/50 px-6 py-24 transition-colors duration-300 dark:bg-[#0a0a0a]">
      <div className="pointer-events-none absolute left-1/4 top-20 h-[400px] w-[40%] rounded-full bg-brand-blue/5 blur-[120px] dark:bg-brand-blue/10" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-blue-400"
            >
              <Compass
                size={14}
                className={activeUniversity ? "animate-spin-slow" : ""}
              />
              Interactive Map
            </motion.div>
            <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Discover Campuses
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Explore top universities mapped across all regions of Ethiopia
            </p>
          </div>

          <Link
            to="/universities"
            className="group hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 md:flex"
          >
            View Directory{" "}
            <ChevronRight
              size={16}
              className="text-brand-blue transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 xl:gap-12">
          <div className="relative z-0 h-[550px] overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 group dark:border-white/5 dark:bg-[#121212] dark:shadow-none lg:col-span-7">
            <MapContainer
              center={defaultCenter}
              zoom={defaultZoom}
              scrollWheelZoom={false}
              attributionControl={false}
              className="relative z-10 h-full w-full bg-[#f8f9fa] dark:bg-[#121212]"
            >
              <TileLayer
                className="transition-all duration-500 dark:invert dark:hue-rotate-180 dark:brightness-90 dark:contrast-125"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <MapController center={defaultCenter} zoom={defaultZoom} />

              {withCoords.map((uni) => {
                const c = uni.location!.coordinates!;
                const lng = Number(c[0]);
                const lat = Number(c[1]);
                if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                return (
                  <Marker
                    key={uni.slug || uni._id}
                    position={[lat, lng]}
                    icon={createCustomMarker(Boolean(uni.isFeatured))}
                    eventHandlers={{
                      click: () => setActiveUniversity(uni.name),
                    }}
                  >
                    <Popup>
                      <div className="w-64 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
                        <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                          <img
                            src={universityCover(uni)}
                            alt={uni.name}
                            className="h-full w-full object-cover"
                          />
                          {uni.isFeatured && (
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-brand-yellow/90 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-900 shadow-sm backdrop-blur-md">
                              <Star size={8} fill="currentColor" /> Featured
                            </div>
                          )}
                        </div>
                        <div className="p-3 pb-2">
                          <h4 className="mb-2 text-base font-black leading-tight text-slate-900 dark:text-white">
                            {uni.name}
                          </h4>
                          <div className="mb-4 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                              <MapPin size={12} className="text-brand-blue" />{" "}
                              {universityCity(uni) || "Ethiopia"}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                              <Star
                                size={12}
                                className="fill-current text-amber-400"
                              />{" "}
                              {displayRating(uni)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(universityPath(uni))
                            }
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-all duration-300 hover:bg-brand-blue hover:text-white dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-brand-blue dark:hover:text-white"
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

            <div className="absolute bottom-6 left-6 z-[400] flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 px-5 py-3 text-xs font-bold text-slate-700 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-white/10 dark:bg-black/70 dark:text-slate-300 dark:shadow-none">
              <span
                className={`h-2.5 w-2.5 rounded-full ${activeUniversity ? "animate-pulse bg-brand-yellow shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-brand-blue shadow-[0_0_8px_rgba(37,99,235,0.6)]"}`}
              />
              {activeUniversity ? activeUniversity : "Select a pin to preview"}
            </div>
          </div>

          <div className="flex h-full flex-col space-y-6 lg:col-span-5">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand-blue to-brand-yellow" />
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
                Top Rated
              </h3>
            </div>

            {loading && !sidebar.length ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800"
                  />
                ))}
              </div>
            ) : (
              <div className="flex-grow space-y-4">
                {sidebar.map((uni, index) => (
                  <motion.div
                    key={uni.slug || uni._id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(universityPath(uni))}
                    className="group flex cursor-pointer gap-4 rounded-[1.5rem] border border-slate-200/80 bg-white p-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 dark:border-white/5 dark:bg-zinc-900/80"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                      <img
                        src={universityCover(uni)}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        alt={uni.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="flex flex-grow flex-col justify-center py-1 pr-2">
                      <h4 className="mb-2 line-clamp-1 text-base font-black text-slate-900 transition-colors group-hover:text-brand-blue dark:text-white">
                        {uni.name}
                      </h4>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <MapPin size={12} className="text-brand-blue" />{" "}
                          {universityCity(uni) || "Ethiopia"}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-xs font-black text-slate-800 dark:bg-white/5 dark:text-slate-200">
                          <Star
                            size={12}
                            className="text-amber-400"
                            fill="currentColor"
                          />{" "}
                          {displayRating(uni)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <Link
              to="/universities"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 font-bold text-slate-700 transition-all duration-300 hover:bg-brand-blue hover:text-white dark:bg-zinc-800 dark:text-white md:hidden"
            >
              View Directory{" "}
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {!loading && withCoords.length === 0 && universities.length > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Map pins appear when universities include coordinates; browse the
            list on the right for quick access.
          </p>
        )}
      </div>
    </section>
  );
};

export default EthiopiaMap;
