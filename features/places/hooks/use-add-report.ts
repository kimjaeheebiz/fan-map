"use client";

import { useMutation } from "@tanstack/react-query";
import {
  addReport,
  PlacesStorageError,
  type AddReportPayload,
} from "@/features/places/data/place-storage";
import { useInvalidatePlaces } from "@/features/places/hooks/use-places";
import type { Place } from "@/features/places/types";

export function useAddReport() {
  const invalidatePlaces = useInvalidatePlaces();

  return useMutation<Place, Error, AddReportPayload>({
    mutationFn: async (payload) => addReport(payload),
    onSuccess: async () => {
      await invalidatePlaces();
    },
  });
}

export { PlacesStorageError };
