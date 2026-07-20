import type { Place, ViewingReport } from "@/features/places/types";

/** reports는 최신순(앞이 최신)으로 유지한다. */
export function getReportCount(place: Place) {
  return place.reports.length;
}

export function getLatestReport(place: Place): ViewingReport | undefined {
  return place.reports[0];
}

export function getCoverImageUrl(place: Place): string | undefined {
  if (place.coverImageUrl) return place.coverImageUrl;
  for (const report of place.reports) {
    const first = report.images[0];
    if (first) return first;
  }
  return undefined;
}

export function getPlaceSportIds(place: Place) {
  return [...new Set(place.reports.map((r) => r.sportId))];
}
