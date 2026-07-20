"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "@/features/map/lib/load-kakao-sdk";
import type { KakaoMap, KakaoMarker } from "@/features/map/types/kakao";
import type { Place } from "@/features/places/types";
import { DEFAULT_MAP_CENTER } from "@/features/places/data/mock-places";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type MapViewProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  className?: string;
};

export function MapView({
  places,
  selectedPlaceId,
  onSelectPlace,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<Map<string, KakaoMarker>>(new Map());
  const onSelectRef = useRef(onSelectPlace);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelectPlace;
  }, [onSelectPlace]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadKakaoMapsSdk();
        if (cancelled || !containerRef.current || !window.kakao?.maps) return;

        const { maps } = window.kakao;
        const center = new maps.LatLng(
          DEFAULT_MAP_CENTER.lat,
          DEFAULT_MAP_CENTER.lng,
        );
        const map = new maps.Map(containerRef.current, {
          center,
          level: DEFAULT_MAP_CENTER.level,
        });
        mapRef.current = map;
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "지도를 불러오지 못했습니다.",
        );
      }
    }

    void init();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.kakao?.maps) return;

    const { maps } = window.kakao;
    const map = mapRef.current;
    const nextIds = new Set(places.map((p) => p.id));

    markersRef.current.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    for (const place of places) {
      const position = new maps.LatLng(place.lat, place.lng);
      let marker = markersRef.current.get(place.id);

      if (!marker) {
        marker = new maps.Marker({
          map,
          position,
          title: place.name,
        });
        maps.event.addListener(marker, "click", () => {
          onSelectRef.current(place.id);
        });
        markersRef.current.set(place.id, marker);
      } else {
        marker.setPosition(position);
        marker.setMap(map);
      }

      marker.setZIndex(place.id === selectedPlaceId ? 10 : 1);
    }
  }, [places, selectedPlaceId, status]);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.kakao?.maps) return;
    if (!selectedPlaceId) return;

    const place = places.find((p) => p.id === selectedPlaceId);
    if (!place) return;

    const { maps } = window.kakao;
    mapRef.current.setCenter(new maps.LatLng(place.lat, place.lng));
  }, [selectedPlaceId, places, status]);

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
}
