"use client";

import { PlaceDetail } from "@/features/places/components/place-detail";
import {
  BottomSheet,
  type SheetSnap,
} from "@/features/places/components/bottom-sheet";
import type { Place } from "@/features/places/types";
import { cn } from "@/lib/utils";

type PlacePanelProps = {
  place: Place;
  onClose: () => void;
  /** PC: 목록 옆 떠 있는 모달 / Mobile: 하단 시트 */
  variant?: "sidebar" | "sheet";
  onSnapChange?: (snap: SheetSnap) => void;
  onHeightChange?: (height: number) => void;
  className?: string;
};

export function PlacePanel({
  place,
  onClose,
  variant = "sheet",
  onSnapChange,
  onHeightChange,
  className,
}: PlacePanelProps) {
  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "bg-popover flex h-full flex-col overflow-hidden rounded-2xl border shadow-xl ring-border/20",
          "animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200",
          className,
        )}
      >
        <PlaceDetail place={place} onClose={onClose} />
      </div>
    );
  }

  return (
    <BottomSheet
      defaultSnap="half"
      dismissible
      onDismiss={onClose}
      onSnapChange={onSnapChange}
      onHeightChange={onHeightChange}
      className={className}
    >
      <PlaceDetail place={place} onClose={onClose} showBack />
    </BottomSheet>
  );
}
