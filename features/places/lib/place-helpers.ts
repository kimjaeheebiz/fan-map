import { teams } from "@/features/catalog/constants";
import type { SportId } from "@/features/catalog/types";
import type { Place, SportTeamSet, ViewingReport } from "@/features/places/types";

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

export function getReportSportTeams(report: ViewingReport): SportTeamSet[] {
  return report.sportTeams ?? [];
}

export function getReportSportIds(report: ViewingReport): SportId[] {
  return getReportSportTeams(report).map((set) => set.sportId);
}

export function getReportTeamIds(report: ViewingReport): string[] {
  return getReportSportTeams(report).flatMap((set) => set.teamIds ?? []);
}

export function getPlaceSportIds(place: Place) {
  return [
    ...new Set(place.reports.flatMap((report) => getReportSportIds(report))),
  ];
}

export function getPrimarySportId(place: Place): SportId | null {
  if (place.reports.length === 0) return null;

  const counts = new Map<SportId, number>();
  for (const report of place.reports) {
    for (const sportId of getReportSportIds(report)) {
      counts.set(sportId, (counts.get(sportId) ?? 0) + 1);
    }
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
    for (const teamId of getReportTeamIds(report)) {
      counts.set(teamId, (counts.get(teamId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([teamId, count]) => ({ teamId, count }));
}

/** 평평한 sportIds/teamIds를 종목별 세트로 복원 (마이그레이션용) */
export function sportTeamsFromFlat(
  sportIds: SportId[],
  teamIds: string[] = [],
): SportTeamSet[] {
  if (sportIds.length === 0) return [];

  return sportIds.map((sportId) => ({
    sportId,
    teamIds: teamIds.filter(
      (teamId) => teams.find((team) => team.id === teamId)?.sportId === sportId,
    ),
  }));
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
