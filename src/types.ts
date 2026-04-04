/** Map / UI region marker (static layout). */
export interface Region {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
}

/** Snapshot used in `rank.eduRank`, `rank.uniRank`, and `primaryRank`. */
export interface UniversityRankSnapshot {
  ethiopiaRank?: number | null;
  ethiopiaTotal?: number;
  africaRank?: number;
  africaTotal?: number;
  worldRank?: number;
  worldTotal?: number;
  year?: number;
  sourceUrl?: string;
}

/** Backend-aligned university (documents and card projections). */
export interface University {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  coverImage?: string;
  images?: string[];
  overview?: string;
  bestKnownFor?: string[];
  wikipediaLink?: string;
  isFeatured?: boolean;
  address?: {
    city?: string;
    /** Regional state / admin region (matches API `city_region` filter values). */
    region?: string;
    street?: string;
    poBox?: string;
    fullAddress?: string;
  };
  /** City ObjectId when not populated */
  city?: string | City;
  academicProfile?: {
    abbreviation?: string;
    yearFounded?: number;
    undergraduateProgramsCount?: number;
    graduatesCount?: number;
    numberOfCampuses?: number;
  };
  rank?: {
    eduRank?: UniversityRankSnapshot;
    uniRank?: UniversityRankSnapshot;
  };
  primaryRank?: UniversityRankSnapshot;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  questionCount?: number;
  tags?: string[];
  tagsDisplayNames?: string[];
  location?: {
    type?: string;
    coordinates?: [number, number] | number[];
  };
  contacts?: {
    websiteUrl?: string;
    emails?: string[];
    phoneNumbers?: string[];
    faxes?: string[];
  };
  socialLinks?: Record<string, string | undefined>;
  reviews?: Review[];
  questions?: Question[];
}

/** Program document from API */
export interface Program {
  _id: string;
  /** Some list endpoints mirror Mongo id as `id` */
  id?: string;
  name: string;
  slug: string;
  field: string;
  fieldDisplayName?: string;
  duration?: number;
  overview?: string;
  wikipediaLink?: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  tagsDisplayNames?: string[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  questionCount?: number;
  careerPaths?: string[];
  courses?: string[];
  skills?: string[];
  reviews?: Review[];
  questions?: Question[];
  /** Populated on detail endpoints */
  universityOfferings?: UniversityProgramOffering[];
}

export interface UniversityProgramOffering {
  _id: string;
  university?: University;
  program?: Program;
  yearOffered?: number;
  graduatesCount?: number;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    headline?: string;
  };
  onModelId?: string;
  onModelType?: string;
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
}

export interface Question {
  _id: string;
  question: string;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  replyCount?: number;
  onModelId?: string;
  onModelType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campus {
  _id: string;
  name: string;
  slug?: string;
  coverImage?: string;
  images?: string[];
  overview?: string;
  wikipediaLink?: string;
  location?: { type?: string; coordinates?: number[] };
  address?: University["address"];
  contacts?: {
    emails?: string[];
    phoneNumbers?: string[];
    faxes?: string[];
    websiteUrl?: string;
  };
  /** Program ObjectIds when not populated */
  programs?: string[];
  distanceFromMainCampus?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  university?: string | { _id: string; name?: string; slug?: string };
}

export interface CityClimateMonth {
  month?: string;
  value?: number;
}

export interface CityClimate {
  elevationZone?: string;
  climateTag?: string;
  summary?: string;
  detail?: string;
  hottestMonth?: CityClimateMonth;
  coldestMonth?: CityClimateMonth;
  wettestMonth?: CityClimateMonth;
  windiestMonth?: CityClimateMonth;
  annualPrecipitation?: number;
  /** Some API payloads use this spelling */
  annualPercipitation?: number;
  minTemperature?: number;
  maxTemperature?: number;
  climateWebLinks?: { name?: string; url?: string }[];
}

export interface CityTouristAttraction {
  name: string;
  detail?: string;
  image?: string;
}

export interface CityProfile {
  hasAirport?: boolean;
  population?: number;
  distanceFromCapital?: number;
  elevation?: number;
  language?: string;
  transportOptions?: string[];
  postCode?: string;
  area?: number;
}

/** List + detail document from GET /cities and GET /cities/:id */
export interface City {
  _id: string;
  name: string;
  slug?: string;
  region?: string;
  regionDisplayName?: string;
  coverImage?: string;
  overview?: string;
  wikipediaLink?: string;
  tags?: string[];
  tagsDisplayNames?: string[];
  cityProfile?: CityProfile;
  climate?: CityClimate;
  touristAttractions?: CityTouristAttraction[];
  universities?: unknown[];
  reviews?: Review[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  questionCount?: number;
  location?: { type?: string; coordinates?: number[] };
}

/** GET /cities/:id — handlerFactory uses model name → `city`; some stacks use `data` */
export interface CityDetailResponse {
  status: string;
  data: { city?: City; data?: City };
}

/** Homepage GET /home */
export interface HomePagePayload {
  featured: University[];
  trending: University[];
  rarePrograms: Program[];
  topRanked?: University[];
  topRated?: University[];
  topReviewed?: University[];
  nearBy?: University[];
  suggestedByLocation?: University[];
  suggestedByProgram?: University[];
}

export interface HomeApiResponse {
  status: string;
  data: HomePagePayload;
}

export interface UniversitiesListResponse {
  status: string;
  totalResults: number;
  results: number;
  data: { universities: University[] };
}

export interface CitiesListResponse {
  status: string;
  results: number;
  data: { cities: City[] };
}

export interface ProgramsListResponse {
  status: string;
  results: number;
  data: { programs: Program[] };
}

/** GET /programs/rare */
export interface RareProgramsResponse {
  status: string;
  results: number;
  data: { docs?: Program[]; data?: Program[] };
}

/** GET /programs/:id or GET /programs/slug/:slug */
export interface ProgramDetailResponse {
  status: string;
  data: { program: Program };
}

export interface UniversityProgramsForProgramResponse {
  status: string;
  results: number;
  data: { universityprograms: UniversityProgramOffering[] };
}

/** Slug detail: some deployments use `data.data`, others `data.university` (same as by-id). */
export interface UniversitySlugResponse {
  status: string;
  data: { data?: University; university?: University };
}

/** GET /universities/:id — Express returns `data.university` (not nested `data.data`) */
export interface UniversityByIdResponse {
  status: string;
  data: { university: University };
}

export interface CampusesListResponse {
  status: string;
  results: number;
  data: { campuses: Campus[] };
}
