"use client";

import { LocateFixed, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 지도 위 플로팅 — foreground/background 토큰이 테마에 따라 반전 */
const mapOverlayButtonClassName = cn(
  "pointer-events-auto border-transparent bg-foreground text-background shadow-md",
  "hover:bg-foreground/90 hover:text-background",
);

type MapControlsProps = {
  onLocate: () => void;
  onResearch: () => void;
  onOpenRanking?: () => void;
  locateLoading?: boolean;
  researchDisabled?: boolean;
  sheetBottomOffset?: number; // 모바일 시트 높이(px). 있으면 위치 버튼을 시트 바로 위에 배치
};

export function MapControls({
  onLocate,
  onResearch,
  onOpenRanking,
  locateLoading = false,
  researchDisabled = false,
  sheetBottomOffset,
}: MapControlsProps) {
  const mobileBottom =
    sheetBottomOffset != null && sheetBottomOffset > 0
      ? sheetBottomOffset + 12
      : undefined;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-28 z-10 flex justify-center md:top-4">
        <Button
          type="button"
          size="sm"
          className={cn(mapOverlayButtonClassName, "rounded-full")}
          onClick={onResearch}
          disabled={researchDisabled}
        >
          <RotateCcw data-icon="inline-start" />
          이 지역 검색
        </Button>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute right-3 z-10 flex flex-col gap-2 md:!bottom-4",
          mobileBottom == null && "bottom-24",
        )}
        style={mobileBottom != null ? { bottom: mobileBottom } : undefined}
      >
        {onOpenRanking ? (
          <Button
            type="button"
            size="icon"
            className={cn(mapOverlayButtonClassName, "xl:hidden")}
            aria-label="랭킹 보기"
            onClick={onOpenRanking}
          >
            <Trophy />
          </Button>
        ) : null}
        <Button
          type="button"
          size="icon"
          className={mapOverlayButtonClassName}
          aria-label="현재 위치로 이동"
          onClick={onLocate}
          disabled={locateLoading}
        >
          <LocateFixed />
        </Button>
      </div>
    </>
  );
}
