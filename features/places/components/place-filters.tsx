"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { sports } from "@/features/catalog/constants";
import { sportAccentColor } from "@/features/catalog/sport-colors";
import { SportIcon } from "@/features/catalog/sport-icons";
import type { SportId } from "@/features/catalog/types";
import type { PlaceFilterState } from "@/features/places/lib/place-filters";
import { ReportActivityIcon } from "@/features/places/components/report-activity-icon";
import { HorizontalScroll } from "@/components/common/horizontal-scroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlaceFiltersProps = {
  filters: PlaceFilterState;
  onChange: (filters: PlaceFilterState) => void;
  className?: string;
};

export function PlaceFilters({
  filters,
  onChange,
  className,
}: PlaceFiltersProps) {
  function setSportId(sportId: SportId | null) {
    onChange({ ...filters, sportId });
  }

  function toggleRecentReportOnly() {
    onChange({ ...filters, recentReportOnly: !filters.recentReportOnly });
  }

  function toggleFavoritesOnly() {
    onChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  }

  const chips = (
    <>
      <FilterChip
        pressed={
          filters.sportId === null &&
          !filters.favoritesOnly &&
          !filters.recentReportOnly
        }
        onClick={() =>
          onChange({
            ...filters,
            sportId: null,
            favoritesOnly: false,
            recentReportOnly: false,
          })
        }
      >
        전체
      </FilterChip>
      <FilterChip
        pressed={filters.favoritesOnly}
        onClick={toggleFavoritesOnly}
        tone="live"
      >
        <Star className="size-3" aria-hidden />
        즐겨찾기
      </FilterChip>
      {sports.map((sport) => {
        const pressed = filters.sportId === sport.id;
        return (
          <FilterChip
            key={sport.id}
            pressed={pressed}
            onClick={() =>
              setSportId(filters.sportId === sport.id ? null : sport.id)
            }
            accent={pressed ? sportAccentColor[sport.id] : undefined}
          >
            <SportIcon
              sportId={sport.id}
              className="size-3"
              color={pressed ? "currentColor" : undefined}
            />
            {sport.name}
          </FilterChip>
        );
      })}
      <FilterChip
        pressed={filters.recentReportOnly}
        onClick={toggleRecentReportOnly}
        tone="live"
      >
        <ReportActivityIcon variant="recent" appearance="bare" />
        최근 방문
      </FilterChip>
    </>
  );

  return (
    <>
      {/* 모바일: 가로 스와이프 */}
      <HorizontalScroll
        className={cn("md:hidden", className)}
        contentClassName="gap-1.5"
        scrollRatio={0.55}
      >
        {chips}
      </HorizontalScroll>
      {/* PC: 줄바꿈으로 펼침 */}
      <div className={cn("hidden flex-wrap gap-1 md:flex", className)}>
        {chips}
      </div>
    </>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
  accent,
  tone,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  accent?: string;
  tone?: "live";
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={pressed && !accent && tone !== "live" ? "default" : "outline"}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs font-semibold",
        pressed &&
          tone === "live" &&
          "border-transparent bg-report text-report-foreground hover:bg-report/90",
        pressed && accent && "border-transparent text-white hover:opacity-90",
      )}
      style={
        pressed && accent
          ? { backgroundColor: accent, borderColor: accent }
          : undefined
      }
    >
      {children}
    </Button>
  );
}
