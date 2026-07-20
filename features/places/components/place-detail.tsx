"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetDragArea } from "@/features/places/components/bottom-sheet";
import { ArrowLeft, X } from "lucide-react";

type PlaceDetailProps = {
  place: Place;
  onClose?: () => void;
  /** 모바일 시트에서 목록으로 돌아가는 뒤로가기 */
  showBack?: boolean;
};

export function PlaceDetail({ place, onClose, showBack = false }: PlaceDetailProps) {
  const galleryImages = getPlaceGalleryImages(place);
  const latest = getLatestReport(place);
  const sports = getPlaceSportIds(place);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-1 px-3 py-3 sm:px-4">
        {onClose && showBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="목록으로"
            className="mt-0.5 shrink-0"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ArrowLeft />
          </Button>
        ) : null}
        <SheetDragArea className="min-w-0 flex-1 px-1 py-0.5">
          <h2 className="font-heading text-base font-medium">{place.name}</h2>
          {place.categoryName && (
            <p className="text-muted-foreground text-xs">{place.categoryName}</p>
          )}
        </SheetDragArea>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="닫기"
            className="mt-0.5 shrink-0"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <X />
          </Button>
        )}
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          <PlaceImageGallery images={galleryImages} />

          <div className="space-y-1 text-sm">
            <p>{place.address}</p>
            {place.phone && (
              <p className="text-muted-foreground">{place.phone}</p>
            )}
            {place.naverMapUrl && (
              <a
                href={place.naverMapUrl}
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
            <div className="flex flex-wrap gap-1.5">
              {sports.map((id) => (
                <Badge key={id} variant="secondary">
                  {getSportName(id)}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-muted-foreground text-xs leading-relaxed">
            관람 가능 여부는 방문 전 매장에 확인해 주세요. 경기별 상영 여부는
            달라질 수 있어요.
          </p>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-sm font-medium">최근 관람 제보</h3>
            {place.reports.length === 0 ? (
              <EmptyState
                title="아직 제보가 없습니다."
                description="이 장소에서 관람한 경험을 남겨 주세요."
                className="py-8"
              />
            ) : (
              place.reports.map((report) => (
                <Card key={report.id} size="sm" className="shadow-none">
                  <CardHeader className="border-b">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {getSportName(report.sportId)}
                      </Badge>
                      {report.teamId && (
                        <CardDescription>
                          {getTeamName(report.teamId)}
                        </CardDescription>
                      )}
                      <CardDescription className="ml-auto">
                        {report.watchedAt}
                      </CardDescription>
                    </div>
                    <CardTitle className="sr-only">관람 제보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="leading-relaxed">{report.review}</p>
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
      </ScrollArea>
    </div>
  );
}
