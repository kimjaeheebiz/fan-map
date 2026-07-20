import type { NaverMapsNamespace } from "@/features/map/types/naver";

/** 선택 시에도 아이콘 크기·앵커 고정 — 선택 상태는 CSS 클래스로 토글 */
export const MARKER_HIT_SIZE = 28;

export function createPlaceMarkerIcon(
  maps: NaverMapsNamespace,
  placeId: string,
  options?: { favorite?: boolean },
) {
  const favoriteClass = options?.favorite
    ? " fan-map-marker-wrap--favorite"
    : "";

  return {
    content: `<div class="fan-map-marker-wrap${favoriteClass}" data-place-id="${placeId}"><div class="fan-map-marker-dot" aria-hidden="true"></div></div>`,
    size: new maps.Size(MARKER_HIT_SIZE, MARKER_HIT_SIZE),
    anchor: new maps.Point(MARKER_HIT_SIZE / 2, MARKER_HIT_SIZE / 2),
  };
}

export function syncMarkerSelection(
  mapContainer: HTMLElement | null,
  selectedPlaceId: string | null,
) {
  if (!mapContainer) return;

  mapContainer.querySelectorAll<HTMLElement>(".fan-map-marker-wrap").forEach((el) => {
    const placeId = el.dataset.placeId;
    el.classList.toggle(
      "fan-map-marker-wrap--selected",
      placeId != null && placeId === selectedPlaceId,
    );
  });
}

export function syncMarkerFavorites(
  mapContainer: HTMLElement | null,
  favoritePlaceIds: string[],
) {
  if (!mapContainer) return;
  const favoriteSet = new Set(favoritePlaceIds);

  mapContainer.querySelectorAll<HTMLElement>(".fan-map-marker-wrap").forEach((el) => {
    const placeId = el.dataset.placeId;
    el.classList.toggle(
      "fan-map-marker-wrap--favorite",
      placeId != null && favoriteSet.has(placeId),
    );
  });
}
