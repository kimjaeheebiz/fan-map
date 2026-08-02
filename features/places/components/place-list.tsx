"use client";

import { usePathname, useRouter } from "next/navigation";
import { Flame, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
import {
  getCoverImageUrl,
  getActivePlaceEvent,
  getPlaceLiveSummary,
  getPlaceSportsRanked,
  getPlaceTagIds,
  getReportCount,
} from "@/features/places/lib/place-helpers";
import { getSportName, selectListTags } from "@/features/catalog/constants";
import { SportIcon } from "@/features/catalog/sport-icons";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import { PlaceEventBadge } from "@/features/places/components/place-event-badge";
import { ReportActivityIcon } from "@/features/places/components/report-activity-icon";
import type { Place } from "@/features/places/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LIST_SPORT_ICON_LIMIT = 2;

type PlaceListProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
};

/** 장소 목록 — 스포츠 Live 카드 */
export function PlaceList({
  places,
  selectedPlaceId,
  onSelectPlace,
}: PlaceListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();
  const { isFavorite, toggleFavorite } = useFavoritePlaceIds();

  function handleToggleFavorite(placeId: string) {
    if (!isReady) return;
    if (!isAuthenticated) {
      toast.message("즐겨찾기는 로그인 후 이용할 수 있습니다.");
      const returnUrl = pathname || "/";
      router.push(
        `${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }
    if (toggleFavorite(placeId) == null) return;
  }

  return (
    <div className="flex flex-col gap-2.5 p-3">
      {places.map((place) => {
        const cover = getCoverImageUrl(place);
        const rankedSports = getPlaceSportsRanked(place);
        const visibleSports = rankedSports.slice(0, LIST_SPORT_ICON_LIMIT);
        const sportOverflow = rankedSports.length - visibleSports.length;
        const selected = place.id === selectedPlaceId;
        const favorited = isFavorite(place.id);
        const live = getPlaceLiveSummary(place);
        const activeEvent = getActivePlaceEvent(place);
        const { tags: listTags, overflow: tagOverflow } = selectListTags(
          getPlaceTagIds(place),
        );

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
                ? "relative shadow-md before:bg-primary before:absolute before:inset-y-4 before:left-1 before:w-0.75 before:rounded-full"
                : "hover:shadow-md",
            )}
          >
            <CardHeader className="relative min-w-0 px-3 py-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-md">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                  {live.isHot ? (
                    <span
                      className="bg-report text-report-foreground absolute top-1 left-1 flex size-6 items-center justify-center rounded-full shadow-xs"
                      aria-label="핫"
                      title="핫"
                    >
                      <Flame className="size-3.5 fill-current" aria-hidden />
                    </span>
                  ) : null}
                  {activeEvent ? (
                    <PlaceEventBadge event={activeEvent} />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden pr-8">
                  <CardTitle
                    className="block truncate text-sm font-bold"
                    title={place.name}
                  >
                    {place.name}
                  </CardTitle>
                  <CardDescription
                    className="mt-0.5 block truncate text-xs"
                    title={place.address}
                  >
                    {place.address}
                  </CardDescription>

                  {(live.todayCount > 0 || live.recentCount > 0) && (
                    <p className="text-live mt-1.5 flex min-w-0 items-center gap-1.5 text-xs font-semibold">
                      <ReportActivityIcon
                        variant={live.isHot ? "today" : "recent"}
                        className="size-4"
                      />
                      <span className="truncate">
                        {live.todayCount > 0
                          ? `오늘 방문 ${live.todayCount}건`
                          : `최근 방문 ${live.recentCount}건`}
                      </span>
                    </p>
                  )}

                  {visibleSports.length > 0 || live.teamsLabel ? (
                    <div
                      className="text-muted-foreground mt-1 flex min-w-0 items-center gap-1.5 text-xs"
                      aria-label={
                        rankedSports.length > 0
                          ? rankedSports
                              .map((entry) => getSportName(entry.sportId))
                              .join(", ")
                          : undefined
                      }
                    >
                      {visibleSports.map(({ sportId }) => (
                        <SportIcon
                          key={sportId}
                          sportId={sportId}
                          className="size-3.5 shrink-0"
                        />
                      ))}
                      {sportOverflow > 0 ? (
                        <span className="text-[10px] font-semibold">
                          +{sportOverflow}
                        </span>
                      ) : null}
                      {live.teamsLabel ? (
                        <span className="truncate">{live.teamsLabel}</span>
                      ) : null}
                    </div>
                  ) : rankedSports.length === 0 ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      방문 경험 {getReportCount(place)}건
                    </p>
                  ) : null}

                  {listTags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="rounded-md px-1.5 py-0 text-[10px] font-medium"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                      {tagOverflow > 0 ? (
                        <Badge
                          variant="secondary"
                          className="rounded-md px-1.5 py-0 text-[10px] font-medium"
                        >
                          +{tagOverflow}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
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
                    handleToggleFavorite(place.id);
                  }}
                >
                  <Star
                    className={cn(
                      "size-4",
                      favorited
                        ? "fill-report text-report"
                        : "text-muted-foreground/35",
                    )}
                  />
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
