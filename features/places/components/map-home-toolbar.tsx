"use client";

import { SearchBox } from "@/components/common/search-box";
import { PlaceFilters } from "@/features/places/components/place-filters";
import type { PlaceFilterState } from "@/features/places/lib/place-filters";
import { cn } from "@/lib/utils";

type MapHomeToolbarProps = {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  filters: PlaceFilterState;
  onFiltersChange: (filters: PlaceFilterState) => void;
  className?: string;
};

export function MapHomeToolbar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  filters,
  onFiltersChange,
  className,
}: MapHomeToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <SearchBox
        value={searchInput}
        onChange={onSearchInputChange}
        onSubmit={onSearchSubmit}
        placeholder="장소명·지역 검색"
        className="max-w-none"
      />
      <PlaceFilters filters={filters} onChange={onFiltersChange} />
    </div>
  );
}
