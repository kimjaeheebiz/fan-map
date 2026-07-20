"use client";

import { useCallback, useEffect, useState } from "react";
import { readFavoritePlaceIds } from "@/features/places/lib/favorites-storage";

export function useFavoritePlaceIds() {
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setFavoritePlaceIds(readFavoritePlaceIds());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  return { favoritePlaceIds, refreshFavorites: refresh };
}
