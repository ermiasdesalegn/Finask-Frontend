import { apiPost } from "../api";

/** POST /api/v1/interactions/track-click — fire-and-forget */
export function trackUniversityClick(
  universityId: string,
  eventType: "clickOfficialWebsite" | "clickSocialLink"
): void {
  apiPost("/interactions/track-click", { universityId, eventType }).catch(
    () => {}
  );
}
