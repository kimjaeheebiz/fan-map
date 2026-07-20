const FAVORITES_KEY = "fan-map:favorites";
export const FAVORITES_CHANGED_EVENT = "fan-map:favorites-changed";

export type FavoriteEntry = {
  placeId: string;
  createdAt: string;
};

function notifyFavoritesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export function readFavoriteEntries(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is FavoriteEntry =>
        Boolean(entry) &&
        typeof entry === "object" &&
        typeof (entry as FavoriteEntry).placeId === "string",
    );
  } catch {
    return [];
  }
}

export function readFavoritePlaceIds(): string[] {
  return readFavoriteEntries().map((entry) => entry.placeId);
}

export function writeFavoriteEntries(entries: FavoriteEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(entries));
  notifyFavoritesChanged();
}

export function isFavoritePlace(placeId: string) {
  return readFavoritePlaceIds().includes(placeId);
}

/** 토글 후 즐겨찾기 여부(true=추가됨)를 반환 */
export function toggleFavoritePlace(placeId: string): boolean {
  const entries = readFavoriteEntries();
  const index = entries.findIndex((entry) => entry.placeId === placeId);

  if (index >= 0) {
    entries.splice(index, 1);
    writeFavoriteEntries(entries);
    return false;
  }

  entries.unshift({
    placeId,
    createdAt: new Date().toISOString(),
  });
  writeFavoriteEntries(entries);
  return true;
}
