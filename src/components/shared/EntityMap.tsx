import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const pinIcon = L.divIcon({
  className: "border-0 bg-transparent",
  html: `<div class="flex h-8 w-8 items-center justify-center"><div class="h-4 w-4 rounded-full bg-brand-blue border-[3px] border-white shadow-md"></div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

type Props = {
  coordinates?: [number, number] | number[];
  label?: string;
  heightClass?: string;
  zoom?: number;
};

/** Single-pin map. GeoJSON coords are [lng, lat]. */
export default function EntityMap({
  coordinates,
  label,
  heightClass = "h-56 md:h-64",
  zoom = 13,
}: Props) {
  if (!coordinates || coordinates.length < 2) {
    return (
      <div
        className={`flex ${heightClass} items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-slate-400`}
      >
        <MapPin size={16} className="mr-2 shrink-0" />
        Map location not available
      </div>
    );
  }

  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const center: [number, number] = [lat, lng];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200/80 shadow-inner dark:border-white/10 ${heightClass}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={pinIcon}>
          {label ? <Popup>{label}</Popup> : null}
        </Marker>
      </MapContainer>
    </div>
  );
}
