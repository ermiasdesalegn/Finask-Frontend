/**
 * Static mock data — used when VITE_USE_MOCK=true.
 * Mirrors the exact response shapes the real API returns.
 */
import type {
    CampusesListResponse,
    CitiesListResponse,
    HomeApiResponse,
    ProgramsListResponse,
    UniversitiesListResponse,
    UniversityProgramsForProgramResponse,
    UniversitySlugResponse,
} from "../types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600";

const UNIVERSITIES = [
  {
    _id: "mock-aau",
    name: "Addis Ababa University",
    slug: "addis-ababa-university",
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    overview: "Ethiopia's oldest and most prestigious university, founded in 1950. AAU is a leading research institution offering programs across all major disciplines.",
    bestKnownFor: ["Research", "Medicine", "Law"],
    isFeatured: true,
    address: { city: "Addis Ababa" },
    ratingsAverage: 4.8,
    ratingsQuantity: 11000,
    questionCount: 320,
    rank: { eduRank: { ethiopiaRank: 1, year: 2024 } },
    tags: ["research", "historic", "top10"],
    tagsDisplayNames: ["Research", "Historic", "Top 10"],
    academicProfile: { yearFounded: 1950, undergraduateProgramsCount: 52, numberOfCampuses: 6, graduatesCount: 180000 },
    contacts: { websiteUrl: "https://www.aau.edu.et" },
    socialLinks: { facebook: "https://facebook.com/aau", telegram: "https://t.me/aau" },
    location: { type: "Point", coordinates: [38.7615, 9.0406] },
  },
  {
    _id: "mock-ju",
    name: "Jimma University",
    slug: "jimma-university",
    coverImage: "https://images.unsplash.com/photo-1607013407627-8ea69cad1dd3?auto=format&fit=crop&q=80&w=600",
    overview: "One of Ethiopia's top research universities, renowned for its College of Medicine and Health Sciences.",
    bestKnownFor: ["Medicine", "Agriculture", "Engineering"],
    isFeatured: true,
    address: { city: "Jimma" },
    ratingsAverage: 4.7,
    ratingsQuantity: 8000,
    questionCount: 210,
    rank: { eduRank: { ethiopiaRank: 2, year: 2024 } },
    tags: ["research", "top10"],
    tagsDisplayNames: ["Research", "Top 10"],
    academicProfile: { yearFounded: 1999, undergraduateProgramsCount: 38, numberOfCampuses: 3, graduatesCount: 95000 },
    contacts: { websiteUrl: "https://www.ju.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [36.8358, 7.6756] },
  },
  {
    _id: "mock-bdu",
    name: "Bahir Dar University",
    slug: "bahir-dar-university",
    coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600",
    overview: "Located on the shores of Lake Tana, BDU is known for engineering, textile, and agriculture programs.",
    bestKnownFor: ["Engineering", "Textile", "Agriculture"],
    isFeatured: false,
    address: { city: "Bahir Dar" },
    ratingsAverage: 4.6,
    ratingsQuantity: 7800,
    questionCount: 180,
    rank: { eduRank: { ethiopiaRank: 3, year: 2024 } },
    tags: ["research"],
    tagsDisplayNames: ["Research"],
    academicProfile: { yearFounded: 1963, undergraduateProgramsCount: 44, numberOfCampuses: 4, graduatesCount: 110000 },
    contacts: { websiteUrl: "https://www.bdu.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [37.3941, 11.5973] },
  },
  {
    _id: "mock-mu",
    name: "Mekelle University",
    slug: "mekelle-university",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    overview: "A comprehensive research university in Tigray, strong in health sciences and engineering.",
    bestKnownFor: ["Health Sciences", "Engineering"],
    isFeatured: false,
    address: { city: "Mekelle" },
    ratingsAverage: 4.7,
    ratingsQuantity: 7000,
    questionCount: 150,
    rank: { eduRank: { ethiopiaRank: 4, year: 2024 } },
    tags: ["research"],
    tagsDisplayNames: ["Research"],
    academicProfile: { yearFounded: 1993, undergraduateProgramsCount: 36, numberOfCampuses: 3, graduatesCount: 85000 },
    contacts: { websiteUrl: "https://www.mu.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [39.4753, 13.4967] },
  },
  {
    _id: "mock-hu",
    name: "Hawassa University",
    slug: "hawassa-university",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    overview: "A leading university in southern Ethiopia, known for agriculture, natural sciences, and business.",
    bestKnownFor: ["Agriculture", "Natural Sciences", "Business"],
    isFeatured: true,
    address: { city: "Hawassa" },
    ratingsAverage: 4.5,
    ratingsQuantity: 6200,
    questionCount: 130,
    rank: { eduRank: { ethiopiaRank: 5, year: 2024 } },
    tags: ["research"],
    tagsDisplayNames: ["Research"],
    academicProfile: { yearFounded: 1999, undergraduateProgramsCount: 32, numberOfCampuses: 2, graduatesCount: 72000 },
    contacts: { websiteUrl: "https://www.hu.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [38.4762, 7.0621] },
  },
  {
    _id: "mock-aastu",
    name: "AASTU",
    slug: "aastu",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    overview: "Addis Ababa Science and Technology University — Ethiopia's premier technology-focused institution.",
    bestKnownFor: ["Engineering", "Technology", "Applied Sciences"],
    isFeatured: true,
    address: { city: "Addis Ababa" },
    ratingsAverage: 4.8,
    ratingsQuantity: 9000,
    questionCount: 200,
    rank: { eduRank: { ethiopiaRank: 6, year: 2024 } },
    tags: ["specialized", "top10"],
    tagsDisplayNames: ["Specialized", "Top 10"],
    academicProfile: { yearFounded: 2011, undergraduateProgramsCount: 18, numberOfCampuses: 1, graduatesCount: 25000 },
    contacts: { websiteUrl: "https://www.aastu.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [38.8, 8.98] },
  },
  {
    _id: "mock-gonu",
    name: "University of Gondar",
    slug: "university-of-gondar",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    overview: "Known for its College of Medicine and Health Sciences, one of the oldest medical schools in Ethiopia.",
    bestKnownFor: ["Medicine", "Health Sciences", "Law"],
    isFeatured: false,
    address: { city: "Gondar" },
    ratingsAverage: 4.6,
    ratingsQuantity: 6500,
    questionCount: 160,
    rank: { eduRank: { ethiopiaRank: 7, year: 2024 } },
    tags: ["research"],
    tagsDisplayNames: ["Research"],
    academicProfile: { yearFounded: 1954, undergraduateProgramsCount: 30, numberOfCampuses: 2, graduatesCount: 88000 },
    contacts: { websiteUrl: "https://www.uog.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [37.4667, 12.6] },
  },
  {
    _id: "mock-astu",
    name: "Adama Science and Technology University",
    slug: "adama-science-and-technology-university",
    coverImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    overview: "A technology-focused university in Adama, offering engineering and applied science programs.",
    bestKnownFor: ["Engineering", "Technology"],
    isFeatured: false,
    address: { city: "Adama" },
    ratingsAverage: 4.6,
    ratingsQuantity: 5000,
    questionCount: 110,
    rank: { eduRank: { ethiopiaRank: 8, year: 2024 } },
    tags: ["specialized"],
    tagsDisplayNames: ["Specialized"],
    academicProfile: { yearFounded: 1993, undergraduateProgramsCount: 20, numberOfCampuses: 1, graduatesCount: 45000 },
    contacts: { websiteUrl: "https://www.astu.edu.et" },
    socialLinks: {},
    location: { type: "Point", coordinates: [39.27, 8.54] },
  },
];

const PROGRAMS = [
  { _id: "mock-se", name: "Software Engineering", slug: "software-engineering", field: "technologyit", fieldDisplayName: "Technology and IT", duration: 5, overview: "Design and build software systems.", tags: ["indemand", "problemsolving"], ratingsAverage: 4.7, ratingsQuantity: 0, careerPaths: ["Software Developer", "Backend Engineer"], courses: ["Algorithms", "OOP", "Web Dev"], skills: ["Programming", "System Design"] },
  { _id: "mock-cs", name: "Computer Science", slug: "computer-science", field: "technologyit", fieldDisplayName: "Technology and IT", duration: 4, overview: "Study computation and algorithms.", tags: ["mathheavy", "analytical"], ratingsAverage: 4.6, ratingsQuantity: 0, careerPaths: ["Data Scientist", "AI Engineer"], courses: ["Theory of Computation", "ML"], skills: ["Algorithms", "Math"] },
  { _id: "mock-med", name: "Medicine", slug: "medicine", field: "medicinehealth", fieldDisplayName: "Medicine and Health", duration: 6, overview: "Train to become a medical doctor.", tags: ["professionaldegree", "indemand"], ratingsAverage: 4.8, ratingsQuantity: 0, careerPaths: ["General Practitioner", "Surgeon"], courses: ["Anatomy", "Pharmacology"], skills: ["Diagnosis", "Patient Care"] },
  { _id: "mock-nursing", name: "Nursing", slug: "nursing", field: "medicinehealth", fieldDisplayName: "Medicine and Health", duration: 4, overview: "Provide patient care and health promotion.", tags: ["professionaldegree", "handson"], ratingsAverage: 4.5, ratingsQuantity: 0, careerPaths: ["Registered Nurse", "Public Health Nurse"], courses: ["Fundamentals of Nursing", "Pharmacology"], skills: ["Patient Care", "Clinical Judgment"] },
  { _id: "mock-civil", name: "Civil Engineering", slug: "civil-engineering", field: "engineeringarchitecture", fieldDisplayName: "Engineering and Architecture", duration: 5, overview: "Design infrastructure and buildings.", tags: ["professionaldegree", "indemand"], ratingsAverage: 4.5, ratingsQuantity: 0, careerPaths: ["Structural Engineer", "Construction Manager"], courses: ["Statics", "Fluid Mechanics"], skills: ["Structural Analysis", "CAD"] },
  { _id: "mock-arch", name: "Architecture", slug: "architecture", field: "engineeringarchitecture", fieldDisplayName: "Engineering and Architecture", duration: 5, overview: "Design buildings and urban spaces.", tags: ["creative", "professionaldegree"], ratingsAverage: 4.5, ratingsQuantity: 0, careerPaths: ["Architect", "Urban Planner"], courses: ["Design Studio", "Structural Design"], skills: ["Design", "Spatial Reasoning"] },
  { _id: "mock-biz", name: "Business Administration", slug: "business-administration", field: "businesseconomics", fieldDisplayName: "Business and Economics", duration: 4, overview: "Learn to manage organizations effectively.", tags: ["indemand", "entrepreneurial"], ratingsAverage: 4.5, ratingsQuantity: 0, careerPaths: ["Manager", "Consultant"], courses: ["Finance", "Marketing"], skills: ["Leadership", "Strategy"] },
  { _id: "mock-econ", name: "Economics", slug: "economics", field: "businesseconomics", fieldDisplayName: "Business and Economics", duration: 4, overview: "Study production, distribution, and consumption.", tags: ["analytical", "indemand"], ratingsAverage: 4.5, ratingsQuantity: 0, careerPaths: ["Economist", "Financial Analyst"], courses: ["Micro", "Macro", "Econometrics"], skills: ["Quantitative Analysis", "Modeling"] },
  { _id: "mock-agri", name: "Agriculture", slug: "agriculture", field: "naturalappliedsciences", fieldDisplayName: "Natural and Applied Sciences", duration: 4, overview: "Study farming, crops, and food production.", tags: ["handson", "fieldworkbased"], ratingsAverage: 4.4, ratingsQuantity: 0, careerPaths: ["Agronomist", "Farm Manager"], courses: ["Soil Science", "Plant Science"], skills: ["Agronomy", "Farm Management"] },
  { _id: "mock-law", name: "Law (LL.B.)", slug: "law-ll-b", field: "socialscienceslaw", fieldDisplayName: "Social Sciences and Law", duration: 5, overview: "Study legal principles and practice.", tags: ["professionaldegree", "analytical"], ratingsAverage: 4.6, ratingsQuantity: 0, careerPaths: ["Lawyer", "Judge"], courses: ["Constitutional Law", "Criminal Law"], skills: ["Legal Reasoning", "Advocacy"] },
  { _id: "mock-psych", name: "Psychology", slug: "psychology", field: "socialscienceslaw", fieldDisplayName: "Social Sciences and Law", duration: 4, overview: "Study the mind and human behavior.", tags: ["analytical", "researchoriented"], ratingsAverage: 4.4, ratingsQuantity: 0, careerPaths: ["Counselor", "HR Specialist"], courses: ["Social Psychology", "Abnormal Psychology"], skills: ["Empathy", "Research"] },
  { _id: "mock-english", name: "English Language and Literature", slug: "english-language-and-literature", field: "humanitiesartslanguages", fieldDisplayName: "Humanities, Arts and Languages", duration: 4, overview: "Study English literature and language.", tags: ["analytical", "creative"], ratingsAverage: 4.3, ratingsQuantity: 0, careerPaths: ["Teacher", "Editor"], courses: ["Literary Theory", "Creative Writing"], skills: ["Critical Reading", "Writing"] },
  { _id: "mock-teach", name: "Teacher Education", slug: "teacher-education", field: "educationteaching", fieldDisplayName: "Education and Teaching", duration: 4, overview: "Prepare to become an effective educator.", tags: ["publicservice", "professionaldegree"], ratingsAverage: 4.4, ratingsQuantity: 0, careerPaths: ["Teacher", "Curriculum Developer"], courses: ["Educational Psychology", "Pedagogy"], skills: ["Teaching", "Classroom Management"] },
];

const CITIES = [
  { _id: "mock-addis", name: "Addis Ababa", slug: "addis-ababa", region: "Addis Ababa", regionDisplayName: "Addis Ababa", coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600", climate: { climateTag: "Mild", summary: "Mild, Temperate" }, cityProfile: { hasAirport: true, population: 5000000, distanceFromCapital: 0 } },
  { _id: "mock-bahir", name: "Bahir Dar", slug: "bahir-dar", region: "Amhara", regionDisplayName: "Amhara", coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600", climate: { climateTag: "Warm", summary: "Warm, Tropical" }, cityProfile: { hasAirport: true, population: 350000, distanceFromCapital: 484 } },
  { _id: "mock-jimma", name: "Jimma", slug: "jimma", region: "Oromia", regionDisplayName: "Oromia", coverImage: "https://images.unsplash.com/photo-1607013407627-8ea69cad1dd3?auto=format&fit=crop&q=80&w=600", climate: { climateTag: "Subtropical", summary: "Warm, Subtropical" }, cityProfile: { hasAirport: true, population: 200000, distanceFromCapital: 353 } },
  { _id: "mock-mekelle", name: "Mekelle", slug: "mekelle", region: "Tigray", regionDisplayName: "Tigray", coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600", climate: { climateTag: "Semi-Arid", summary: "Semi-Arid" }, cityProfile: { hasAirport: true, population: 310000, distanceFromCapital: 780 } },
  { _id: "mock-hawassa", name: "Hawassa", slug: "hawassa", region: "Sidama", regionDisplayName: "Sidama", coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600", climate: { climateTag: "Temperate", summary: "Warm, Temperate" }, cityProfile: { hasAirport: false, population: 400000, distanceFromCapital: 275 } },
];

// Build university-program relationships
const UNI_PROGRAMS: Record<string, string[]> = {
  "mock-aau": ["mock-se", "mock-cs", "mock-med", "mock-law", "mock-biz", "mock-civil", "mock-arch", "mock-agri", "mock-psych", "mock-english", "mock-teach"],
  "mock-ju": ["mock-med", "mock-nursing", "mock-agri", "mock-civil", "mock-biz", "mock-psych"],
  "mock-bdu": ["mock-civil", "mock-arch", "mock-agri", "mock-biz", "mock-teach", "mock-english"],
  "mock-mu": ["mock-med", "mock-nursing", "mock-civil", "mock-agri", "mock-law"],
  "mock-hu": ["mock-agri", "mock-biz", "mock-nursing", "mock-teach", "mock-econ"],
  "mock-aastu": ["mock-se", "mock-cs", "mock-civil", "mock-arch"],
  "mock-gonu": ["mock-med", "mock-nursing", "mock-law", "mock-psych"],
  "mock-astu": ["mock-se", "mock-cs", "mock-civil"],
};

// ── Response builders ──────────────────────────────────────────────────────

export function mockUniversitiesList(): UniversitiesListResponse {
  return { status: "success", totalResults: UNIVERSITIES.length, results: UNIVERSITIES.length, data: { universities: UNIVERSITIES as any } };
}

export function mockCitiesList(): CitiesListResponse {
  return { status: "success", results: CITIES.length, data: { cities: CITIES as any } };
}

export function mockProgramsList(): ProgramsListResponse {
  return { status: "success", results: PROGRAMS.length, data: { programs: PROGRAMS as any } };
}

export function mockHomePage(): HomeApiResponse {
  const featured = UNIVERSITIES.filter(u => u.isFeatured);
  return {
    status: "success",
    data: {
      featured: featured as any,
      trending: UNIVERSITIES.slice(0, 4) as any,
      rarePrograms: PROGRAMS.slice(0, 4) as any,
      topRanked: [...UNIVERSITIES].sort((a, b) => (a.rank.eduRank.ethiopiaRank ?? 99) - (b.rank.eduRank.ethiopiaRank ?? 99)).slice(0, 5) as any,
      topRated: [...UNIVERSITIES].sort((a, b) => b.ratingsAverage - a.ratingsAverage).slice(0, 5) as any,
      topReviewed: [...UNIVERSITIES].sort((a, b) => b.ratingsQuantity - a.ratingsQuantity).slice(0, 5) as any,
    },
  };
}

export function mockUniversityBySlug(slug: string): UniversitySlugResponse {
  const uni = UNIVERSITIES.find(u => u.slug === slug) ?? UNIVERSITIES[0];
  return { status: "success", data: { data: uni as any } };
}

export function mockUniversityCampuses(): CampusesListResponse {
  return { status: "success", results: 0, data: { campuses: [] } };
}

export function mockProgramUniversities(programId: string): UniversityProgramsForProgramResponse {
  const uniIds = Object.entries(UNI_PROGRAMS)
    .filter(([, progs]) => progs.includes(programId))
    .map(([uniId]) => uniId);
  const rows = uniIds.map(uid => ({
    _id: `up-${uid}-${programId}`,
    university: UNIVERSITIES.find(u => u._id === uid) ?? UNIVERSITIES[0],
    program: programId,
    yearOffered: 2000,
    graduatesCount: 1000,
  }));
  return { status: "success", results: rows.length, data: { universityprograms: rows as any } };
}

export function mockSearch(q: string) {
  const lq = q.toLowerCase();
  return {
    status: "success",
    data: {
      universities: UNIVERSITIES.filter(u => u.name.toLowerCase().includes(lq) || u.address.city.toLowerCase().includes(lq)),
      programs: PROGRAMS.filter(p => p.name.toLowerCase().includes(lq)),
      cities: CITIES.filter(c => c.name.toLowerCase().includes(lq)),
    },
  };
}
