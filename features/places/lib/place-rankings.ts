import type { Place } from "@/features/places/types";
import {
  getRecentReportCount,
  getTodayReportCount,
} from "@/features/places/lib/place-helpers";

export type PlaceRankingKind = "hot" | "rising" | "fans";

export const PLACE_RANKING_LABELS: Record<PlaceRankingKind, string> = {
  hot: "오늘 HOT",
  rising: "급상승",
  fans: "팬 추천",
};

export type RankedPlace = {
  place: Place;
  score: number;
};

const RANKING_LIMIT = 7;

function countReportsInRange(
  place: Place,
  startMs: number,
  endMs: number,
) {
  return place.reports.filter((report) => {
    const t = new Date(report.createdAt).getTime();
    return Number.isFinite(t) && t >= startMs && t < endMs;
  }).length;
}

function getReportLikeCount(place: Place) {
  return place.reports.reduce(
    (sum, report) => sum + (report.likedByIds?.length ?? 0),
    0,
  );
}

/** 오늘 방문(createdAt) 우선 */
function rankPlacesByHot(places: Place[], limit: number) {
  return places
    .map((place) => {
      const todayCount = getTodayReportCount(place);
      const recentCount = getRecentReportCount(place, 14);
      return {
        place,
        score: todayCount * 1000 + recentCount,
      } satisfies RankedPlace;
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .slice(0, limit);
}

/** 최근 7일 vs 직전 7일 (createdAt) */
function rankPlacesByRising(places: Place[], limit: number) {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const thisWeekStart = now - weekMs;
  const prevWeekStart = now - weekMs * 2;

  return places
    .map((place) => {
      const thisWeek = countReportsInRange(place, thisWeekStart, now);
      const prevWeek = countReportsInRange(place, prevWeekStart, thisWeekStart);
      const growth = thisWeek - prevWeek;
      const ratio = thisWeek / Math.max(prevWeek, 1);
      return {
        place,
        score: growth * 100 + ratio * 10 + thisWeek,
        thisWeek,
        growth,
      };
    })
    .filter((entry) => entry.thisWeek > 0 && entry.growth >= 0)
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .slice(0, limit)
    .map(({ place, score }) => ({ place, score }));
}

/** 좋아요·방문글 수 */
function rankPlacesByFans(places: Place[], limit: number) {
  return places
    .map((place) => {
      const likes = getReportLikeCount(place);
      const reports = place.reports.length;
      return {
        place,
        score: likes * 10 + reports,
      } satisfies RankedPlace;
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .slice(0, limit);
}

export function getRankedPlaces(
  places: Place[],
  kind: PlaceRankingKind,
  limit = RANKING_LIMIT,
) {
  switch (kind) {
    case "hot":
      return rankPlacesByHot(places, limit);
    case "rising":
      return rankPlacesByRising(places, limit);
    case "fans":
      return rankPlacesByFans(places, limit);
  }
}
