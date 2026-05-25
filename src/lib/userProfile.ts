import type { AuthUser } from "../context/AuthContext";

/** True when the user has at least one program in fieldsOfInterest. */
export function userHasFieldsOfInterest(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  const fields = user.fieldsOfInterest;
  if (!fields) return false;
  if (Array.isArray(fields)) return fields.length > 0;
  return false;
}
