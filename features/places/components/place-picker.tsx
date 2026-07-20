"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { SearchBox } from "@/components/common/search-box";
import { EmptyState } from "@/components/common/empty-state";
import {
  formatPlaceAddress,
  searchLocalPlaces,
} from "@/features/places/lib/naver-local-search";
import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";
import { cn } from "@/lib/utils";

type PlacePickerProps = {
  onSelect: (result: PlaceSearchResult) => void;
  className?: string;
};

export function PlacePicker({ onSelect, className }: PlacePickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("상호명을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const items = await searchLocalPlaces(trimmed);
      setResults(items);
      if (items.length === 0) {
        setError("검색 결과가 없습니다. 다른 키워드로 시도해 보세요.");
      }
    } catch (searchError) {
      setResults([]);
      setError(
        searchError instanceof Error
          ? searchError.message
          : "장소 검색에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium">상호명 검색</p>
        <p className="text-muted-foreground text-xs">
          네이버 검색 결과에서 장소를 선택해 주세요. 상호명과 함께 지역명을
          입력하면 더 정확합니다. (예: 잠실 치킨)
        </p>
        <SearchBox
          value={query}
          onChange={setQuery}
          onSubmit={() => void handleSearch()}
          placeholder="상호명 · 지역 검색"
          className="max-w-none"
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
          <Loader2 className="size-4 animate-spin" />
          검색 중…
        </div>
      )}

      {searched && !loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">
            검색 결과 {results.length}건
          </p>
          <ul className="divide-border max-h-64 divide-y overflow-y-auto rounded-lg border">
            {results.map((result) => (
              <li key={result.naverPlaceId}>
                <button
                  type="button"
                  className="hover:bg-muted/50 flex w-full items-start gap-3 px-3 py-3 text-left transition-colors"
                  onClick={() => onSelect(result)}
                >
                  <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{result.name}</span>
                    <span className="text-muted-foreground mt-0.5 block text-xs">
                      {formatPlaceAddress(result)}
                    </span>
                    {result.categoryName && (
                      <span className="text-muted-foreground mt-1 block text-xs">
                        {result.categoryName}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searched && !loading && (
        <EmptyState
          title="장소를 검색해 주세요"
          description="상호명을 입력한 뒤 Enter로 검색합니다."
          className="py-8"
        />
      )}
    </div>
  );
}
