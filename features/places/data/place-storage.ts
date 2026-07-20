import { mockPlaces } from "@/features/places/data/mock-places";
import type { SportId } from "@/features/catalog/types";
import { sportTeamsFromFlat } from "@/features/places/lib/place-helpers";
import type { Place, ViewingReport } from "@/features/places/types";
import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";

export const PLACES_STORAGE_KEY = "fan-map:places";

export class PlacesStorageError extends Error {
  constructor(
    message: string,
    readonly code: "quota" | "invalid" | "unknown" = "unknown",
  ) {
    super(message);
    this.name = "PlacesStorageError";
  }
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type LegacyReport = ViewingReport & {
  sportId?: SportId;
  teamId?: string;
  sportIds?: SportId[];
  teamIds?: string[];
};

/** 구버전 필드를 sportTeams 세트로 정규화 */
function normalizeReport(report: LegacyReport): ViewingReport {
  if (report.sportTeams?.length) {
    return {
      ...report,
      sportTeams: report.sportTeams,
    };
  }

  const sportIds =
    report.sportIds?.length
      ? report.sportIds
      : report.sportId
        ? [report.sportId]
        : [];
  const teamIds =
    report.teamIds?.length
      ? report.teamIds
      : report.teamId
        ? [report.teamId]
        : [];

  const { sportId: _sportId, teamId: _teamId, sportIds: _sportIds, teamIds: _teamIds, ...rest } =
    report;

  return {
    ...rest,
    sportTeams: sportTeamsFromFlat(sportIds, teamIds),
  };
}

function normalizePlace(place: Place): Place {
  return {
    ...place,
    reports: place.reports.map((report) =>
      normalizeReport(report as LegacyReport),
    ),
  };
}

function isPlace(value: unknown): value is Place {
  if (!value || typeof value !== "object") return false;
  const place = value as Place;
  return (
    typeof place.id === "string" &&
    typeof place.name === "string" &&
    typeof place.address === "string" &&
    typeof place.lat === "number" &&
    typeof place.lng === "number" &&
    Array.isArray(place.reports)
  );
}

export function readPlacesFromStorage(): Place[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLACES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const places = parsed.filter(isPlace).map(normalizePlace);
    return places.length > 0 ? places : null;
  } catch {
    return null;
  }
}

export function writePlacesToStorage(places: Place[]) {
  if (typeof window === "undefined") {
    throw new PlacesStorageError("브라우저 환경에서만 저장할 수 있습니다.");
  }
  try {
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.code === 22)
    ) {
      throw new PlacesStorageError(
        "저장 공간이 부족합니다. 사진 장수를 줄이거나 용량이 작은 사진을 선택해 주세요.",
        "quota",
      );
    }
    throw new PlacesStorageError("장소 데이터를 저장하지 못했습니다.");
  }
}

export function seedPlacesIfEmpty(): Place[] {
  const existing = readPlacesFromStorage();
  if (existing) return existing;
  writePlacesToStorage(mockPlaces);
  return mockPlaces;
}

export function getPlaces(): Place[] {
  return seedPlacesIfEmpty();
}

export function findPlaceByNaverId(
  places: Place[],
  naverPlaceId?: string,
) {
  if (!naverPlaceId) return undefined;
  return places.find((place) => place.naverPlaceId === naverPlaceId);
}

export type PlaceDraft = Pick<
  Place,
  | "naverPlaceId"
  | "name"
  | "address"
  | "lat"
  | "lng"
  | "phone"
  | "categoryName"
  | "naverMapUrl"
>;

export function placeDraftFromSearch(result: PlaceSearchResult): PlaceDraft {
  return {
    naverPlaceId: result.naverPlaceId,
    name: result.name,
    address: result.address,
    lat: result.lat,
    lng: result.lng,
    phone: result.phone,
    categoryName: result.categoryName,
    naverMapUrl: result.naverMapUrl,
  };
}

export function placeDraftFromPlace(place: Place): PlaceDraft {
  return {
    naverPlaceId: place.naverPlaceId,
    name: place.name,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
    phone: place.phone,
    categoryName: place.categoryName,
    naverMapUrl: place.naverMapUrl,
  };
}

export type AddReportPayload = {
  placeDraft: PlaceDraft;
  report: Omit<ViewingReport, "id" | "placeId" | "createdAt">;
};

export function addReport(payload: AddReportPayload): Place {
  const places = getPlaces();
  let place =
    findPlaceByNaverId(places, payload.placeDraft.naverPlaceId) ??
    places.find(
      (candidate) =>
        candidate.name === payload.placeDraft.name &&
        candidate.address === payload.placeDraft.address,
    );

  if (!place) {
    place = {
      id: createId("place"),
      ...payload.placeDraft,
      reports: [],
      createdAt: new Date().toISOString(),
    };
    places.push(place);
  } else {
    Object.assign(place, {
      phone: payload.placeDraft.phone ?? place.phone,
      categoryName: payload.placeDraft.categoryName ?? place.categoryName,
      naverMapUrl: payload.placeDraft.naverMapUrl ?? place.naverMapUrl,
      naverPlaceId: payload.placeDraft.naverPlaceId ?? place.naverPlaceId,
    });
  }

  const report: ViewingReport = {
    ...payload.report,
    id: createId("report"),
    placeId: place.id,
    createdAt: new Date().toISOString(),
  };

  place.reports = [report, ...place.reports];

  if (!place.coverImageUrl && report.images[0]) {
    place.coverImageUrl = report.images[0];
  }

  writePlacesToStorage(places);
  return place;
}
