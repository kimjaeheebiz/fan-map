"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AUTH_CHANGED_EVENT } from "@/features/auth/lib/auth-storage";
import {
  FAVORITES_CHANGED_EVENT,
  readFavoritePlaceIds,
  toggleFavoritePlace,
} from "@/features/places/lib/favorites-storage";

export function useFavoritePlaceIds() {
  const { user, isAuthenticated, isReady } = useAuth();
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);

  const refreshFavorites = useCallback(() => {
    setFavoritePlaceIds(readFavoritePlaceIds(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (!isReady) return;
    refreshFavorites();

    function onChange() {
      refreshFavorites();
    }

    window.addEventListener("storage", onChange);
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChange);
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange);
      window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
    };
  }, [isReady, refreshFavorites]);

  /** 로그인 사용자만 토글. 비로그인이면 null */
  const toggleFavorite = useCallback(
    (placeId: string): boolean | null => {
      if (!user?.id) return null;
      const next = toggleFavoritePlace(user.id, placeId);
      setFavoritePlaceIds(readFavoritePlaceIds(user.id));
      return next;
    },
    [user?.id],
  );

  const isFavorite = useCallback(
    (placeId: string) =>
      isAuthenticated && favoritePlaceIds.includes(placeId),
    [isAuthenticated, favoritePlaceIds],
  );

  return {
    favoritePlaceIds: isAuthenticated ? favoritePlaceIds : [],
    refreshFavorites,
    toggleFavorite,
    isFavorite,
  };
}
