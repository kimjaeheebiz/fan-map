"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import { NAVER_MAP_DARK_STYLE_ID } from "@/features/map/constants";
import { loadNaverMapsSdk } from "@/features/map/lib/load-naver-sdk";
import {
  createPlaceMarkerIcon,
  syncMarkerFavorites,
  syncMarkerSelection,
} from "@/features/map/lib/marker-icon";
import type { MapBounds } from "@/features/map/lib/map-bounds";
import type { NaverMap, NaverMarker } from "@/features/map/types/naver";
import type { Place } from "@/features/places/types";
import type { SportId } from "@/features/catalog/types";
import {
  getDisplaySportId,
  getPlaceSportsRanked,
  getReportCount,
} from "@/features/places/lib/place-helpers";
import { DEFAULT_MAP_CENTER } from "@/features/places/data/mock-places";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type MapViewHandle = {
  panTo: (lat: number, lng: number, zoom?: number) => void;
  getBounds: () => MapBounds | null;
};

type MapViewProps = {
  places: Place[];
  selectedPlaceId: string | null;
  favoritePlaceIds?: string[];
  /** 활성 종목 필터 — 핀 아이콘에 반영 */
  filterSportId?: SportId | null;
  onSelectPlace: (placeId: string, source: "map") => void;
  onMapReady?: () => void;
  className?: string;
};

export const MapView = forwardRef<MapViewHandle, MapViewProps>(
  function MapView(
    {
      places,
      selectedPlaceId,
      favoritePlaceIds = [],
      filterSportId = null,
      onSelectPlace,
      onMapReady,
      className,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<NaverMap | null>(null);
    const markersRef = useRef<Map<string, NaverMarker>>(new Map());
    const onSelectRef = useRef(onSelectPlace);
    const onMapReadyRef = useRef(onMapReady);
    const placesRef = useRef(places);
    const selectedPlaceIdRef = useRef(selectedPlaceId);
    const favoritePlaceIdsRef = useRef(favoritePlaceIds);
    const filterSportIdRef = useRef(filterSportId);
    const viewStateRef = useRef<{ lat: number; lng: number; zoom: number }>({
      lat: DEFAULT_MAP_CENTER.lat,
      lng: DEFAULT_MAP_CENTER.lng,
      zoom: DEFAULT_MAP_CENTER.zoom,
    });
    const { resolvedTheme } = useTheme();
    const [themeReady, setThemeReady] = useState(false);
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
      "loading",
    );
    /** 지도 인스턴스가 바뀔 때마다 증가 — 테마 전환 후 마커 재동기화용 */
    const [mapEpoch, setMapEpoch] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mapScheme =
      themeReady && resolvedTheme === "dark" ? "dark" : "light";

    useEffect(() => {
      setThemeReady(true);
    }, []);

    useEffect(() => {
      onSelectRef.current = onSelectPlace;
    }, [onSelectPlace]);

    useEffect(() => {
      onMapReadyRef.current = onMapReady;
    }, [onMapReady]);

    useEffect(() => {
      placesRef.current = places;
    }, [places]);

    useEffect(() => {
      selectedPlaceIdRef.current = selectedPlaceId;
    }, [selectedPlaceId]);

    useEffect(() => {
      favoritePlaceIdsRef.current = favoritePlaceIds;
    }, [favoritePlaceIds]);

    useEffect(() => {
      filterSportIdRef.current = filterSportId;
    }, [filterSportId]);

    function rememberViewState(map: NaverMap) {
      const center = map.getCenter();
      viewStateRef.current = {
        lat: center.lat(),
        lng: center.lng(),
        zoom: map.getZoom(),
      };
    }

    function syncMarkersToMap() {
      if (!mapRef.current || !window.naver?.maps || !containerRef.current) {
        return;
      }

      const { maps } = window.naver;
      const map = mapRef.current;
      const nextPlaces = placesRef.current;
      const nextSelectedId = selectedPlaceIdRef.current;
      const nextFavoriteIds = favoritePlaceIdsRef.current;
      const nextFilterSportId = filterSportIdRef.current;
      const nextIds = new Set(nextPlaces.map((p) => p.id));
      const favoriteSet = new Set(nextFavoriteIds);

      markersRef.current.forEach((marker, id) => {
        if (!nextIds.has(id)) {
          marker.setMap(null);
          markersRef.current.delete(id);
        }
      });

      for (const place of nextPlaces) {
        const position = new maps.LatLng(place.lat, place.lng);
        const selected = place.id === nextSelectedId;
        const favorite = favoriteSet.has(place.id);
        const icon = createPlaceMarkerIcon(maps, place.id, {
          favorite,
          sportId: getDisplaySportId(place, nextFilterSportId),
          reportCount: getReportCount(place),
          multiSport: getPlaceSportsRanked(place).length > 1,
        });
        let marker = markersRef.current.get(place.id);

        if (!marker) {
          marker = new maps.Marker({
            map,
            position,
            title: place.name,
            icon,
            zIndex: selected ? 10 : favorite ? 5 : 1,
          });
          maps.Event.addListener(marker, "click", () => {
            onSelectRef.current(place.id, "map");
          });
          markersRef.current.set(place.id, marker);
        } else {
          marker.setPosition(position);
          marker.setMap(map);
          marker.setIcon(icon);
          marker.setZIndex(selected ? 10 : favorite ? 5 : 1);
        }
      }

      syncMarkerSelection(containerRef.current, nextSelectedId);
      syncMarkerFavorites(containerRef.current, nextFavoriteIds);
    }

    useImperativeHandle(ref, () => ({
      panTo(lat, lng, zoom) {
        if (!mapRef.current || !window.naver?.maps) return;
        const { maps } = window.naver;
        mapRef.current.setCenter(new maps.LatLng(lat, lng));
        if (typeof zoom === "number") {
          mapRef.current.setZoom(zoom);
        }
        rememberViewState(mapRef.current);
      },
      getBounds() {
        if (!mapRef.current) return null;
        const bounds = mapRef.current.getBounds();
        const sw = bounds.getSW();
        const ne = bounds.getNE();
        return {
          minLat: sw.lat(),
          minLng: sw.lng(),
          maxLat: ne.lat(),
          maxLng: ne.lng(),
        };
      },
    }));

    useEffect(() => {
      if (!themeReady) return;

      let cancelled = false;
      let idleListener: unknown = null;

      async function init() {
        try {
          await loadNaverMapsSdk();
          if (cancelled || !containerRef.current || !window.naver?.maps) return;

          const { maps } = window.naver;
          const { lat, lng, zoom } = viewStateRef.current;

          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current.clear();
          mapRef.current?.destroy?.();
          mapRef.current = null;

          const map = new maps.Map(containerRef.current, {
            center: new maps.LatLng(lat, lng),
            zoom,
            gl: true,
            ...(mapScheme === "dark"
              ? { customStyleId: NAVER_MAP_DARK_STYLE_ID }
              : {}),
          });

          if (cancelled) {
            map.destroy?.();
            return;
          }

          mapRef.current = map;

          let becameReady = false;
          const markReady = () => {
            if (cancelled || becameReady || mapRef.current !== map) return;
            becameReady = true;
            setStatus("ready");
            setMapEpoch((epoch) => epoch + 1);
            // idle/timeout 직후 동기화 — effect 타이밍과 무관하게 마커 부착
            syncMarkersToMap();
            onMapReadyRef.current?.();
          };

          idleListener = maps.Event.addListener(map, "idle", () => {
            if (mapRef.current) rememberViewState(mapRef.current);
            markReady();
          });

          if (cancelled) {
            if (idleListener) {
              maps.Event.removeListener(idleListener);
            }
            map.destroy?.();
            mapRef.current = null;
            return;
          }

          // idle이 늦거나 안 오는 환경 대비
          window.setTimeout(markReady, 0);
        } catch (error) {
          if (cancelled) return;
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "지도를 불러오지 못했습니다.",
          );
        }
      }

      setStatus("loading");
      void init();

      return () => {
        cancelled = true;
        if (mapRef.current) rememberViewState(mapRef.current);
        if (idleListener && window.naver?.maps) {
          window.naver.maps.Event.removeListener(idleListener);
        }
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current.clear();
        mapRef.current?.destroy?.();
        mapRef.current = null;
      };
    }, [mapScheme, themeReady]);

    useEffect(() => {
      if (status !== "ready" || mapEpoch === 0) return;
      syncMarkersToMap();
    }, [
      places,
      selectedPlaceId,
      favoritePlaceIds,
      filterSportId,
      status,
      mapEpoch,
    ]);

    return (
      <div className={cn("relative h-full w-full", className)}>
        <div ref={containerRef} className="h-full w-full" />
        {status === "loading" && (
          <Skeleton className="absolute inset-0 rounded-none" />
        )}
        {status === "error" && (
          <div className="bg-background absolute inset-0 flex items-center justify-center p-6">
            <EmptyState
              title="지도를 표시할 수 없습니다."
              description={errorMessage ?? undefined}
              className="border-0"
            />
          </div>
        )}
      </div>
    );
  },
);
