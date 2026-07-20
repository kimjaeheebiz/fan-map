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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PlaceListProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
};

export function PlaceList({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlaceListProps) {
  const { isFavorite, toggleFavorite } = useFavoritePlaceIds();

  return (
    <div className="flex flex-col">
      {places.map((place, index) => {
        const cover = getCoverImageUrl(place);
        const sports = getPlaceSportIds(place)
          .map(getSportName)
          .join(" · ");
        const selected = place.id === selectedPlaceId;
        const favorited = isFavorite(place.id);

        return (
          <div key={place.id}>
            {index > 0 && <Separator />}
            <div
              className={cn(
                "hover:bg-muted/60 flex w-full items-stretch gap-1 px-2 py-1",
                selected && "bg-muted",
              )}
            >
              <Button
                type="button"
                variant="ghost"
                aria-pressed={selected}
                onClick={() => onSelectPlace(place.id)}
                className="h-auto min-w-0 flex-1 justify-start gap-3 rounded-md px-2 py-2 text-left whitespace-normal"
              >
                <div className="bg-muted size-14 shrink-0 overflow-hidden rounded-md">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate">{place.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {place.address}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    제보 {getReportCount(place)}
                    {sports ? ` · ${sports}` : ""}
                  </p>
                </div>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                aria-pressed={favorited}
                className="mt-2 shrink-0 self-start"
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
