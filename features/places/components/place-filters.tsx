"use client";

import type { ReactNode } from "react";
import { sports } from "@/features/catalog/constants";
import type { SportId } from "@/features/catalog/types";
import type { PlaceFilterState } from "@/features/places/lib/place-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlaceFiltersProps = {
  filters: PlaceFilterState;
  onChange: (filters: PlaceFilterState) => void;
  className?: string;
};

export function PlaceFilters({ filters, onChange, className }: PlaceFiltersProps) {
  function setSportId(sportId: SportId | null) {
    onChange({ ...filters, sportId });
  }

  function toggleRecentReportOnly() {
    onChange({ ...filters, recentReportOnly: !filters.recentReportOnly });
  }

  function toggleFavoritesOnly() {
    onChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  }

  return (
    <div
      className={cn("flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
      role="group"
      aria-label="장소 필터"
    >
      <FilterChip
        pressed={filters.sportId === null}
        onClick={() => setSportId(null)}
      >
        전체
      </FilterChip>
      {sports.map((sport) => (
        <FilterChip
          key={sport.id}
          pressed={filters.sportId === sport.id}
          onClick={() =>
            setSportId(filters.sportId === sport.id ? null : sport.id)
          }
        >
          {sport.name}
        </FilterChip>
      ))}
      <FilterChip pressed={filters.recentReportOnly} onClick={toggleRecentReportOnly}>
        최근 제보
      </FilterChip>
      <FilterChip pressed={filters.favoritesOnly} onClick={toggleFavoritesOnly}>
        즐겨찾기
      </FilterChip>
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={pressed ? "default" : "outline"}
      aria-pressed={pressed}
      onClick={onClick}
      className="shrink-0 rounded-full"
    >
      {children}
    </Button>
  );
}
