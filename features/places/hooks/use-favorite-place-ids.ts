"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_CHANGED_EVENT,
  readFavoritePlaceIds,
  toggleFavoritePlace,
} from "@/features/places/lib/favorites-storage";

export function useFavoritePlaceIds() {
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);

  const refreshFavorites = useCallback(() => {
    setFavoritePlaceIds(readFavoritePlaceIds());
  }, []);

  useEffect(() => {
    refreshFavorites();

    function onChange() {
      refreshFavorites();
    }

    window.addEventListener("storage", onChange);
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange);
    };
  }, [refreshFavorites]);

  const toggleFavorite = useCallback((placeId: string) => {
    const isFavorite = toggleFavoritePlace(placeId);
    setFavoritePlaceIds(readFavoritePlaceIds());
    return isFavorite;
  }, []);

  const isFavorite = useCallback(
    (placeId: string) => favoritePlaceIds.includes(placeId),
    [favoritePlaceIds],
  );

  return {
    favoritePlaceIds,
    refreshFavorites,
    toggleFavorite,
    isFavorite,
  };
}
