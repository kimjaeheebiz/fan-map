"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaces } from "@/features/places/data/place-storage";

export const placeKeys = {
  all: ["places"] as const,
  list: () => [...placeKeys.all, "list"] as const,
};

export function usePlaces() {
  return useQuery({
    queryKey: placeKeys.list(),
    queryFn: () => getPlaces(),
  });
}

export function useInvalidatePlaces() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: placeKeys.list() });
}
