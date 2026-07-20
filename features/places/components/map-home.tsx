"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { mockPlaces } from "@/features/places/data/mock-places";
import { PlaceList } from "@/features/places/components/place-list";
import { PlaceDetail } from "@/features/places/components/place-detail";
import { PlaceSummary } from "@/features/places/components/place-summary";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export function MapHome() {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const selectedPlace =
    mockPlaces.find((place) => place.id === selectedPlaceId) ?? null;

  function handleSelectPlace(placeId: string) {
    setSelectedPlaceId(placeId);
    if (isMobileViewport()) {
      setMobileDetailOpen(true);
    }
  }

  function clearSelection() {
    setSelectedPlaceId(null);
    setMobileDetailOpen(false);
  }

  return (
    <div className="flex h-full w-full">
      <aside className="border-border bg-card hidden w-80 shrink-0 flex-col border-r md:flex lg:w-96">
        <div className="px-4 py-3">
          <p className="text-sm font-medium">주변 관람 장소</p>
          <p className="text-muted-foreground text-xs">
            Mock {mockPlaces.length}곳 · 잠실·고척 일대
          </p>
        </div>
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <PlaceList
            places={mockPlaces}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={handleSelectPlace}
          />
        </ScrollArea>
        {selectedPlace && (
          <>
            <Separator />
            <div className="hidden max-h-[50%] min-h-0 md:block">
              <PlaceDetail place={selectedPlace} onClose={clearSelection} />
            </div>
          </>
        )}
      </aside>

      <div className="relative min-w-0 flex-1">
        <MapView
          places={mockPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
        />

        {selectedPlace && (
          <div className="absolute inset-x-0 bottom-0 z-10 p-2 md:hidden">
            <PlaceSummary
              place={selectedPlace}
              onOpenDetail={() => setMobileDetailOpen(true)}
            />
          </div>
        )}
      </div>

      <Drawer
        open={mobileDetailOpen && !!selectedPlace}
        onOpenChange={(open) => {
          setMobileDetailOpen(open);
          if (!open) setSelectedPlaceId(null);
        }}
        showSwipeHandle
      >
        <DrawerContent className="h-[85dvh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{selectedPlace?.name ?? "장소 상세"}</DrawerTitle>
            <DrawerDescription>관람 장소 상세 정보</DrawerDescription>
          </DrawerHeader>
          {selectedPlace && (
            <PlaceDetail place={selectedPlace} onClose={clearSelection} />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
