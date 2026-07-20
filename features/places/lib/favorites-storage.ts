const FAVORITES_KEY = "fan-map:favorites";

export type FavoriteEntry = {
  placeId: string;
  createdAt: string;
};

export function readFavoritePlaceIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => entry.placeId);
  } catch {
    return [];
  }
}
