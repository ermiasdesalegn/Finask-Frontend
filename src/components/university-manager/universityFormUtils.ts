import type { University } from "../../types";

export const TAG_GROUPS = [
  {
    label: "Generational",
    tags: [
      { value: "firstgeneration", label: "First Generation" },
      { value: "secondgeneration", label: "Second Generation" },
      { value: "thirdgeneration", label: "Third Generation" },
      { value: "fourthgeneration", label: "Fourth Generation" },
    ],
  },
  {
    label: "Type",
    tags: [
      { value: "research", label: "Research" },
      { value: "general", label: "General" },
      { value: "specialized", label: "Specialized" },
      { value: "applied", label: "Applied" },
    ],
  },
  {
    label: "Recognition",
    tags: [
      { value: "top10", label: "Top 10" },
      { value: "new", label: "New" },
      { value: "historic", label: "Historic" },
      { value: "autonomous", label: "Autonomous" },
    ],
  },
];

export interface UniversityFormState {
  name: string;
  city: string;
  latitude: string;
  longitude: string;
  overview: string;
  wikipediaLink: string;
  isFeatured: boolean;
  bestKnownFor: string;
  tags: string[];
  abbreviation: string;
  yearFounded: string;
  undergraduateProgramsCount: string;
  numberOfCampuses: string;
  graduatesCount: string;
  websiteUrl: string;
  emails: string;
  phoneNumbers: string;
  faxes: string;
  addressCity: string;
  addressStreet: string;
  addressPoBox: string;
  telegram: string;
  linkedIn: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  x: string;
  eduRankEthiopia: string;
  eduRankEthiopiaTotal: string;
  eduRankAfrica: string;
  eduRankAfricaTotal: string;
  eduRankWorld: string;
  eduRankWorldTotal: string;
  eduRankYear: string;
  eduRankSourceUrl: string;
  uniRankEthiopia: string;
  uniRankEthiopiaTotal: string;
  uniRankAfrica: string;
  uniRankAfricaTotal: string;
  uniRankWorld: string;
  uniRankWorldTotal: string;
  uniRankYear: string;
  uniRankSourceUrl: string;
}

export const EMPTY_UNIVERSITY_FORM: UniversityFormState = {
  name: "",
  city: "",
  latitude: "",
  longitude: "",
  overview: "",
  wikipediaLink: "",
  isFeatured: false,
  bestKnownFor: "",
  tags: [],
  abbreviation: "",
  yearFounded: "",
  undergraduateProgramsCount: "",
  numberOfCampuses: "",
  graduatesCount: "",
  websiteUrl: "",
  emails: "",
  phoneNumbers: "",
  faxes: "",
  addressCity: "",
  addressStreet: "",
  addressPoBox: "",
  telegram: "",
  linkedIn: "",
  facebook: "",
  youtube: "",
  instagram: "",
  tiktok: "",
  x: "",
  eduRankEthiopia: "",
  eduRankEthiopiaTotal: "",
  eduRankAfrica: "",
  eduRankAfricaTotal: "",
  eduRankWorld: "",
  eduRankWorldTotal: "",
  eduRankYear: "",
  eduRankSourceUrl: "",
  uniRankEthiopia: "",
  uniRankEthiopiaTotal: "",
  uniRankAfrica: "",
  uniRankAfricaTotal: "",
  uniRankWorld: "",
  uniRankWorldTotal: "",
  uniRankYear: "",
  uniRankSourceUrl: "",
};

function splitComma(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function universityToFormState(uni: University): UniversityFormState {
  const coords = uni.location?.coordinates;
  const lng = coords?.[0];
  const lat = coords?.[1];
  const cityId =
    typeof uni.city === "object" && uni.city?._id
      ? uni.city._id
      : typeof uni.city === "string"
        ? uni.city
        : "";

  return {
    ...EMPTY_UNIVERSITY_FORM,
    name: uni.name ?? "",
    city: cityId,
    latitude: lat != null ? String(lat) : "",
    longitude: lng != null ? String(lng) : "",
    overview: uni.overview ?? "",
    wikipediaLink: uni.wikipediaLink ?? "",
    isFeatured: Boolean(uni.isFeatured),
    bestKnownFor: uni.bestKnownFor?.join(", ") ?? "",
    tags: uni.tags ?? [],
    abbreviation: uni.academicProfile?.abbreviation ?? "",
    yearFounded: uni.academicProfile?.yearFounded
      ? String(uni.academicProfile.yearFounded)
      : "",
    undergraduateProgramsCount: uni.academicProfile?.undergraduateProgramsCount
      ? String(uni.academicProfile.undergraduateProgramsCount)
      : "",
    numberOfCampuses: uni.academicProfile?.numberOfCampuses
      ? String(uni.academicProfile.numberOfCampuses)
      : "",
    graduatesCount: uni.academicProfile?.graduatesCount
      ? String(uni.academicProfile.graduatesCount)
      : "",
    websiteUrl: uni.contacts?.websiteUrl ?? "",
    emails: uni.contacts?.emails?.join(", ") ?? "",
    phoneNumbers: uni.contacts?.phoneNumbers?.join(", ") ?? "",
    faxes: uni.contacts?.faxes?.join(", ") ?? "",
    addressCity: uni.address?.city ?? "",
    addressStreet: uni.address?.street ?? "",
    addressPoBox: uni.address?.poBox ?? "",
    telegram: uni.socialLinks?.telegram ?? "",
    linkedIn: uni.socialLinks?.linkedIn ?? "",
    facebook: uni.socialLinks?.facebook ?? "",
    youtube: uni.socialLinks?.youtube ?? "",
    instagram: uni.socialLinks?.instagram ?? "",
    tiktok: uni.socialLinks?.tiktok ?? "",
    x: uni.socialLinks?.x ?? "",
    eduRankEthiopia: uni.rank?.eduRank?.ethiopiaRank
      ? String(uni.rank.eduRank.ethiopiaRank)
      : "",
    eduRankEthiopiaTotal: uni.rank?.eduRank?.ethiopiaTotal
      ? String(uni.rank.eduRank.ethiopiaTotal)
      : "",
    eduRankAfrica: uni.rank?.eduRank?.africaRank
      ? String(uni.rank.eduRank.africaRank)
      : "",
    eduRankAfricaTotal: uni.rank?.eduRank?.africaTotal
      ? String(uni.rank.eduRank.africaTotal)
      : "",
    eduRankWorld: uni.rank?.eduRank?.worldRank
      ? String(uni.rank.eduRank.worldRank)
      : "",
    eduRankWorldTotal: uni.rank?.eduRank?.worldTotal
      ? String(uni.rank.eduRank.worldTotal)
      : "",
    eduRankYear: uni.rank?.eduRank?.year ? String(uni.rank.eduRank.year) : "",
    eduRankSourceUrl: uni.rank?.eduRank?.sourceUrl ?? "",
    uniRankEthiopia: uni.rank?.uniRank?.ethiopiaRank
      ? String(uni.rank.uniRank.ethiopiaRank)
      : "",
    uniRankEthiopiaTotal: uni.rank?.uniRank?.ethiopiaTotal
      ? String(uni.rank.uniRank.ethiopiaTotal)
      : "",
    uniRankAfrica: uni.rank?.uniRank?.africaRank
      ? String(uni.rank.uniRank.africaRank)
      : "",
    uniRankAfricaTotal: uni.rank?.uniRank?.africaTotal
      ? String(uni.rank.uniRank.africaTotal)
      : "",
    uniRankWorld: uni.rank?.uniRank?.worldRank
      ? String(uni.rank.uniRank.worldRank)
      : "",
    uniRankWorldTotal: uni.rank?.uniRank?.worldTotal
      ? String(uni.rank.uniRank.worldTotal)
      : "",
    uniRankYear: uni.rank?.uniRank?.year ? String(uni.rank.uniRank.year) : "",
    uniRankSourceUrl: uni.rank?.uniRank?.sourceUrl ?? "",
  };
}

export function validateUniversityForm(f: UniversityFormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.name.trim().length < 3) e.name = "Name must be at least 3 characters";
  if (!f.city) e.city = "City is required";
  if (f.overview.trim().length < 10)
    e.overview = "Overview is required (min 10 chars)";
  if (!f.wikipediaLink.trim()) {
    e.wikipediaLink = "Wikipedia link is required";
  } else {
    try {
      const u = new URL(f.wikipediaLink);
      if (!u.hostname.includes("wikipedia.org"))
        e.wikipediaLink = "Must be a wikipedia.org link";
    } catch {
      e.wikipediaLink = "Must be a valid URL";
    }
  }
  if (!f.websiteUrl.trim()) {
    e.websiteUrl = "Website URL is required";
  } else {
    try {
      new URL(f.websiteUrl);
    } catch {
      e.websiteUrl = "Must be a valid URL";
    }
  }
  if (!f.addressCity.trim()) e.addressCity = "Address city is required";
  const hasLat = f.latitude.trim().length > 0;
  const hasLng = f.longitude.trim().length > 0;
  if (hasLat !== hasLng) {
    e.location = "Latitude and longitude are both required when setting location";
  }
  return e;
}

export function buildUniversityPayload(
  f: UniversityFormState
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: f.name.trim(),
    overview: f.overview.trim(),
    wikipediaLink: f.wikipediaLink.trim(),
    city: f.city,
    isFeatured: f.isFeatured,
  };
  if (f.bestKnownFor.trim()) payload.bestKnownFor = splitComma(f.bestKnownFor);
  if (f.tags.length > 0) payload.tags = f.tags;
  if (f.latitude.trim() && f.longitude.trim()) {
    payload.location = {
      type: "Point",
      coordinates: [Number(f.longitude), Number(f.latitude)],
    };
  }

  const contacts: Record<string, unknown> = { websiteUrl: f.websiteUrl.trim() };
  if (f.emails.trim()) contacts.emails = splitComma(f.emails);
  if (f.phoneNumbers.trim()) contacts.phoneNumbers = splitComma(f.phoneNumbers);
  if (f.faxes.trim()) contacts.faxes = splitComma(f.faxes);
  payload.contacts = contacts;

  const address: Record<string, unknown> = { city: f.addressCity.trim() };
  if (f.addressStreet.trim()) address.street = f.addressStreet.trim();
  if (f.addressPoBox.trim()) address.poBox = f.addressPoBox.trim();
  payload.address = address;

  const ap: Record<string, unknown> = {};
  if (f.abbreviation.trim()) ap.abbreviation = f.abbreviation.trim();
  if (f.yearFounded) ap.yearFounded = Number(f.yearFounded);
  if (f.undergraduateProgramsCount)
    ap.undergraduateProgramsCount = Number(f.undergraduateProgramsCount);
  if (f.numberOfCampuses) ap.numberOfCampuses = Number(f.numberOfCampuses);
  if (f.graduatesCount) ap.graduatesCount = Number(f.graduatesCount);
  if (Object.keys(ap).length > 0) payload.academicProfile = ap;

  const sl: Record<string, string> = {};
  if (f.telegram.trim()) sl.telegram = f.telegram.trim();
  if (f.linkedIn.trim()) sl.linkedIn = f.linkedIn.trim();
  if (f.facebook.trim()) sl.facebook = f.facebook.trim();
  if (f.youtube.trim()) sl.youtube = f.youtube.trim();
  if (f.instagram.trim()) sl.instagram = f.instagram.trim();
  if (f.tiktok.trim()) sl.tiktok = f.tiktok.trim();
  if (f.x.trim()) sl.x = f.x.trim();
  if (Object.keys(sl).length > 0) payload.socialLinks = sl;

  const hasEdu =
    f.eduRankEthiopia ||
    f.eduRankEthiopiaTotal ||
    f.eduRankAfrica ||
    f.eduRankAfricaTotal ||
    f.eduRankWorld ||
    f.eduRankWorldTotal ||
    f.eduRankSourceUrl;
  const hasUni =
    f.uniRankEthiopia ||
    f.uniRankEthiopiaTotal ||
    f.uniRankAfrica ||
    f.uniRankAfricaTotal ||
    f.uniRankWorld ||
    f.uniRankWorldTotal ||
    f.uniRankSourceUrl;

  if ((hasEdu && f.eduRankYear) || (hasUni && f.uniRankYear)) {
    const rank: Record<string, unknown> = {};
    if (hasEdu && f.eduRankYear) {
      const er: Record<string, number | string> = { year: Number(f.eduRankYear) };
      if (f.eduRankEthiopia) er.ethiopiaRank = Number(f.eduRankEthiopia);
      if (f.eduRankEthiopiaTotal) er.ethiopiaTotal = Number(f.eduRankEthiopiaTotal);
      if (f.eduRankAfrica) er.africaRank = Number(f.eduRankAfrica);
      if (f.eduRankAfricaTotal) er.africaTotal = Number(f.eduRankAfricaTotal);
      if (f.eduRankWorld) er.worldRank = Number(f.eduRankWorld);
      if (f.eduRankWorldTotal) er.worldTotal = Number(f.eduRankWorldTotal);
      if (f.eduRankSourceUrl.trim()) {
        rank.eduRank = { ...er, sourceUrl: f.eduRankSourceUrl.trim() };
      } else rank.eduRank = er;
    }
    if (hasUni && f.uniRankYear) {
      const ur: Record<string, number | string> = { year: Number(f.uniRankYear) };
      if (f.uniRankEthiopia) ur.ethiopiaRank = Number(f.uniRankEthiopia);
      if (f.uniRankEthiopiaTotal) ur.ethiopiaTotal = Number(f.uniRankEthiopiaTotal);
      if (f.uniRankAfrica) ur.africaRank = Number(f.uniRankAfrica);
      if (f.uniRankAfricaTotal) ur.africaTotal = Number(f.uniRankAfricaTotal);
      if (f.uniRankWorld) ur.worldRank = Number(f.uniRankWorld);
      if (f.uniRankWorldTotal) ur.worldTotal = Number(f.uniRankWorldTotal);
      if (f.uniRankSourceUrl.trim()) {
        rank.uniRank = { ...ur, sourceUrl: f.uniRankSourceUrl.trim() };
      } else rank.uniRank = ur;
    }
    payload.rank = rank;
  }

  return payload;
}
