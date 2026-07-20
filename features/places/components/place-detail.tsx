"use client";

import type { ReactNode } from "react";
import {
  getLatestReport,
  getPlaceGalleryImages,
  getPlaceSportIds,
  getReportCount,
} from "@/features/places/lib/place-helpers";
import { PlaceImageGallery } from "@/features/places/components/place-image-gallery";
import {
  getSportName,
  getTagLabel,
  getTeamName,
} from "@/features/catalog/constants";
import type { Place } from "@/features/places/types";
import {
  DialogHeaderCloseButton,
  DialogIconButton,
  dialogBodyScrollClassName,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SheetDragArea } from "@/features/places/components/bottom-sheet";
import { ArrowLeft, PenLine, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import { buildNaverMapSearchUrl } from "@/features/places/lib/naver-local-search";
import { toast } from "sonner";

type PlaceDetailProps = {
  place: Place;
  onClose?: () => void;
  onReport?: () => void;
  /** 닫기 왼쪽 — 즐겨찾기·공유 등 */
  headerActions?: ReactNode;
  /** 모바일 시트에서 목록으로 돌아가는 뒤로가기 */
  showBack?: boolean;
  /**
   * 드래그 핸들 바.
   * BottomSheet가 이미 핸들을 그리므로 시트에서는 false.
   * Dialog로 띄울 때만 true.
   */
  showDragHandle?: boolean;
};

export function PlaceDetail({
  place,
  onClose,
  onReport,
  headerActions,
  showBack = false,
  showDragHandle = false,
}: PlaceDetailProps) {
  const galleryImages = getPlaceGalleryImages(place);
  const latest = getLatestReport(place);
  const sports = getPlaceSportIds(place);
  const { isFavorite, toggleFavorite } = useFavoritePlaceIds();
  const favorited = isFavorite(place.id);
  const naverMapUrl = buildNaverMapSearchUrl(place.name, place.address);

  function handleToggleFavorite() {
    const next = toggleFavorite(place.id);
    toast.success(
      next ? "즐겨찾기에 추가했습니다." : "즐겨찾기를 해제했습니다.",
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {showDragHandle ? <SheetDragArea asHandle /> : null}

      <header className="flex shrink-0 items-start gap-2 border-b px-3 py-3 sm:px-4">
        {onClose && showBack ? (
          <DialogIconButton
            label="목록으로"
            className="mt-0.5"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ArrowLeft />
          </DialogIconButton>
        ) : null}

        <SheetDragArea className="min-w-0 flex-1">
          <h2 className="font-heading text-base leading-none font-medium">
            {place.name}
          </h2>
          {place.categoryName ? (
            <p className="text-muted-foreground mt-1.5 text-xs">
              {place.categoryName}
            </p>
          ) : null}
        </SheetDragArea>

        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          {headerActions}
          <DialogIconButton
            label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            onClick={handleToggleFavorite}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Star
              className={cn(
                "size-4",
                favorited && "fill-primary text-primary",
              )}
            />
          </DialogIconButton>
          {onClose ? (
            <DialogHeaderCloseButton
              onClick={onClose}
              onPointerDown={(event) => event.stopPropagation()}
            />
          ) : null}
        </div>
      </header>

      <div className={cn(dialogBodyScrollClassName, "min-w-0")}>
        <div className="flex flex-col gap-4 px-4 py-4">
          <PlaceImageGallery images={galleryImages} />

          <div className="min-w-0 space-y-1 text-sm">
            <p className="break-words">{place.address}</p>
            {place.phone && (
              <p className="text-muted-foreground">{place.phone}</p>
            )}
            {naverMapUrl && (
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-sm underline-offset-4 hover:underline"
              >
                네이버 지도에서 보기
              </a>
            )}
            <p className="text-muted-foreground">
              관람 제보 {getReportCount(place)}건
              {latest ? ` · 최근 ${latest.watchedAt}` : ""}
            </p>
          </div>

          {sports.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sports.map((id) => (
                <Badge key={id} variant="outline">
                  {getSportName(id)}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            관람 가능 여부는 방문 전 매장에 확인해 주세요. 경기별 상영 여부는
            달라질 수 있어요.
          </p>

          {onReport && (
            <Button type="button" className="w-full" onClick={onReport}>
              <PenLine data-icon="inline-start" />
              이 장소에 관람 제보하기
            </Button>
          )}

          <Separator />

          <section className="min-w-0 space-y-3">
            <h3 className="text-sm font-medium">최근 관람 제보</h3>
            {place.reports.length === 0 ? (
              <EmptyState
                title="아직 제보가 없습니다."
                description="이 장소에서 관람한 경험을 남겨 주세요."
                className="py-8"
              />
            ) : (
              place.reports.map((report) => (
                <Card
                  key={report.id}
                  size="sm"
                  className="min-w-0 overflow-hidden shadow-none"
                >
                  <CardHeader className="border-b">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          {(report.sportTeams ?? []).map((set) => (
                            <div
                              key={set.sportId}
                              className="flex flex-wrap items-center gap-1"
                            >
                              <Badge variant="outline">
                                {getSportName(set.sportId)}
                              </Badge>
                              {(set.teamIds ?? []).map((teamId) => (
                                <Badge key={teamId} variant="secondary">
                                  {getTeamName(teamId)}
                                </Badge>
                              ))}
                            </div>
                          ))}
                        </div>
                        <CardDescription className="shrink-0 text-xs">
                          {report.watchedAt}
                        </CardDescription>
                      </div>
                    </div>
                    <CardTitle className="sr-only">관람 제보</CardTitle>
                  </CardHeader>
                  <CardContent className="min-w-0 space-y-2">
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {report.review}
                    </p>
                    {report.tagIds && report.tagIds.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {report.tagIds.map((tagId) => (
                          <Badge key={tagId} variant="secondary">
                            {getTagLabel(tagId)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {report.images.length > 0 && (
                      <PlaceImageGallery
                        images={report.images}
                        imageClassName="h-20 w-28 rounded-md"
                      />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
