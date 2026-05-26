import type { AuthUser } from "../context/AuthContext";

/** True when the user has at least one program in fieldsOfInterest. */
export function userHasFieldsOfInterest(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return fieldsOfInterestIds(user).length > 0;
}

/** Normalize fieldsOfInterest to program id strings (handles populated docs from getMe). */
export function fieldsOfInterestIds(user: AuthUser | null | undefined): string[] {
  if (!user?.fieldsOfInterest || !Array.isArray(user.fieldsOfInterest)) {
    return [];
  }
  return user.fieldsOfInterest
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object" && "_id" in entry) {
        return String((entry as { _id: string })._id);
      }
      return null;
    })
    .filter((id): id is string => Boolean(id));
}

/** User hobby tags (lowercase names matching Interest collection). */
export function userInterestNames(user: AuthUser | null | undefined): string[] {
  if (!user?.interests || !Array.isArray(user.interests)) return [];
  return user.interests.map((n) => String(n).toLowerCase());
}

export function formatInterestLabel(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}
