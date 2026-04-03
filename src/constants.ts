import { Region } from "./types";

export const REGIONS: Region[] = [
  { id: "aa", name: "Addis Ababa", coordinates: { x: 50, y: 50 } },
  { id: "am", name: "Amhara", coordinates: { x: 45, y: 35 } },
  { id: "or", name: "Oromia", coordinates: { x: 55, y: 60 } },
  { id: "ti", name: "Tigray", coordinates: { x: 48, y: 15 } },
  { id: "sn", name: "Sidama", coordinates: { x: 52, y: 75 } },
  { id: "af", name: "Afar", coordinates: { x: 65, y: 30 } },
  { id: "so", name: "Somali", coordinates: { x: 80, y: 65 } },
  { id: "bg", name: "Benishangul-Gumuz", coordinates: { x: 25, y: 45 } },
  { id: "ga", name: "Gambela", coordinates: { x: 15, y: 65 } },
  { id: "sw", name: "South West", coordinates: { x: 35, y: 80 } },
  { id: "sr", name: "Southern Nations", coordinates: { x: 40, y: 70 } },
];

/**
 * Region filter pills: label shown in UI → `city_region` query for GET /universities.
 */
export const REGION_FILTERS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "Addis Ababa", value: "addis" },
  { label: "Afar", value: "afar" },
  { label: "Amhara", value: "amhara" },
  { label: "Benishangul-Gumuz", value: "benishangul" },
  { label: "Dire Dawa", value: "dire" },
  { label: "Gambella", value: "gambella" },
  { label: "Harari", value: "harari" },
  { label: "Oromia", value: "oromia" },
  { label: "Sidama", value: "sidama" },
  { label: "Somali", value: "somali" },
  { label: "Tigray", value: "tigray" },
  { label: "South West", value: "swepr" },
];
