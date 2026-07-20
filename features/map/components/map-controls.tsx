"use client";

import { LocateFixed, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
type MapControlsProps = {
  onLocate: () => void;
  onResearch: () => void;
  locateLoading?: boolean;
  researchDisabled?: boolean;
  hasBottomCard?: boolean;
  hasDetailPanel?: boolean;
};

export function MapControls({
  onLocate,
  onResearch,
  locateLoading = false,
  researchDisabled = false,
  hasBottomCard = false,
  hasDetailPanel = false,
}: MapControlsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-3 z-10 flex flex-col gap-2",
        hasDetailPanel
          ? "md:bottom-[36rem]"
          : hasBottomCard
            ? "bottom-[15rem] md:bottom-[15rem]"
            : "bottom-24 md:bottom-4",
      )}
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
