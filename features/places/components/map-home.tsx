"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
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
import type { Place, ViewingReport } from "@/features/places/types";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isReady } = useAuth();
  const mapRef = useRef<MapViewHandle>(null);
  const lastLocatedKeyRef = useRef<string | null>(null);
  const locateIntentRef = useRef<"idle" | "auto" | "manual">("idle");
  const initialRegionSyncedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  /** null이면 아직 지도 영역 미적용(목록 비움), 값이 있으면 해당 영역만 */
  const [regionBounds, setRegionBounds] = useState<MapBounds | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultPlaceFilters);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPlace, setReportPlace] = useState<Place | null>(null);
  const [editingReport, setEditingReport] = useState<ViewingReport | null>(
    null,
  );
  /** 등록 직후 캐시/목록 반영 전에도 상세를 열기 위한 임시 장소 */
  const [pendingSelectPlace, setPendingSelectPlace] = useState<Place | null>(
    null,
  );
  const { data: allPlaces = [], isLoading: placesLoading } = usePlaces();
  const { favoritePlaceIds } = useFavoritePlaceIds();
  const { status: geoStatus, requestLocation, position, errorMessage } =
    useGeolocation();

  const regionPlaces = useMemo(() => {
    if (!regionBounds) return [];
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
    (pendingSelectPlace?.id === selectedPlaceId
      ? pendingSelectPlace
      : null) ??
    displayPlaces.find((place) => place.id === selectedPlaceId) ??
    regionPlaces.find((place) => place.id === selectedPlaceId) ??
    allPlaces.find((place) => place.id === selectedPlaceId) ??
    null;

  useEffect(() => {
    if (!pendingSelectPlace) return;
    if (displayPlaces.some((place) => place.id === pendingSelectPlace.id)) {
      setPendingSelectPlace(null);
    }
  }, [displayPlaces, pendingSelectPlace]);

  useEffect(() => {
    if (geoStatus === "denied" || geoStatus === "unavailable") {
      toast.message(errorMessage ?? "현재 위치를 사용할 수 없습니다.");
      locateIntentRef.current = "idle";
    }
  }, [geoStatus, errorMessage]);

  /** 최초 진입: 지도 준비 후 현재 위치 요청 (실패 시 잠실 기본 중심 유지) */
  useEffect(() => {
    if (!mapReady || locateIntentRef.current !== "idle") return;
    if (geoStatus !== "idle") return;
    locateIntentRef.current = "auto";
    requestLocation();
  }, [mapReady, geoStatus, requestLocation]);

  function syncListToMapBounds() {
    const bounds = mapRef.current?.getBounds();
    if (!bounds) return null;

    const next = allPlaces.filter((place) =>
      isPointInBounds(place.lat, place.lng, bounds),
    );
    setRegionBounds(bounds);
    if (
      selectedPlaceId &&
      !next.some((place) => place.id === selectedPlaceId)
    ) {
      clearSelection();
    }
    return next;
  }

  useEffect(() => {
    if (geoStatus !== "ready" || !position) return;
    const key = `${position.lat},${position.lng}`;
    const intent = locateIntentRef.current;
    if (intent !== "manual" && lastLocatedKeyRef.current === key) {
      locateIntentRef.current = "idle";
      if (!initialRegionSyncedRef.current) {
        initialRegionSyncedRef.current = true;
        syncListToMapBounds();
      }
      return;
    }
    lastLocatedKeyRef.current = key;
    mapRef.current?.panTo(position.lat, position.lng, 15);
    if (intent === "manual") {
      toast.success("현재 위치로 이동했습니다.");
    }
    locateIntentRef.current = "idle";
    initialRegionSyncedRef.current = true;
    syncListToMapBounds();
    // syncListToMapBounds는 렌더마다 갱신 — 위치 확정 시점에만 호출
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [geoStatus, position, allPlaces]);

  /** 위치 사용 불가 시: 현재(기본) 지도 영역으로 목록 동기화 */
  useEffect(() => {
    if (!mapReady || initialRegionSyncedRef.current) return;
    if (geoStatus !== "denied" && geoStatus !== "unavailable") return;
    initialRegionSyncedRef.current = true;
    syncListToMapBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [mapReady, geoStatus, allPlaces]);

  function handleLocate() {
    locateIntentRef.current = "manual";
    lastLocatedKeyRef.current = null;
    requestLocation();
  }

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
    if (pendingSelectPlace?.id === selectedPlaceId) return;
    if (!displayPlaces.some((place) => place.id === selectedPlaceId)) {
      clearSelection();
    }
  }, [displayPlaces, selectedPlaceId, pendingSelectPlace]);

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
    setPendingSelectPlace(null);
    setSheetHeight(0);
  }

  function handleResearch() {
    const next = syncListToMapBounds();
    if (!next) {
      toast.message("지도가 준비되면 다시 시도해 주세요.");
      return;
    }

    if (next.length === 0) {
      toast.message("이 지역에 등록된 장소가 없습니다.");
      return;
    }
    toast.success(`이 지역에서 ${next.length}곳을 찾았습니다.`);
  }

  function getEmptyState() {
    if (!regionBounds) {
      return {
        title: "지도 위치를 확인하는 중…",
        description: "현재 위치 기준으로 주변 장소를 불러옵니다.",
      };
    }
    if (regionPlaces.length === 0) {
      return {
        title: "이 지역에 장소가 없습니다.",
        description: "지도를 이동한 뒤 ‘이 지역 재검색’을 눌러 보세요.",
      };
    }
    if (filters.favoritesOnly && favoritePlaceIds.length === 0) {
      return {
        title: "즐겨찾기한 장소가 없습니다.",
        description: isAuthenticated
          ? "장소 상세에서 즐겨찾기를 추가하면 여기에 모입니다."
          : "로그인 후 즐겨찾기를 이용할 수 있습니다.",
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
    if (!isReady) return;
    if (!isAuthenticated) {
      toast.message("방문 경험은 로그인 후 이용할 수 있습니다.");
      const returnUrl = pathname || "/";
      router.push(
        `${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }
    setEditingReport(null);
    setReportPlace(place ?? null);
    setReportOpen(true);
  }

  function openEditReportDialog(place: Place, report: ViewingReport) {
    if (!isReady) return;
    if (!isAuthenticated) {
      toast.message("수정은 로그인 후 이용할 수 있습니다.");
      const returnUrl = pathname || "/";
      router.push(
        `${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }
    setEditingReport(report);
    setReportPlace(place);
    setReportOpen(true);
  }

  useMapShellReportAction(() => openReportDialog());

  useEffect(() => {
    if (searchParams.get("report") !== "1") return;
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(
        `${authNav.login}?returnUrl=${encodeURIComponent("/?report=1")}`,
      );
      return;
    }
    // effect 내 동기 setState(다이얼로그 open) 방지
    const frame = requestAnimationFrame(() => {
      openReportDialog();
      router.replace("/", { scroll: false });
    });
    return () => cancelAnimationFrame(frame);
    // openReportDialog는 렌더마다 갱신 — 쿼리 진입 시에만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [searchParams, router, isReady, isAuthenticated]);

  function handleReportSubmitted(place: Place) {
    setPendingSelectPlace(place);
    setSelectedPlaceId(place.id);
    mapRef.current?.panTo(place.lat, place.lng);

    // pan 직후 getBounds는 아직 옛 영역일 수 있어, 제출 장소가 포함되도록 맞춤
    const bounds = mapRef.current?.getBounds();
    if (bounds) {
      setRegionBounds({
        minLat: Math.min(bounds.minLat, place.lat),
        maxLat: Math.max(bounds.maxLat, place.lat),
        minLng: Math.min(bounds.minLng, place.lng),
        maxLng: Math.max(bounds.maxLng, place.lng),
      });
    } else {
      const pad = 0.02;
      setRegionBounds({
        minLat: place.lat - pad,
        maxLat: place.lat + pad,
        minLng: place.lng - pad,
        maxLng: place.lng + pad,
      });
    }
  }

  const emptyState = getEmptyState();
  const placeCountLabel = `${displayPlaces.length}곳${
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
            <p className="text-base font-bold tracking-tight">
              오늘 어디서 응원할까?
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              주변 장소 {placeCountLabel}
            </p>
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
          filterSportId={filters.sportId}
          onSelectPlace={handleSelectPlaceFromMap}
          onMapReady={() => setMapReady(true)}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2 md:hidden">
          <div className="bg-card/95 pointer-events-auto rounded-lg border p-3 shadow-sm backdrop-blur-sm">
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
          onLocate={handleLocate}
          onResearch={handleResearch}
          locateLoading={geoStatus === "loading"}
          researchDisabled={!mapReady}
          sheetBottomOffset={sheetHeight > 0 ? sheetHeight : undefined}
        />

        {selectedPlace ? (
          <div className="pointer-events-none absolute inset-y-3 left-3 z-20 hidden w-[26rem] md:block lg:w-[30rem]">
            <div className="pointer-events-auto h-full min-h-0">
              <PlacePanel
                key={selectedPlace.id}
                place={selectedPlace}
                onClose={clearSelection}
                onReport={() => openReportDialog(selectedPlace)}
                onEditReport={(report) =>
                  openEditReportDialog(selectedPlace, report)
                }
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
              onEditReport={(report) =>
                openEditReportDialog(selectedPlace, report)
              }
              variant="sheet"
              onHeightChange={setSheetHeight}
            />
          </PlaceMapOverlay>
        )}

        <ReportDialog
          open={reportOpen}
          onOpenChange={(open) => {
            setReportOpen(open);
            if (!open) setEditingReport(null);
          }}
          initialPlace={reportPlace}
          editReport={editingReport}
          onSubmitted={handleReportSubmitted}
        />
      </div>
    </div>
  );
}
