"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  getCoverImageUrl,
  getPlaceSportIds,
  getReportCount,
} from "@/features/places/lib/place-helpers";
import { getSportName } from "@/features/catalog/constants";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import type { Place } from "@/features/places/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlaceListProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
};

/** 장소 목록 — 카드형 */
export function PlaceList({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlaceListProps) {
  const { isFavorite, toggleFavorite } = useFavoritePlaceIds();

  return (
    <div className="flex flex-col gap-2 p-3">
      {places.map((place) => {
        const cover = getCoverImageUrl(place);
        const sports = getPlaceSportIds(place).map(getSportName).join(" · ");
        const selected = place.id === selectedPlaceId;
        const favorited = isFavorite(place.id);

        return (
          <Card
            key={place.id}
            size="sm"
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={() => onSelectPlace(place.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectPlace(place.id);
              }
            }}
            className={cn(
              "cursor-pointer gap-0 py-0 shadow-xs ring-0 transition-[box-shadow]",
              selected
                ? "relative shadow-md before:bg-primary before:absolute before:inset-y-5 before:left-1 before:w-0.75 before:rounded-full"
                : "hover:shadow-md",
            )}
          >
            <CardHeader className="relative flex flex-row items-start gap-3 py-3">
              <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-md">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <CardTitle className="truncate text-sm">{place.name}</CardTitle>
                <CardDescription className="truncate text-xs">
                  {place.address}
                </CardDescription>
                <CardDescription className="mt-1 text-xs">
                  제보 {getReportCount(place)}
                  {sports ? ` · ${sports}` : ""}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                aria-pressed={favorited}
                className="absolute top-2 right-2"
                onClick={(event) => {
                  event.stopPropagation();
                  const next = toggleFavorite(place.id);
                  toast.success(
                    next
                      ? "즐겨찾기에 추가했습니다."
                      : "즐겨찾기를 해제했습니다.",
                  );
                }}
              >
                <Star
                  className={cn(
                    "size-4",
                    favorited
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/35",
                  )}
                />
              </Button>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
