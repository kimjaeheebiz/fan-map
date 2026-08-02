"use client";

import type { ReactNode } from "react";
import { PlaceList } from "@/features/places/components/place-list";
import {
  BottomSheet,
  SheetDragArea,
  type SheetSnap,
} from "@/features/places/components/bottom-sheet";
import type { Place } from "@/features/places/types";
import { EmptyState } from "@/components/common/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

type PlaceListSheetProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  listSubtitle?: string;
  placeCountLabel: string;
  onSnapChange?: (snap: SheetSnap) => void;
  onHeightChange?: (height: number) => void;
  className?: string;
};

/** 모바일: 지도 하단에서 올라오는 장소 목록 시트 */
export function PlaceListSheet({
  places,
  selectedPlaceId,
  onSelectPlace,
  emptyTitle,
  emptyDescription,
  emptyAction,
  listSubtitle = "주변 장소",
  placeCountLabel,
  onSnapChange,
  onHeightChange,
  className,
}: PlaceListSheetProps) {
  return (
    <BottomSheet
      defaultSnap="half"
      onSnapChange={onSnapChange}
      onHeightChange={onHeightChange}
      className={className}
    >
      <SheetDragArea className="shrink-0 px-4 pb-2">
        <p className="text-base font-bold tracking-tight">오늘 어디서 응원할까?</p>
        <p className="text-muted-foreground text-xs">
          {listSubtitle} {placeCountLabel}
        </p>
      </SheetDragArea>

      <ScrollArea className="min-h-0 flex-1">
        {places.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className="m-4 py-8"
          />
        ) : (
          <PlaceList
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={onSelectPlace}
          />
        )}
      </ScrollArea>
    </BottomSheet>
  );
}
