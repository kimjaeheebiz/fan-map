"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { MapHomeToolbar } from "@/features/places/components/map-home-toolbar";
import { PlaceList } from "@/features/places/components/place-list";
import { PlaceListSheet } from "@/features/places/components/place-list-sheet";
import { PlacePanel } from "@/features/places/components/place-panel";
import { PlaceMapOverlay } from "@/features/places/components/place-map-overlay";
import { ReportDialog } from "@/features/places/components/report-dialog";
import { MapControls } from "@/features/map/components/map-controls";
import type { MapViewHandle } from "@/features/map/components/map-view";
import { useGeolocation } from "@/features/map/hooks/use-geolocation";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import { usePlaces } from "@/features/places/hooks/use-places";
import { isPointInBounds, areAnyPlacesInBounds, type MapBounds } from "@/features/map/lib/map-bounds";
import {
  defaultPlaceFilters,
  filterPlaces,
  hasActivePlaceFilters,
} from "@/features/places/lib/place-filters";
import type { Place } from "@/features/places/types";
import { useMapShellReportAction } from "@/components/layout/map-shell";
import { EmptyState } from "@/components/common/empty-state";
import { Loading } from "@/components/common/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const MapView = dynamic(
  () =>
    import("@/features/map/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => <Skeleton className="size-full rounded-none" />,
  },
);

export function MapHome() {
  const mapRef = useRef<MapViewHandle>(null);
  const lastLocatedKeyRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  /** null이면 전체 표시, 값이 있으면 ‘이 지역 재검색’ 영역만 */
  const [regionBounds, setRegionBounds] = useState<MapBounds | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultPlaceFilters);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPlace, setReportPlace] = useState<Place | null>(null);
  const { data: allPlaces = [], isLoading: placesLoading } = usePlaces();
  const { favoritePlaceIds } = useFavoritePlaceIds();
  const { status: geoStatus, requestLocation, position, errorMessage } =
    useGeolocation();

  const regionPlaces = useMemo(() => {
    if (!regionBounds) return allPlaces;
    return allPlaces.filter((place) =>
      isPointInBounds(place.lat, place.lng, regionBounds),
    );
  }, [allPlaces, regionBounds]);

  const displayPlaces = useMemo(
    () =>
      filterPlaces(regionPlaces, {
        searchQuery,
        filters,
        favoritePlaceIds,
      }),
    [regionPlaces, searchQuery, filters, favoritePlaceIds],
  );

  const filtersActive = hasActivePlaceFilters(filters, searchQuery);

  const selectedPlace =
    displayPlaces.find((place) => place.id === selectedPlaceId) ??
    regionPlaces.find((place) => place.id === selectedPlaceId) ??
    allPlaces.find((place) => place.id === selectedPlaceId) ??
    null;

  useEffect(() => {
    if (geoStatus === "denied" || geoStatus === "unavailable") {
      toast.message(errorMessage ?? "현재 위치를 사용할 수 없습니다.");
    }
  }, [geoStatus, errorMessage]);

  useEffect(() => {
    if (geoStatus !== "ready" || !position) return;
    const key = `${position.lat},${position.lng}`;
    if (lastLocatedKeyRef.current === key) return;
    lastLocatedKeyRef.current = key;
    mapRef.current?.panTo(position.lat, position.lng, 15);
    toast.success("현재 위치로 이동했습니다.");
  }, [geoStatus, position]);

  useEffect(() => {
    if (!mapReady || !searchQuery.trim() || displayPlaces.length === 0) return;

    const bounds = mapRef.current?.getBounds();
    if (!bounds || areAnyPlacesInBounds(displayPlaces, bounds)) return;

    const place = displayPlaces[0];
    mapRef.current?.panTo(place.lat, place.lng);
  }, [searchQuery, mapReady, displayPlaces]);

  useEffect(() => {
    if (!mapReady || !hasActivePlaceFilters(filters, "")) return;
    if (searchQuery.trim()) return;

    const filtered = filterPlaces(regionPlaces, {
      searchQuery: "",
      filters,
      favoritePlaceIds,
    });
    if (filtered.length === 0) return;

    const bounds = mapRef.current?.getBounds();
    if (!bounds || areAnyPlacesInBounds(filtered, bounds)) return;

    const place = filtered[0];
    mapRef.current?.panTo(place.lat, place.lng);
  }, [filters, mapReady, regionPlaces, favoritePlaceIds, searchQuery]);

  useEffect(() => {
    if (!selectedPlaceId) return;
    if (!displayPlaces.some((place) => place.id === selectedPlaceId)) {
      clearSelection();
    }
  }, [displayPlaces, selectedPlaceId]);

  function handleSearchSubmit() {
    setSearchQuery(searchInput.trim());
  }

  function findPlaceById(placeId: string) {
    return (
      displayPlaces.find((place) => place.id === placeId) ??
      regionPlaces.find((place) => place.id === placeId) ??
      allPlaces.find((place) => place.id === placeId) ??
      null
    );
  }

  function handleSelectPlace(placeId: string, source: "map" | "list" = "map") {
    setSelectedPlaceId(placeId);
    if (source === "list") {
      const place = findPlaceById(placeId);
      if (place) {
        const bounds = mapRef.current?.getBounds();
        if (
          bounds &&
          !isPointInBounds(place.lat, place.lng, bounds)
        ) {
          mapRef.current?.panTo(place.lat, place.lng);
        }
      }
    }
  }

  function handleSelectPlaceFromList(placeId: string) {
    handleSelectPlace(placeId, "list");
  }

  function handleSelectPlaceFromMap(placeId: string) {
    handleSelectPlace(placeId, "map");
  }

  function clearSelection() {
    setSelectedPlaceId(null);
    setSheetHeight(0);
  }

  function handleResearch() {
    const bounds = mapRef.current?.getBounds();
    if (!bounds) {
      toast.message("지도가 준비되면 다시 시도해 주세요.");
      return;
    }

    const next = allPlaces.filter((place) =>
      isPointInBounds(place.lat, place.lng, bounds),
    );
    setRegionBounds(bounds);

    if (selectedPlaceId && !next.some((place) => place.id === selectedPlaceId)) {
      clearSelection();
    }

    if (next.length === 0) {
      toast.message("이 지역에 등록된 관람 장소가 없습니다.");
      return;
    }
    toast.success(`이 지역에서 ${next.length}곳을 찾았습니다.`);
  }

  function getEmptyState() {
    if (regionPlaces.length === 0) {
      return {
        title: "이 지역에 장소가 없습니다.",
        description: "지도를 이동한 뒤 ‘이 지역 재검색’을 눌러 보세요.",
      };
    }
    if (filters.favoritesOnly && favoritePlaceIds.length === 0) {
      return {
        title: "즐겨찾기한 장소가 없습니다.",
        description: "장소 상세에서 즐겨찾기를 추가하면 여기에 모입니다.",
      };
    }
    if (filtersActive) {
      return {
        title: "조건에 맞는 장소가 없습니다.",
        description: "검색어나 필터를 바꿔 보세요.",
      };
    }
    return {
      title: "이 지역에 장소가 없습니다.",
      description: "지도를 이동한 뒤 ‘이 지역 재검색’을 눌러 보세요.",
    };
  }

  function openReportDialog(place?: Place | null) {
    setReportPlace(place ?? null);
    setReportOpen(true);
  }

  useMapShellReportAction(() => openReportDialog());

  function handleReportSubmitted(place: Place) {
    // 제보한 장소가 보이도록 영역 필터를 해제하고 해당 위치로 이동
    setRegionBounds(null);
    setSelectedPlaceId(place.id);
    mapRef.current?.panTo(place.lat, place.lng);
  }

  const emptyState = getEmptyState();
  const placeCountLabel = `${displayPlaces.length}곳 표시${
    regionPlaces.length !== displayPlaces.length
      ? ` · ${regionPlaces.length}곳 중`
      : ""
  }`;

  if (placesLoading) {
    return <Loading label="장소 불러오는 중..." className="h-full" />;
  }

  return (
    <div className="flex h-full w-full">
      <aside className="border-border bg-card hidden w-80 shrink-0 flex-col border-r md:flex lg:w-96">
        <div className="space-y-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium">주변 관람 장소</p>
            <p className="text-muted-foreground text-xs">{placeCountLabel}</p>
          </div>
          <MapHomeToolbar
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
        <Separator />
        <ScrollArea className="bg-canvas min-h-0 flex-1">
          {displayPlaces.length === 0 ? (
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
              className="m-4 py-10"
            />
          ) : (
            <PlaceList
              places={displayPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlaceFromList}
            />
          )}
        </ScrollArea>
      </aside>

      <div className="relative min-w-0 flex-1">
        <MapView
          ref={mapRef}
          places={displayPlaces}
          selectedPlaceId={selectedPlaceId}
          favoritePlaceIds={favoritePlaceIds}
          onSelectPlace={handleSelectPlaceFromMap}
          onMapReady={() => setMapReady(true)}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2 md:hidden">
          <div className="bg-card/95 pointer-events-auto space-y-2 rounded-lg border p-3 shadow-sm backdrop-blur-sm">
            <MapHomeToolbar
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>
        <MapControls
          onLocate={requestLocation}
          onResearch={handleResearch}
          locateLoading={geoStatus === "loading"}
          researchDisabled={!mapReady}
          sheetBottomOffset={sheetHeight > 0 ? sheetHeight : undefined}
        />

        {selectedPlace ? (
          <div className="pointer-events-none absolute inset-y-3 left-3 z-20 hidden w-80 md:block lg:w-96">
            <div className="pointer-events-auto h-full min-h-0">
              <PlacePanel
                key={selectedPlace.id}
                place={selectedPlace}
                onClose={clearSelection}
                onReport={() => openReportDialog(selectedPlace)}
                variant="sidebar"
              />
            </div>
          </div>
        ) : null}

        {!selectedPlace ? (
          <PlaceMapOverlay className="md:hidden">
            <PlaceListSheet
              places={displayPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlaceFromList}
              emptyTitle={emptyState.title}
              emptyDescription={emptyState.description}
              placeCountLabel={placeCountLabel}
              onHeightChange={setSheetHeight}
            />
          </PlaceMapOverlay>
        ) : (
          <PlaceMapOverlay className="md:hidden">
            <PlacePanel
              key={selectedPlace.id}
              place={selectedPlace}
              onClose={clearSelection}
              onReport={() => openReportDialog(selectedPlace)}
              variant="sheet"
              onHeightChange={setSheetHeight}
            />
          </PlaceMapOverlay>
        )}

        <ReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          initialPlace={reportPlace}
          onSubmitted={handleReportSubmitted}
        />
      </div>
    </div>
  );
}
