import type { SportId } from "@/features/catalog/types";
import { getSportName, teams } from "@/features/catalog/constants";
import type { Place } from "@/features/places/types";
import {
  getLatestReport,
  getPlaceSportIds,
  getReportTeamIds,
  hasActivePlaceEvent,
} from "@/features/places/lib/place-helpers";

/** 최근 관람 제보 기준일 수 (PoC) */
export const RECENT_REPORT_DAYS = 90;

export type PlaceFilterState = {
  sportId: SportId | null;
  recentReportOnly: boolean;
  favoritesOnly: boolean;
  eventsOnly: boolean;
};

export const defaultPlaceFilters: PlaceFilterState = {
  sportId: null,
  recentReportOnly: false,
  favoritesOnly: false,
  eventsOnly: false,
};

export function hasRecentReport(
  place: Place,
  withinDays = RECENT_REPORT_DAYS,
  now = new Date(),
) {
  const latest = getLatestReport(place);
  if (!latest) return false;
  const watched = new Date(latest.watchedAt);
  if (Number.isNaN(watched.getTime())) return false;
  const diffMs = now.getTime() - watched.getTime();
  return diffMs <= withinDays * 24 * 60 * 60 * 1000;
}

function getPlaceSearchTokens(place: Place) {
  const tokens = new Set<string>();

  for (const value of [place.name, place.address, place.categoryName]) {
    if (value) tokens.add(value);
  }

  for (const sportId of getPlaceSportIds(place)) {
    tokens.add(getSportName(sportId));
  }

  for (const report of place.reports) {
    for (const teamId of getReportTeamIds(report)) {
      const team = teams.find((entry) => entry.id === teamId);
      if (!team) {
        tokens.add(teamId);
        continue;
      }
      tokens.add(team.name);
      if (team.shortName) tokens.add(team.shortName);
    }
  }

  return [...tokens];
}

export function matchesPlaceSearch(place: Place, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return getPlaceSearchTokens(place).some((value) =>
    value.toLowerCase().includes(q),
  );
}

export function filterPlaces(
  places: Place[],
  options: {
    searchQuery: string;
    filters: PlaceFilterState;
    favoritePlaceIds: string[];
  },
) {
  const { searchQuery, filters, favoritePlaceIds } = options;
  const favoriteSet = new Set(favoritePlaceIds);

  return places.filter((place) => {
    if (!matchesPlaceSearch(place, searchQuery)) return false;
    if (filters.sportId && !getPlaceSportIds(place).includes(filters.sportId)) {
      return false;
    }
    if (filters.recentReportOnly && !hasRecentReport(place)) return false;
    if (filters.favoritesOnly && !favoriteSet.has(place.id)) return false;
    if (filters.eventsOnly && !hasActivePlaceEvent(place)) return false;
    return true;
  });
}

export function hasActivePlaceFilters(
  filters: PlaceFilterState,
  searchQuery: string,
) {
  return (
    searchQuery.trim().length > 0 ||
    filters.sportId !== null ||
    filters.recentReportOnly ||
    filters.favoritesOnly ||
    filters.eventsOnly
  );
}
