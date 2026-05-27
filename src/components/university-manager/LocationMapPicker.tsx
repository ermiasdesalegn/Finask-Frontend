import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { cn } from "../../lib/utils";

const defaultMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900";

interface LocationMapPickerProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  locationError?: string;
  className?: string;
}

export function LocationMapPicker({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  locationError,
  className,
}: LocationMapPickerProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const hasCoordinates =
    latitude.trim() &&
    longitude.trim() &&
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude);

  const center = useMemo<[number, number]>(() => {
    if (hasCoordinates) return [parsedLatitude, parsedLongitude];
    return [9.03, 38.74];
  }, [hasCoordinates, parsedLatitude, parsedLongitude]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center,
      zoom: 10,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const handleMapClick = (event: L.LeafletMouseEvent) => {
      onLatitudeChange(String(event.latlng.lat));
      onLongitudeChange(String(event.latlng.lng));
    };

    map.on("click", handleMapClick);
    mapRef.current = map;

    return () => {
      map.off("click", handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [center, onLatitudeChange, onLongitudeChange]);

  useEffect(() => {
    mapRef.current?.setView(center, 10, { animate: true });
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (hasCoordinates) {
      const pos: [number, number] = [parsedLatitude, parsedLongitude];
      if (!markerRef.current) {
        const marker = L.marker(pos, { draggable: true, icon: defaultMarkerIcon });
        marker.on("dragend", () => {
          const ll = marker.getLatLng();
          onLatitudeChange(String(ll.lat));
          onLongitudeChange(String(ll.lng));
        });
        marker.addTo(map);
        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng(pos);
      }
      return;
    }

    markerRef.current?.remove();
    markerRef.current = null;
  }, [
    hasCoordinates,
    parsedLatitude,
    parsedLongitude,
    onLatitudeChange,
    onLongitudeChange,
  ]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
        <div ref={mapElementRef} className="h-72 w-full" />
      </div>
      <p className="text-xs text-slate-500">
        Click the map to set location, or drag the marker.
      </p>
      {locationError && (
        <p className="text-xs font-medium text-red-600">{locationError}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Latitude</label>
          <input
            type="number"
            step="any"
            className={inputClass}
            value={latitude}
            onChange={(e) => onLatitudeChange(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Longitude</label>
          <input
            type="number"
            step="any"
            className={inputClass}
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
