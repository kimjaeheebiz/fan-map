"use client";

import { useMemo, useState } from "react";
import { Flame, Heart, TrendingUp } from "lucide-react";
import {
  getRankedPlaces,
  PLACE_RANKING_LABELS,
  type PlaceRankingKind,
} from "@/features/places/lib/place-rankings";
import type { Place } from "@/features/places/types";
import { EmptyState } from "@/components/common/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PlaceRankingPanelProps = {
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace: (placeId: string) => void;
  className?: string;
  /** 탭 목록 compact (다이얼로그) */
  compact?: boolean;
};

const rankingTabs: {
  kind: PlaceRankingKind;
  icon: typeof Flame;
}[] = [
  { kind: "hot", icon: Flame },
  { kind: "rising", icon: TrendingUp },
  { kind: "fans", icon: Heart },
];

/** 헤더 + 7행 기준 고정 높이 (이름만 표시) */
export const PLACE_RANKING_PANEL_HEIGHT_CLASS = "h-[22rem]";

/** 랭킹 탭 + Top 목록 (패널·다이얼로그 공용) */
export function PlaceRankingPanel({
  places,
  selectedPlaceId = null,
  onSelectPlace,
  className,
  compact = false,
}: PlaceRankingPanelProps) {
  const [kind, setKind] = useState<PlaceRankingKind>("hot");

  const ranked = useMemo(
    () => getRankedPlaces(places, kind),
    [places, kind],
  );

  return (
    <div
      className={cn(
        "bg-card flex flex-col",
        !compact && PLACE_RANKING_PANEL_HEIGHT_CLASS,
        className,
      )}
    >
      <div className={cn("shrink-0 space-y-2", compact ? "px-4 pt-1 pb-2" : "p-3")}>
        {!compact ? (
          <p className="text-sm font-semibold tracking-tight">이 지역 랭킹</p>
        ) : null}
        <Tabs
          value={kind}
          onValueChange={(value) => {
            if (value === "hot" || value === "rising" || value === "fans") {
              setKind(value);
            }
          }}
        >
          <TabsList className="w-full">
            {rankingTabs.map(({ kind: tabKind, icon: Icon }) => (
              <TabsTrigger
                key={tabKind}
                value={tabKind}
                className="flex-1 px-1.5 text-[11px] sm:text-xs"
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{PLACE_RANKING_LABELS[tabKind]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {ranked.length === 0 ? (
          <EmptyState
            title="아직 랭킹 데이터가 없습니다."
            description="방문 글이 쌓이면 여기에 표시됩니다."
            className="m-3 py-8"
          />
        ) : (
          <ol className="flex flex-col pb-1">
            {ranked.map((entry, index) => {
              const selected = entry.place.id === selectedPlaceId;
              return (
                <li key={entry.place.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPlace(entry.place.id)}
                    className={cn(
                      "hover:bg-muted/60 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                      selected && "bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "text-muted-foreground w-5 shrink-0 text-center text-xs font-semibold tabular-nums",
                        index < 3 && "text-report",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {entry.place.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
