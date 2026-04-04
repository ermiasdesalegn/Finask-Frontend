/**
 * Mock favorites data — replace with real API calls when backend is ready.
 * Shape matches the University and Program types exactly.
 */
import type { Program, University } from "../types";

export const MOCK_UNIVERSITIES: University[] = [
  {
    _id: "mock-aau",
    name: "Addis Ababa University",
    slug: "addis-ababa-university",
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    address: { city: "Addis Ababa" },
    ratingsAverage: 4.8,
    ratingsQuantity: 11000,
    rank: { eduRank: { ethiopiaRank: 1 } },
    tags: ["research", "top10"],
  },
  {
    _id: "mock-ju",
    name: "Jimma University",
    slug: "jimma-university",
    coverImage: "https://images.unsplash.com/photo-1607013407627-8ea69cad1dd3?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
    address: { city: "Jimma" },
    ratingsAverage: 4.7,
    ratingsQuantity: 8000,
    rank: { eduRank: { ethiopiaRank: 2 } },
    tags: ["research"],
  },
  {
    _id: "mock-gonu",
    name: "University of Gondar",
    slug: "university-of-gondar",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    isFeatured: false,
    address: { city: "Gondar" },
    ratingsAverage: 4.6,
    ratingsQuantity: 6500,
    rank: { eduRank: { ethiopiaRank: 7 } },
    tags: ["research"],
  },
];

export const MOCK_PROGRAMS: Program[] = [
  {
    _id: "mock-se",
    name: "Software Engineering",
    slug: "software-engineering",
    field: "technologyit",
    fieldDisplayName: "Technology and IT",
    duration: 5,
    overview: "Design and build reliable, scalable software systems using engineering principles.",
    tags: ["indemand", "problemsolving"],
    ratingsAverage: 4.7,
    ratingsQuantity: 0,
  },
  {
    _id: "mock-med",
    name: "Medicine",
    slug: "medicine",
    field: "medicinehealth",
    fieldDisplayName: "Medicine and Health",
    duration: 6,
    overview: "Train to become a medical doctor with comprehensive clinical and theoretical education.",
    tags: ["professionaldegree", "indemand"],
    ratingsAverage: 4.8,
    ratingsQuantity: 0,
  },
];
