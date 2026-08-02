import type { Place } from "@/features/places/types";
import {
  getRecentReportCount,
  getTodayReportCount,
} from "@/features/places/lib/place-helpers";

export type PlaceRankingKind = "hot" | "rising" | "fans";

export const PLACE_RANKING_LABELS: Record<PlaceRankingKind, string> = {
  hot: "오늘 HOT",
  rising: "이번 주 급상승",
  fans: "팬 추천",
};

export type RankedPlace = {
  place: Place;
  score: number;
  meta: string; // 보조 문구
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

/** 오늘 방문 수 기준 */
export function rankPlacesByHot(places: Place[], limit = RANKING_LIMIT) {
  return places
    .map((place) => {
      const todayCount = getTodayReportCount(place);
      const recentCount = getRecentReportCount(place, 14);
      return {
        place,
        score: todayCount * 1000 + recentCount,
        meta:
          todayCount > 0
            ? `오늘 방문 ${todayCount}건`
            : recentCount > 0
              ? `최근 방문 ${recentCount}건`
              : "방문 기록 없음",
      } satisfies RankedPlace;
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .slice(0, limit);
}

/** 최근 7일 vs 직전 7일 증가율 */
export function rankPlacesByRising(places: Place[], limit = RANKING_LIMIT) {
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
        meta:
          prevWeek === 0 && thisWeek > 0
            ? `이번 주 ${thisWeek}건 (신규)`
            : growth > 0
              ? `이번 주 ${thisWeek}건 · +${growth}`
              : `이번 주 ${thisWeek}건`,
        thisWeek,
        growth,
      };
    })
    .filter((entry) => entry.thisWeek > 0 && entry.growth >= 0)
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .slice(0, limit)
    .map(({ place, score, meta }) => ({ place, score, meta }));
}

/** 좋아요·제보 수 기반 */
export function rankPlacesByFans(places: Place[], limit = RANKING_LIMIT) {
  return places
    .map((place) => {
      const likes = getReportLikeCount(place);
      const reports = place.reports.length;
      return {
        place,
        score: likes * 10 + reports,
        meta:
          likes > 0
            ? `좋아요 ${likes} · 방문 글 ${reports}`
            : reports > 0
              ? `방문 글 ${reports}`
              : "추천 데이터 없음",
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
