"use client";

import { getCoverImageUrl, getPlaceSportIds, getReportCount } from "@/features/places/lib/place-helpers";
import { getSportName } from "@/features/catalog/constants";
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
  return (
    <div className="flex flex-col">
      {places.map((place, index) => {
        const cover = getCoverImageUrl(place);
        const sports = getPlaceSportIds(place)
          .map(getSportName)
          .join(" · ");
        const selected = place.id === selectedPlaceId;

        return (
          <div key={place.id}>
            {index > 0 && <Separator />}
            <Button
              type="button"
              variant="ghost"
              aria-pressed={selected}
              onClick={() => onSelectPlace(place.id)}
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-none px-4 py-3 text-left whitespace-normal",
                selected && "bg-muted",
              )}
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
          </div>
        );
      })}
    </div>
  );
}
