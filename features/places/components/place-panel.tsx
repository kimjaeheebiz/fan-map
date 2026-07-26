"use client";

import type { ReactNode } from "react";
import { PlaceDetail } from "@/features/places/components/place-detail";
import {
  BottomSheet,
  type SheetSnap,
} from "@/features/places/components/bottom-sheet";
import type { Place, ViewingReport } from "@/features/places/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlacePanelProps = {
  place: Place;
  onClose: () => void;
  onReport?: () => void;
  onEditReport?: (report: ViewingReport) => void;
  headerActions?: ReactNode;
  variant?: "sidebar" | "sheet";
  onSnapChange?: (snap: SheetSnap) => void;
  onHeightChange?: (height: number) => void;
  className?: string;
};

/** 장소 상세 패널 — PC 사이드 카드 / 모바일 시트 */
export function PlacePanel({
  place,
  onClose,
  onReport,
  onEditReport,
  headerActions,
  variant = "sheet",
  onSnapChange,
  onHeightChange,
  className,
}: PlacePanelProps) {
  if (variant === "sidebar") {
    return (
      <Card
        className={cn(
          "bg-popover flex h-full min-h-0 flex-col gap-0 overflow-hidden border py-0 shadow-xl",
          "animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200",
          className,
        )}
      >
        <PlaceDetail
          place={place}
          onClose={onClose}
          onReport={onReport}
          onEditReport={onEditReport}
          headerActions={headerActions}
          showDragHandle={false}
        />
      </Card>
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
      <PlaceDetail
        place={place}
        onClose={onClose}
        onReport={onReport}
        onEditReport={onEditReport}
        headerActions={headerActions}
        showBack
        showDragHandle={false}
      />
    </BottomSheet>
  );
}
