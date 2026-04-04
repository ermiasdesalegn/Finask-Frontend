/**
 * Static mock data — used when VITE_USE_MOCK=true.
 * Mirrors the exact response shapes the real API returns.
 */
import type {
    CampusesListResponse,
    CitiesListResponse,
    CityDetailResponse,
    HomeApiResponse,
    ProgramDetailResponse,
    ProgramsListResponse,
    RareProgramsResponse,
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
    overview: "Ethiopia's oldest and most prestigious university, founded in 1950. AAU is a leading research institution offering programs across all major disciplines including medicine, law, engineering, and social sciences.",
    bestKnownFor: ["Research", "Medicine", "Law"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Addis_Ababa_University",
    isFeatured: true,
    address: { poBox: "1176", city: "Addis Ababa", region: "addis" },
    ratingsAverage: 4.8, ratingsQuantity: 11000, questionCount: 320,
    rank: {
      eduRank: { ethiopiaRank: 1, ethiopiaTotal: 36, africaRank: 120, africaTotal: 1104, worldRank: 3200, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/addis-ababa-university/" },
      uniRank: { ethiopiaRank: 1, ethiopiaTotal: 52, africaRank: 110, africaTotal: 1200, worldRank: 3100, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/1.htm" },
    },
    tags: ["research", "historic", "top10"], tagsDisplayNames: ["Research", "Historic", "Top 10"],
    academicProfile: { abbreviation: "AAU", yearFounded: 1950, undergraduateProgramsCount: 52, numberOfCampuses: 6, graduatesCount: 180000 },
    contacts: { websiteUrl: "https://www.aau.edu.et", emails: ["info@aau.edu.et"], phoneNumbers: ["+251-111-239-706"] },
    socialLinks: { facebook: "https://facebook.com/aau", telegram: "https://t.me/aau" },
    location: { type: "Point", coordinates: [38.7615, 9.0406] },
  },
  {
    _id: "mock-ju",
    name: "Jimma University",
    slug: "jimma-university",
    coverImage: "https://images.unsplash.com/photo-1607013407627-8ea69cad1dd3?auto=format&fit=crop&q=80&w=600",
    overview: "One of Ethiopia's top research universities, renowned for its College of Medicine and Health Sciences. Jimma University is a pioneer in public health research in sub-Saharan Africa.",
    bestKnownFor: ["Medicine", "Agriculture", "Engineering"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Jimma_University",
    isFeatured: true,
    address: { poBox: "378", city: "Jimma", region: "oromia" },
    ratingsAverage: 4.7, ratingsQuantity: 8000, questionCount: 210,
    rank: {
      eduRank: { ethiopiaRank: 2, ethiopiaTotal: 36, africaRank: 180, africaTotal: 1104, worldRank: 4500, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/jimma-university/" },
      uniRank: { ethiopiaRank: 2, ethiopiaTotal: 52, africaRank: 170, africaTotal: 1200, worldRank: 4300, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/2.htm" },
    },
    tags: ["research", "top10"], tagsDisplayNames: ["Research", "Top 10"],
    academicProfile: { abbreviation: "JU", yearFounded: 1999, undergraduateProgramsCount: 38, numberOfCampuses: 3, graduatesCount: 95000 },
    contacts: { websiteUrl: "https://www.ju.edu.et", emails: ["info@ju.edu.et"], phoneNumbers: ["+251-471-111-458"] },
    socialLinks: { facebook: "https://facebook.com/jimmauniversity" },
    location: { type: "Point", coordinates: [36.8358, 7.6756] },
  },
  {
    _id: "mock-bdu",
    name: "Bahir Dar University",
    slug: "bahir-dar-university",
    coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600",
    overview: "Located on the shores of Lake Tana, BDU is known for engineering, textile, and agriculture programs. It hosts one of Ethiopia's leading technology institutes.",
    bestKnownFor: ["Engineering", "Textile", "Agriculture"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Bahir_Dar_University",
    isFeatured: false,
    address: { poBox: "26", city: "Bahir Dar", region: "amhara" },
    ratingsAverage: 4.6, ratingsQuantity: 7800, questionCount: 180,
    rank: {
      eduRank: { ethiopiaRank: 3, ethiopiaTotal: 36, africaRank: 220, africaTotal: 1104, worldRank: 5200, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/bahir-dar-university/" },
      uniRank: { ethiopiaRank: 3, ethiopiaTotal: 52, africaRank: 210, africaTotal: 1200, worldRank: 5000, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/3.htm" },
    },
    tags: ["research"], tagsDisplayNames: ["Research"],
    academicProfile: { abbreviation: "BDU", yearFounded: 1963, undergraduateProgramsCount: 44, numberOfCampuses: 4, graduatesCount: 110000 },
    contacts: { websiteUrl: "https://www.bdu.edu.et", emails: ["info@bdu.edu.et"], phoneNumbers: ["+251-582-200-747"] },
    socialLinks: { facebook: "https://facebook.com/bahirdaruniversity" },
    location: { type: "Point", coordinates: [37.3941, 11.5973] },
  },
  {
    _id: "mock-mu",
    name: "Mekelle University",
    slug: "mekelle-university",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    overview: "A comprehensive research university in Tigray, strong in health sciences and engineering. Mekelle University is one of the largest universities in northern Ethiopia.",
    bestKnownFor: ["Health Sciences", "Engineering"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Mekelle_University",
    isFeatured: false,
    address: { poBox: "231", city: "Mekelle", region: "tigray" },
    ratingsAverage: 4.7, ratingsQuantity: 7000, questionCount: 150,
    rank: {
      eduRank: { ethiopiaRank: 4, ethiopiaTotal: 36, africaRank: 260, africaTotal: 1104, worldRank: 5800, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/mekelle-university/" },
      uniRank: { ethiopiaRank: 4, ethiopiaTotal: 52, africaRank: 250, africaTotal: 1200, worldRank: 5600, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/4.htm" },
    },
    tags: ["research"], tagsDisplayNames: ["Research"],
    academicProfile: { abbreviation: "MU", yearFounded: 1993, undergraduateProgramsCount: 36, numberOfCampuses: 3, graduatesCount: 85000 },
    contacts: { websiteUrl: "https://www.mu.edu.et", emails: ["info@mu.edu.et"], phoneNumbers: ["+251-344-416-682"] },
    socialLinks: { facebook: "https://facebook.com/mekelle.university" },
    location: { type: "Point", coordinates: [39.4753, 13.4967] },
  },
  {
    _id: "mock-hu",
    name: "Hawassa University",
    slug: "hawassa-university",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    overview: "A leading university in southern Ethiopia, known for agriculture, natural sciences, and business. Hawassa University is a key institution for agricultural research in the region.",
    bestKnownFor: ["Agriculture", "Natural Sciences", "Business"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Hawassa_University",
    isFeatured: true,
    address: { poBox: "05", city: "Hawassa", region: "sidama" },
    ratingsAverage: 4.5, ratingsQuantity: 6200, questionCount: 130,
    rank: {
      eduRank: { ethiopiaRank: 5, ethiopiaTotal: 36, africaRank: 300, africaTotal: 1104, worldRank: 6500, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/hawassa-university/" },
      uniRank: { ethiopiaRank: 5, ethiopiaTotal: 52, africaRank: 290, africaTotal: 1200, worldRank: 6300, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/5.htm" },
    },
    tags: ["research"], tagsDisplayNames: ["Research"],
    academicProfile: { abbreviation: "HU", yearFounded: 1999, undergraduateProgramsCount: 32, numberOfCampuses: 2, graduatesCount: 72000 },
    contacts: { websiteUrl: "https://www.hu.edu.et", emails: ["info@hu.edu.et"], phoneNumbers: ["+251-462-205-463"] },
    socialLinks: { facebook: "https://facebook.com/hawassauniversity" },
    location: { type: "Point", coordinates: [38.4762, 7.0621] },
  },
  {
    _id: "mock-aastu",
    name: "AASTU",
    slug: "aastu",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    overview: "Addis Ababa Science and Technology University — Ethiopia's premier technology-focused institution, established to drive innovation and applied research in engineering and technology.",
    bestKnownFor: ["Engineering", "Technology", "Applied Sciences"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Addis_Ababa_Science_and_Technology_University",
    isFeatured: true,
    address: { poBox: "16417", city: "Addis Ababa", region: "addis" },
    ratingsAverage: 4.8, ratingsQuantity: 9000, questionCount: 200,
    rank: {
      eduRank: { ethiopiaRank: 6, ethiopiaTotal: 36, africaRank: 340, africaTotal: 1104, worldRank: 7200, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/aastu/" },
      uniRank: { ethiopiaRank: 6, ethiopiaTotal: 52, africaRank: 330, africaTotal: 1200, worldRank: 7000, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/6.htm" },
    },
    tags: ["specialized", "top10"], tagsDisplayNames: ["Specialized", "Top 10"],
    academicProfile: { abbreviation: "AASTU", yearFounded: 2011, undergraduateProgramsCount: 18, numberOfCampuses: 1, graduatesCount: 25000 },
    contacts: { websiteUrl: "https://www.aastu.edu.et", emails: ["info@aastu.edu.et"], phoneNumbers: ["+251-114-394-100"] },
    socialLinks: { facebook: "https://facebook.com/aastu.edu.et" },
    location: { type: "Point", coordinates: [38.8, 8.98] },
  },
  {
    _id: "mock-gonu",
    name: "University of Gondar",
    slug: "university-of-gondar",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    overview: "Known for its College of Medicine and Health Sciences, one of the oldest medical schools in Ethiopia. The University of Gondar is a historic institution with strong health and law programs.",
    bestKnownFor: ["Medicine", "Health Sciences", "Law"],
    wikipediaLink: "https://en.wikipedia.org/wiki/University_of_Gondar",
    isFeatured: false,
    address: { poBox: "196", city: "Gondar", region: "amhara" },
    ratingsAverage: 4.6, ratingsQuantity: 6500, questionCount: 160,
    rank: {
      eduRank: { ethiopiaRank: 7, ethiopiaTotal: 36, africaRank: 380, africaTotal: 1104, worldRank: 7800, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/university-of-gondar/" },
      uniRank: { ethiopiaRank: 7, ethiopiaTotal: 52, africaRank: 370, africaTotal: 1200, worldRank: 7600, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/7.htm" },
    },
    tags: ["research"], tagsDisplayNames: ["Research"],
    academicProfile: { abbreviation: "UoG", yearFounded: 1954, undergraduateProgramsCount: 30, numberOfCampuses: 2, graduatesCount: 88000 },
    contacts: { websiteUrl: "https://www.uog.edu.et", emails: ["info@uog.edu.et"], phoneNumbers: ["+251-581-141-240"] },
    socialLinks: { facebook: "https://facebook.com/universityofgondar" },
    location: { type: "Point", coordinates: [37.4667, 12.6] },
  },
  {
    _id: "mock-astu",
    name: "Adama Science and Technology University",
    slug: "adama-science-and-technology-university",
    coverImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    overview: "A technology-focused university in Adama, offering engineering and applied science programs. ASTU is a key institution for technical education in the Oromia region.",
    bestKnownFor: ["Engineering", "Technology"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Adama_Science_and_Technology_University",
    isFeatured: false,
    address: { poBox: "1888", city: "Adama", region: "oromia" },
    ratingsAverage: 4.6, ratingsQuantity: 5000, questionCount: 110,
    rank: {
      eduRank: { ethiopiaRank: 8, ethiopiaTotal: 36, africaRank: 420, africaTotal: 1104, worldRank: 8400, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/adama-science-and-technology-university/" },
      uniRank: { ethiopiaRank: 8, ethiopiaTotal: 52, africaRank: 410, africaTotal: 1200, worldRank: 8200, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/8.htm" },
    },
    tags: ["specialized"], tagsDisplayNames: ["Specialized"],
    academicProfile: { abbreviation: "ASTU", yearFounded: 1993, undergraduateProgramsCount: 20, numberOfCampuses: 1, graduatesCount: 45000 },
    contacts: { websiteUrl: "https://www.astu.edu.et", emails: ["info@astu.edu.et"], phoneNumbers: ["+251-222-110-022"] },
    socialLinks: { facebook: "https://facebook.com/astu.edu.et" },
    location: { type: "Point", coordinates: [39.27, 8.54] },
  },
  {
    _id: "mock-raya",
    name: "Raya University",
    slug: "raya-university",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    overview: "Raya University, established in 2015 and located in Maichew, Tigray, is one of Ethiopia's fourth-generation universities. It is committed to becoming a center for quality education, research, and community engagement, with a particular focus on agriculture and mining engineering.",
    bestKnownFor: ["Agriculture", "Mining Engineering"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Raya_University",
    isFeatured: false,
    address: { poBox: "43", city: "Maichew", region: "tigray" },
    ratingsAverage: 4.1, ratingsQuantity: 1200, questionCount: 45,
    rank: {
      eduRank: { ethiopiaRank: 32, ethiopiaTotal: 36, africaRank: 640, africaTotal: 1104, worldRank: 12000, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/raya-university/" },
      uniRank: { ethiopiaRank: 37, ethiopiaTotal: 52, africaRank: 620, africaTotal: 1200, worldRank: 11700, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/15403.htm" },
    },
    tags: ["fourthgeneration", "new"], tagsDisplayNames: ["Fourth Generation", "New"],
    academicProfile: { abbreviation: "RU", yearFounded: 2015, undergraduateProgramsCount: 38, numberOfCampuses: 1, graduatesCount: 9000 },
    contacts: { websiteUrl: "http://www.rayu.edu.et/", emails: ["info@rayu.edu.et"], phoneNumbers: ["+251-344-430-000"] },
    socialLinks: { facebook: "https://www.facebook.com/RayaUniversity/", youtube: "https://www.youtube.com/channel/UC-L8P_g-f4Q4g_g-f4Q4g_g" },
    location: { type: "Point", coordinates: [39.5333, 12.7833] },
  },
  {
    _id: "mock-wku",
    name: "Wolkite University",
    slug: "wolkite-university",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    overview: "Wolkite University is a public university in the SNNPR region of Ethiopia, offering programs in engineering, natural sciences, and social sciences.",
    bestKnownFor: ["Engineering", "Natural Sciences"],
    wikipediaLink: "https://en.wikipedia.org/wiki/Wolkite_University",
    isFeatured: false,
    address: { poBox: "07", city: "Wolkite", region: "swepr" },
    ratingsAverage: 4.0, ratingsQuantity: 900, questionCount: 30,
    rank: {
      eduRank: { ethiopiaRank: 28, ethiopiaTotal: 36, africaRank: 580, africaTotal: 1104, worldRank: 11200, worldTotal: 14131, year: 2024, sourceUrl: "https://edurank.org/uni/wolkite-university/" },
      uniRank: { ethiopiaRank: 30, ethiopiaTotal: 52, africaRank: 560, africaTotal: 1200, worldRank: 10900, worldTotal: 13800, year: 2024, sourceUrl: "https://www.4icu.org/reviews/wolkite.htm" },
    },
    tags: ["fourthgeneration"], tagsDisplayNames: ["Fourth Generation"],
    academicProfile: { abbreviation: "WKU", yearFounded: 2012, undergraduateProgramsCount: 22, numberOfCampuses: 1, graduatesCount: 8000 },
    contacts: { websiteUrl: "https://www.wku.edu.et", emails: ["info@wku.edu.et"], phoneNumbers: ["+251-112-156-000"] },
    socialLinks: { facebook: "https://facebook.com/wolkiteuniversity" },
    location: { type: "Point", coordinates: [37.7833, 8.2833] },
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

/** GET /cities/:id or /cities/slug/:slug — shape matches handlerFactory + getCityBySlug */
export function mockCityByIdentifier(idOrSlug: string): CityDetailResponse {
  const row =
    CITIES.find((c) => c._id === idOrSlug || c.slug === idOrSlug) ?? CITIES[0];
  const city = {
    ...row,
    overview: `${row.name} — overview (mock data).`,
    universities: [] as unknown[],
    reviews: [] as unknown[],
  };
  return { status: "success", data: { city: city as any } };
}

export function mockProgramsList(): ProgramsListResponse {
  return { status: "success", results: PROGRAMS.length, data: { programs: PROGRAMS as any } };
}

export function mockRarePrograms(): RareProgramsResponse {
  const docs = PROGRAMS.slice(0, 6) as any;
  return { status: "success", results: docs.length, data: { docs } };
}

export function mockProgramDetail(idOrSlug: string): ProgramDetailResponse {
  const program =
    PROGRAMS.find((p) => p.slug === idOrSlug || p._id === idOrSlug) ??
    PROGRAMS[0];
  return { status: "success", data: { program: { ...program } as any } };
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
