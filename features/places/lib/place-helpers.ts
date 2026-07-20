import type { SportId } from "@/features/catalog/types";
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

/** cover + 제보 사진을 중복 없이 모은 갤러리 */
export function getPlaceGalleryImages(place: Place) {
  const images: string[] = [];
  const seen = new Set<string>();

  function add(url?: string) {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push(url);
  }

  add(place.coverImageUrl);
  for (const report of place.reports) {
    for (const image of report.images) {
      add(image);
    }
  }

  return images;
}

export function getPlaceSportIds(place: Place) {
  return [...new Set(place.reports.map((r) => r.sportId))];
}

export function getPrimarySportId(place: Place): SportId | null {
  if (place.reports.length === 0) return null;

  const counts = new Map<SportId, number>();
  for (const report of place.reports) {
    counts.set(report.sportId, (counts.get(report.sportId) ?? 0) + 1);
  }

  let primary: SportId | null = null;
  let max = 0;
  for (const [sportId, count] of counts) {
    if (count > max) {
      max = count;
      primary = sportId;
    }
  }
  return primary;
}

export function getTeamDistribution(place: Place) {
  const counts = new Map<string, number>();
  for (const report of place.reports) {
    if (!report.teamId) continue;
    counts.set(report.teamId, (counts.get(report.teamId) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([teamId, count]) => ({ teamId, count }));
}

const sportEmoji: Record<SportId, string> = {
  baseball: "⚾",
  soccer: "⚽",
  basketball: "🏀",
  volleyball: "🏐",
  esports: "🎮",
  other: "🏟️",
};

export function getSportEmoji(sportId: SportId) {
  return sportEmoji[sportId];
}
