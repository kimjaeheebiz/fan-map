import type { SportId } from "@/features/catalog/types";
import { getSportName, teams } from "@/features/catalog/constants";
import type { Place } from "@/features/places/types";
import {
  getPlaceSportIds,
  getReportTeamIds,
  hasActivePlaceEvent,
} from "@/features/places/lib/place-helpers";

export type PlaceFilterState = {
  sportId: SportId | null;
  favoritesOnly: boolean;
  eventsOnly: boolean;
};

export const defaultPlaceFilters: PlaceFilterState = {
  sportId: null,
  favoritesOnly: false,
  eventsOnly: false,
};

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
      if (team) {
        tokens.add(team.name);
        if (team.shortName) tokens.add(team.shortName);
      }
    }
  }

  return [...tokens];
}

export function matchesPlaceSearch(place: Place, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return getPlaceSearchTokens(place).some((token) =>
    token.toLowerCase().includes(normalized),
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
    filters.favoritesOnly ||
    filters.eventsOnly
  );
}
