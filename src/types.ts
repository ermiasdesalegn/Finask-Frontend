export interface University {
  id: string;
  name: string;
  location: string;
  region: string;
  rating: number;
  reviews: string;
  image: string;
  featured?: boolean;
  ranking?: number;
  climate?: string;
  programs: string[];
  lat: number;
  lng: number;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
}
