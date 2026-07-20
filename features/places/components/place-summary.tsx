"use client";

import { getCoverImageUrl, getReportCount } from "@/features/places/lib/place-helpers";
import type { Place } from "@/features/places/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlaceSummaryProps = {
  place: Place;
  onOpenDetail: () => void;
};

export function PlaceSummary({ place, onOpenDetail }: PlaceSummaryProps) {
  const cover = getCoverImageUrl(place);

  return (
    <Card
      size="sm"
      className="rounded-b-none rounded-t-2xl shadow-lg ring-border/20"
    >
      <CardHeader className="flex-row items-start gap-3">
        <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-md">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="size-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">{place.name}</CardTitle>
          <CardDescription className="truncate">{place.address}</CardDescription>
          <CardDescription className="mt-1">
            관람 제보 {getReportCount(place)}건
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="border-t">
        <Button type="button" variant="outline" size="sm" onClick={onOpenDetail}>
          상세 보기
        </Button>
      </CardFooter>
    </Card>
  );
}
