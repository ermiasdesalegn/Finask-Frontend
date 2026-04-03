/** Map / UI region marker (static layout). */
export interface Region {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
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
  isFeatured?: boolean;
  address?: {
    city?: string;
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
    eduRank?: {
      ethiopiaRank?: number | null;
      ethiopiaTotal?: number;
      year?: number;
    };
  };
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
  name: string;
  slug: string;
  field: string;
  fieldDisplayName?: string;
  duration?: number;
  overview?: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  questionCount?: number;
  careerPaths?: string[];
  courses?: string[];
  skills?: string[];
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
  address?: University["address"];
  distanceFromMainCampus?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  university?: string;
}

export interface City {
  _id: string;
  name: string;
  slug?: string;
  region?: string;
  regionDisplayName?: string;
  coverImage?: string;
  overview?: string;
  cityProfile?: {
    hasAirport?: boolean;
    population?: number;
    distanceFromCapital?: number;
  };
  climate?: {
    summary?: string;
    climateTag?: string;
  };
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

export interface UniversityProgramsForProgramResponse {
  status: string;
  results: number;
  data: { universityprograms: UniversityProgramOffering[] };
}

export interface UniversitySlugResponse {
  status: string;
  data: { data: University };
}

export interface CampusesListResponse {
  status: string;
  results: number;
  data: { campuses: Campus[] };
}
