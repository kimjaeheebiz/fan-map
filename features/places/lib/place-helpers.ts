import { sortTagIdsByPriority, sports, teams } from "@/features/catalog/constants";
import type { SportId } from "@/features/catalog/types";
import type {
  Place,
  PlaceEvent,
  SportTeamSet,
  ViewingReport,
} from "@/features/places/types";
import { formatDate, formatDateTimeMinute } from "@/lib/format-date";

const sportCatalogOrder = new Map(sports.map((sport) => [sport.id, sport.order]));

export function getReportCount(place: Place) {
  return place.reports.length;
}

/** 방문 일시 우선, 없으면 작성 시각 */
export function getReportTimeMs(report: ViewingReport) {
  const watched = new Date(report.watchedAt).getTime();
  if (Number.isFinite(watched)) return watched;
  const created = new Date(report.createdAt).getTime();
  return Number.isFinite(created) ? created : 0;
}

/** 방문 일시 최신순 — 동률이면 작성 시각 */
export function sortReportsNewestFirst(reports: ViewingReport[]) {
  return [...reports].sort((a, b) => {
    const byWatched = getReportTimeMs(b) - getReportTimeMs(a);
    if (byWatched !== 0) return byWatched;
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
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

/** 종목 순위: 제보 수 내림차순 → 동률이면 catalog order */
export function getPlaceSportsRanked(place: Place) {
  const counts = new Map<SportId, number>();
  for (const report of place.reports) {
    for (const sportId of getReportSportIds(report)) {
      counts.set(sportId, (counts.get(sportId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([sportId, count]) => ({ sportId, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return (
        (sportCatalogOrder.get(a.sportId) ?? 99) -
        (sportCatalogOrder.get(b.sportId) ?? 99)
      );
    });
}

/**
 * 지도 핀용 종목.
 * 활성 종목 필터가 있고 장소에 포함되면 필터 종목, 아니면 ranked 1위.
 */
export function getDisplaySportId(
  place: Place,
  activeFilterSportId?: SportId | null,
): SportId | null {
  const ranked = getPlaceSportsRanked(place);
  if (ranked.length === 0) return null;
  if (
    activeFilterSportId &&
    ranked.some((entry) => entry.sportId === activeFilterSportId)
  ) {
    return activeFilterSportId;
  }
  return ranked[0].sportId;
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

/** 오늘 0시 이후 작성된 제보 수 (createdAt) */
export function getTodayReportCount(place: Place) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return place.reports.filter(
    (report) => new Date(report.createdAt).getTime() >= start.getTime(),
  ).length;
}

/** 최근 N일 작성 제보 수 (createdAt) */
export function getRecentReportCount(place: Place, days = 14) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return place.reports.filter(
    (report) => new Date(report.createdAt).getTime() >= cutoff,
  ).length;
}

export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return formatDateTimeMinute(iso);
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 10) return `${days}일 전`;
  return formatDateTimeMinute(iso);
}

/** 장소 제보 tagIds 합집합 — 카테고리 우선순 정렬 */
export function getPlaceTagIds(place: Place) {
  const tagIds = new Set<string>();
  for (const report of place.reports) {
    for (const tagId of report.tagIds ?? []) tagIds.add(tagId);
  }
  return sortTagIdsByPriority([...tagIds]);
}

export function getTopTeamShortNames(place: Place, limit = 3) {
  return getTeamDistribution(place)
    .slice(0, limit)
    .map(({ teamId }) => {
      const team = teams.find((entry) => entry.id === teamId);
      return team?.shortName ?? team?.name ?? teamId;
    });
}

/** 목록·상세 Live 요약 */
export function getPlaceLiveSummary(place: Place) {
  const todayCount = getTodayReportCount(place);
  const recentCount = getRecentReportCount(place, 14);
  const teamsLabel = getTopTeamShortNames(place).join(" · ");

  return {
    todayCount,
    recentCount,
    teamsLabel,
    isHot: todayCount > 0 || recentCount >= 2,
  };
}

/** 오늘 기준 진행 중 이벤트 1건 (종료일이 가장 가까운 것) */
export function getActivePlaceEvent(place: Place): PlaceEvent | null {
  const events = place.events;
  if (!events?.length) return null;

  const today = formatDate(new Date());
  const active = events.filter((event) => {
    const start = formatDate(event.startsAt);
    const end = formatDate(event.endsAt);
    return start <= today && today <= end;
  });
  if (active.length === 0) return null;

  active.sort((a, b) =>
    formatDate(a.endsAt).localeCompare(formatDate(b.endsAt)),
  );
  return active[0] ?? null;
}

export function hasActivePlaceEvent(place: Place) {
  return getActivePlaceEvent(place) != null;
}
