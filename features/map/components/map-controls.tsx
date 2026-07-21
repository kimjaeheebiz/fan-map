"use client";

import { LocateFixed, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MapControlsProps = {
  onLocate: () => void;
  onResearch: () => void;
  locateLoading?: boolean;
  researchDisabled?: boolean;
  sheetBottomOffset?: number; // 모바일 시트 높이(px). 있으면 컨트롤을 시트 바로 위에 배치
};

export function MapControls({
  onLocate,
  onResearch,
  locateLoading = false,
  researchDisabled = false,
  sheetBottomOffset,
}: MapControlsProps) {
  const mobileBottom =
    sheetBottomOffset != null && sheetBottomOffset > 0
      ? sheetBottomOffset + 12
      : undefined;

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-3 z-10 flex flex-col gap-2 md:!bottom-4",
        mobileBottom == null && "bottom-24",
      )}
      style={
        mobileBottom != null ? { bottom: mobileBottom } : undefined
      }
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="pointer-events-auto shadow-md"
        onClick={onResearch}
        disabled={researchDisabled}
      >
        <RotateCcw data-icon="inline-start" />
        이 지역 재검색
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="pointer-events-auto self-end shadow-md"
        aria-label="현재 위치로 이동"
        onClick={onLocate}
        disabled={locateLoading}
      >
        <LocateFixed />
      </Button>
    </div>
  );
}
