"use client";

import type { ReactNode } from "react";
import { PlaceDetail } from "@/features/places/components/place-detail";
import {
  BottomSheet,
  type SheetSnap,
} from "@/features/places/components/bottom-sheet";
import type { Place } from "@/features/places/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlacePanelProps = {
  place: Place;
  onClose: () => void;
  onReport?: () => void;
  headerActions?: ReactNode; // 닫기 왼쪽 — 즐겨찾기·공유 등
  variant?: "sidebar" | "sheet"; // PC: 목록 옆 떠 있는 모달 / Mobile: 하단 시트
  onSnapChange?: (snap: SheetSnap) => void;
  onHeightChange?: (height: number) => void;
  className?: string;
};

/** 장소 상세 패널 — PC 사이드 카드 / 모바일 시트 */
export function PlacePanel({
  place,
  onClose,
  onReport,
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
          headerActions={headerActions}
          showDragHandle={false}
        />
      </Card>
    );
  }

  // BottomSheet가 상단 드래그 핸들을 그리므로 PlaceDetail showDragHandle은 false
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
        headerActions={headerActions}
        showBack
        showDragHandle={false}
      />
    </BottomSheet>
  );
}
