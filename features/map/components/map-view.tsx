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

    function rememberViewState(map: NaverMap) {
      const center = map.getCenter();
      viewStateRef.current = {
        lat: center.lat(),
        lng: center.lng(),
        zoom: map.getZoom(),
      };
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
          mapRef.current = map;
          maps.Event.addListener(map, "idle", () => {
            if (mapRef.current) rememberViewState(mapRef.current);
          });
          setStatus("ready");
          onMapReadyRef.current?.();
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

      setStatus((current) => (current === "ready" ? current : "loading"));
      void init();

      return () => {
        cancelled = true;
        if (mapRef.current) rememberViewState(mapRef.current);
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current.clear();
        mapRef.current?.destroy?.();
        mapRef.current = null;
      };
    }, [mapScheme, themeReady]);

    useEffect(() => {
      if (status !== "ready" || !mapRef.current || !window.naver?.maps) return;

      const { maps } = window.naver;
      const map = mapRef.current;
      const nextIds = new Set(places.map((p) => p.id));
      const favoriteSet = new Set(favoritePlaceIds);

      markersRef.current.forEach((marker, id) => {
        if (!nextIds.has(id)) {
          marker.setMap(null);
          markersRef.current.delete(id);
        }
      });

      for (const place of places) {
        const position = new maps.LatLng(place.lat, place.lng);
        const selected = place.id === selectedPlaceId;
        const favorite = favoriteSet.has(place.id);
        const icon = createPlaceMarkerIcon(maps, place.id, {
          favorite,
          sportId: getDisplaySportId(place, filterSportId),
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

      syncMarkerSelection(containerRef.current, selectedPlaceId);
      syncMarkerFavorites(containerRef.current, favoritePlaceIds);
    }, [places, selectedPlaceId, favoritePlaceIds, filterSportId, status]);

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
