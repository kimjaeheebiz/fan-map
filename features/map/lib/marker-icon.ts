import type { NaverMapsNamespace } from "@/features/map/types/naver";
import type { SportId } from "@/features/catalog/types";
import { sportAccentColor } from "@/features/catalog/sport-colors";
import { getSportIconSvgHtml } from "@/features/catalog/sport-icon-svg";

/** 선택 시에도 아이콘 크기·앵커 고정 — 선택 상태는 CSS 클래스로 토글 */
export const MARKER_HIT_SIZE = 36;

export function createPlaceMarkerIcon(
  maps: NaverMapsNamespace,
  placeId: string,
  options?: {
    favorite?: boolean;
    sportId?: SportId | null;
    reportCount?: number;
    multiSport?: boolean;
  },
) {
  const favoriteClass = options?.favorite
    ? " fan-map-marker-wrap--favorite"
    : "";
  const multiClass = options?.multiSport
    ? " fan-map-marker-wrap--multi"
    : "";
  const sportId = options?.sportId ?? null;
  const iconHtml = getSportIconSvgHtml(sportId);
  const color = sportId ? sportAccentColor[sportId] : "#0057FF";
  const count =
    options?.reportCount && options.reportCount > 0
      ? Math.min(options.reportCount, 99)
      : null;
  const countHtml =
    count != null
      ? `<span class="fan-map-marker-count">${count}</span>`
      : "";
  const multiHtml = options?.multiSport
    ? `<span class="fan-map-marker-multi" aria-hidden="true"></span>`
    : "";

  return {
    content: `<div class="fan-map-marker-wrap${favoriteClass}${multiClass}" data-place-id="${placeId}" style="--fan-map-marker-accent:${color}"><div class="fan-map-marker-pin" aria-hidden="true">${iconHtml}${countHtml}${multiHtml}</div></div>`,
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
