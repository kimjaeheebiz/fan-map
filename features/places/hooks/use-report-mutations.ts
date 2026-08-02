"use client";

import { useMutation } from "@tanstack/react-query";
import {
  addReport,
  deleteReport,
  PlacesStorageError,
  toggleReportLike,
  updateReport,
  type AddReportPayload,
  type DeleteReportPayload,
  type ToggleReportLikePayload,
  type UpdateReportPayload,
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

export function useUpdateReport() {
  const invalidatePlaces = useInvalidatePlaces();

  return useMutation<Place, Error, UpdateReportPayload>({
    mutationFn: async (payload) => updateReport(payload),
    onSuccess: async () => {
      await invalidatePlaces();
    },
  });
}

export function useDeleteReport() {
  const invalidatePlaces = useInvalidatePlaces();

  return useMutation<Place, Error, DeleteReportPayload>({
    mutationFn: async (payload) => deleteReport(payload),
    onSuccess: async () => {
      await invalidatePlaces();
    },
  });
}

export function useToggleReportLike() {
  const invalidatePlaces = useInvalidatePlaces();

  return useMutation<
    { place: Place; liked: boolean },
    Error,
    ToggleReportLikePayload
  >({
    mutationFn: async (payload) => toggleReportLike(payload),
    onSuccess: async () => {
      await invalidatePlaces();
    },
  });
}

export { PlacesStorageError };
