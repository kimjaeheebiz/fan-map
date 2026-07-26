import { mockPlaces } from "@/features/places/data/mock-places";
import type { SportId } from "@/features/catalog/types";
import { sportTeamsFromFlat } from "@/features/places/lib/place-helpers";
import type { Place, ViewingReport } from "@/features/places/types";
import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";

export const PLACES_STORAGE_KEY = "fan-map:places";

const LEGACY_AUTHORS = [
  { authorId: "mock-user-1", authorNickname: "잠실응원단" },
  { authorId: "mock-user-2", authorNickname: "야구덕후" },
  { authorId: "mock-user-3", authorNickname: "축구팬" },
  { authorId: "mock-user-4", authorNickname: "직관러" },
] as const;

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
  authorId?: string;
  authorNickname?: string;
};

function legacyAuthorFor(reportId: string) {
  let hash = 0;
  for (let i = 0; i < reportId.length; i += 1) {
    hash = (hash + reportId.charCodeAt(i)) % LEGACY_AUTHORS.length;
  }
  return LEGACY_AUTHORS[hash] ?? LEGACY_AUTHORS[0];
}

/** 구버전 필드·작성자 누락을 정규화 */
function normalizeReport(report: LegacyReport): ViewingReport {
  const author =
    report.authorId && report.authorNickname
      ? {
          authorId: report.authorId,
          authorNickname: report.authorNickname,
        }
      : legacyAuthorFor(report.id);

  if (report.sportTeams?.length) {
    return {
      ...report,
      ...author,
      sportTeams: report.sportTeams,
    };
  }

  const sportIds = report.sportIds?.length
    ? report.sportIds
    : report.sportId
      ? [report.sportId]
      : [];
  const teamIds = report.teamIds?.length
    ? report.teamIds
    : report.teamId
      ? [report.teamId]
      : [];

  const {
    sportId: _sportId,
    teamId: _teamId,
    sportIds: _sportIds,
    teamIds: _teamIds,
    ...rest
  } = report;

  return {
    ...rest,
    ...author,
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
  const seeded = mockPlaces.map(normalizePlace);
  writePlacesToStorage(seeded);
  return seeded;
}

export function getPlaces(): Place[] {
  return seedPlacesIfEmpty();
}

export function findPlaceByNaverId(places: Place[], naverPlaceId?: string) {
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

export type UpdateReportPayload = {
  placeId: string;
  reportId: string;
  report: Pick<
    ViewingReport,
    "sportTeams" | "watchedAt" | "review" | "tagIds" | "images"
  > &
    Partial<
      Pick<ViewingReport, "hasScreen" | "hasSound" | "goodForGroup">
    >;
  /** 본인 제보만 수정 가능 */
  editorId: string;
};

export function updateReport(payload: UpdateReportPayload): Place {
  const places = getPlaces();
  const place = places.find((entry) => entry.id === payload.placeId);
  if (!place) {
    throw new PlacesStorageError("장소를 찾을 수 없습니다.", "invalid");
  }

  const index = place.reports.findIndex(
    (report) => report.id === payload.reportId,
  );
  if (index < 0) {
    throw new PlacesStorageError("기록을 찾을 수 없습니다.", "invalid");
  }

  const current = place.reports[index];
  if (current.authorId !== payload.editorId) {
    throw new PlacesStorageError("본인이 남긴 기록만 수정할 수 있습니다.", "invalid");
  }

  place.reports[index] = {
    ...current,
    sportTeams: payload.report.sportTeams,
    watchedAt: payload.report.watchedAt,
    review: payload.report.review,
    tagIds: payload.report.tagIds,
    images: payload.report.images,
    hasScreen: payload.report.hasScreen ?? current.hasScreen,
    hasSound: payload.report.hasSound ?? current.hasSound,
    goodForGroup: payload.report.goodForGroup ?? current.goodForGroup,
  };

  writePlacesToStorage(places);
  return place;
}

export type DeleteReportPayload = {
  placeId: string;
  reportId: string;
  /** 본인 제보만 삭제 가능 */
  editorId: string;
};

export function deleteReport(payload: DeleteReportPayload): Place {
  const places = getPlaces();
  const place = places.find((entry) => entry.id === payload.placeId);
  if (!place) {
    throw new PlacesStorageError("장소를 찾을 수 없습니다.", "invalid");
  }

  const target = place.reports.find((report) => report.id === payload.reportId);
  if (!target) {
    throw new PlacesStorageError("기록을 찾을 수 없습니다.", "invalid");
  }
  if (target.authorId !== payload.editorId) {
    throw new PlacesStorageError("본인이 남긴 기록만 삭제할 수 있습니다.", "invalid");
  }

  const removedImages = new Set(target.images);
  place.reports = place.reports.filter((report) => report.id !== payload.reportId);

  if (
    place.coverImageUrl &&
    removedImages.has(place.coverImageUrl) &&
    !place.reports.some((report) => report.images.includes(place.coverImageUrl!))
  ) {
    place.coverImageUrl =
      place.reports.find((report) => report.images[0])?.images[0] ?? undefined;
  }

  writePlacesToStorage(places);
  return place;
}

/** 현재 사용자가 작성한 제보 (장소 정보 포함) */
export function listReportsByAuthor(authorId: string) {
  return getPlaces().flatMap((place) =>
    place.reports
      .filter((report) => report.authorId === authorId)
      .map((report) => ({ place, report })),
  );
}
