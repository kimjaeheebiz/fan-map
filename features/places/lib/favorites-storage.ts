const FAVORITES_KEY_PREFIX = "fan-map:favorites:";
/** 로그인 이전 전역 키 — 마이그레이션 후 제거 */
const LEGACY_FAVORITES_KEY = "fan-map:favorites";

export const FAVORITES_CHANGED_EVENT = "fan-map:favorites-changed";

export type FavoriteEntry = {
  placeId: string;
  createdAt: string;
};

function favoritesKey(userId: string) {
  return `${FAVORITES_KEY_PREFIX}${userId}`;
}

function notifyFavoritesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

function clearLegacyFavorites() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(LEGACY_FAVORITES_KEY) != null) {
    localStorage.removeItem(LEGACY_FAVORITES_KEY);
  }
}

export function readFavoriteEntries(userId: string | null | undefined): FavoriteEntry[] {
  if (typeof window === "undefined" || !userId) return [];
  clearLegacyFavorites();
  try {
    const raw = localStorage.getItem(favoritesKey(userId));
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

export function readFavoritePlaceIds(userId: string | null | undefined): string[] {
  return readFavoriteEntries(userId).map((entry) => entry.placeId);
}

export function writeFavoriteEntries(
  userId: string,
  entries: FavoriteEntry[],
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(favoritesKey(userId), JSON.stringify(entries));
  notifyFavoritesChanged();
}

export function isFavoritePlace(
  userId: string | null | undefined,
  placeId: string,
) {
  return readFavoritePlaceIds(userId).includes(placeId);
}

/** 토글 후 즐겨찾기 여부(true=추가됨)를 반환. userId 없으면 예외. */
export function toggleFavoritePlace(userId: string, placeId: string): boolean {
  const entries = readFavoriteEntries(userId);
  const index = entries.findIndex((entry) => entry.placeId === placeId);

  if (index >= 0) {
    entries.splice(index, 1);
    writeFavoriteEntries(userId, entries);
    return false;
  }

  entries.unshift({
    placeId,
    createdAt: new Date().toISOString(),
  });
  writeFavoriteEntries(userId, entries);
  return true;
}

/** 회원 탈퇴 등 — 해당 사용자 즐겨찾기 삭제 */
export function clearFavoritePlaces(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(favoritesKey(userId));
  notifyFavoritesChanged();
}
