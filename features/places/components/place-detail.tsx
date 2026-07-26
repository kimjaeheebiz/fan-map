"use client";

import { useState, type ReactNode } from "react";
import {
  getLatestReport,
  getPlaceAmenityFlags,
  getPlaceGalleryImages,
  getPlaceLiveSummary,
  getPlaceSportIds,
  getReportCount,
  getTopTeamShortNames,
} from "@/features/places/lib/place-helpers";
import { PlaceImageGallery } from "@/features/places/components/place-image-gallery";
import { PlaceReportItem } from "@/features/places/components/place-report-card";
import { getSportName, getTagLabel } from "@/features/catalog/constants";
import { SportIcon } from "@/features/catalog/sport-icons";
import type { Place, ViewingReport } from "@/features/places/types";
import {
  DialogHeaderCloseButton,
  DialogIconButton,
  dialogBodyScrollClassName,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetDragArea } from "@/features/places/components/bottom-sheet";
import {
  ArrowLeft,
  PenLine,
  RefreshCw,
  Share2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import { usePlaces } from "@/features/places/hooks/use-places";
import { buildNaverMapSearchUrl } from "@/features/places/lib/naver-local-search";
import { ReportActivityIcon } from "@/features/places/components/report-activity-icon";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

type PlaceDetailProps = {
  place: Place;
  onClose?: () => void;
  onReport?: () => void;
  onEditReport?: (report: ViewingReport) => void;
  headerActions?: ReactNode;
  showBack?: boolean;
  showDragHandle?: boolean;
};

export function PlaceDetail({
  place,
  onClose,
  onReport,
  onEditReport,
  headerActions,
  showBack = false,
  showDragHandle = false,
}: PlaceDetailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { refetch } = usePlaces();
  const galleryImages = getPlaceGalleryImages(place);
  const latest = getLatestReport(place);
  const sports = getPlaceSportIds(place);
  const live = getPlaceLiveSummary(place);
  const amenities = getPlaceAmenityFlags(place);
  const teamNames = getTopTeamShortNames(place, 4);
  const { isFavorite, toggleFavorite } = useFavoritePlaceIds();
  const favorited = isFavorite(place.id);
  const naverMapUrl = buildNaverMapSearchUrl(place.name, place.address);

  const amenityTags = [
    amenities.hasScreen ? "대형스크린" : null,
    amenities.hasSound ? "경기음향" : null,
    amenities.goodForGroup ? "단체 가능" : null,
    ...amenities.tagIds.map(getTagLabel),
  ].filter(Boolean) as string[];

  function handleToggleFavorite() {
    if (!isReady) return;
    if (!isAuthenticated) {
      toast.message("즐겨찾기는 로그인 후 이용할 수 있습니다.");
      const returnUrl = pathname || "/";
      router.push(
        `${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }
    const next = toggleFavorite(place.id);
    if (next == null) return;
    toast.success(
      next ? "즐겨찾기에 추가했습니다." : "즐겨찾기를 해제했습니다.",
    );
  }

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/?place=${encodeURIComponent(place.id)}`
        : undefined;
    const shareText = [place.name, place.address].filter(Boolean).join("\n");
    const payload = {
      title: `${place.name} · Fan Map`,
      text: shareText,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
      const clipboardText = [shareText, shareUrl].filter(Boolean).join("\n");
      await navigator.clipboard.writeText(clipboardText);
      toast.success("장소 정보를 복사했습니다.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("공유에 실패했습니다.");
    }
  }

  async function handleRefreshReports() {
    setRefreshing(true);
    try {
      await refetch();
      toast.success("목록을 새로고침했습니다.");
    } catch {
      toast.error("새로고침에 실패했습니다.");
    } finally {
      setRefreshing(false);
    }
  }

  const reportCount = place.reports.length;

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
          <h2 className="font-heading text-base leading-none font-bold">
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
          {onReport ? (
            <DialogIconButton
              label="방문 경험 남기기"
              onClick={onReport}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <PenLine className="size-4" />
            </DialogIconButton>
          ) : null}
          <DialogIconButton
            label="공유"
            onClick={() => {
              void handleShare();
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Share2 className="size-4" />
          </DialogIconButton>
          <DialogIconButton
            label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            onClick={handleToggleFavorite}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Star
              className={cn(
                "size-4",
                favorited && "fill-report text-report",
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
          {(live.todayCount > 0 || live.recentCount > 0 || teamNames.length > 0) && (
            <div className="border-report/20 bg-report/5 space-y-1.5 rounded-lg border px-3 py-2.5">
              <p className="text-live flex items-center gap-2 text-sm font-bold">
                <ReportActivityIcon
                  variant={live.isHot ? "today" : "recent"}
                />
                <span>
                  {live.todayCount > 0
                    ? `오늘 방문 ${live.todayCount}건`
                    : `최근 방문 ${live.recentCount}건`}
                  {live.latestRelative ? ` · ${live.latestRelative}` : ""}
                </span>
              </p>
              {teamNames.length > 0 ? (
                <p className="text-sm font-medium">{teamNames.join(" · ")}</p>
              ) : null}
              <p className="text-muted-foreground text-xs">
                방문 경험 {getReportCount(place)}건
                {latest ? ` · 최근 방문일 ${formatDate(latest.watchedAt)}` : ""}
              </p>
            </div>
          )}

          <PlaceImageGallery images={galleryImages} />

          <div className="min-w-0 space-y-1 text-sm">
            <p className="break-words">{place.address}</p>
            {naverMapUrl && (
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-sm underline underline-offset-4 hover:opacity-80"
              >
                네이버 지도에서 보기
              </a>
            )}
          </div>

          {(sports.length > 0 || amenityTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {sports.map((id) => (
                <span
                  key={id}
                  className="text-foreground inline-flex items-center gap-1 text-sm"
                >
                  <SportIcon sportId={id} className="size-3.5 shrink-0" />
                  {getSportName(id)}
                </span>
              ))}
              {amenityTags.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            방문 전 매장에 영업·이용 가능 여부를 확인해 주세요.
            <br />
            매장 사정은 날마다 달라질 수 있어요.
          </p>

          {onReport && (
            <Button
              type="button"
              className="w-full bg-report text-report-foreground hover:bg-report/90"
              onClick={onReport}
            >
              <PenLine data-icon="inline-start" />
              다녀왔어요
            </Button>
          )}

          <Card size="sm" variant="border" className="min-w-0 gap-0 overflow-hidden py-0">
            <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
              <h3 className="text-sm font-bold">최근 방문</h3>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-muted-foreground text-xs tabular-nums">
                  {reportCount}건
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  aria-label="방문 목록 새로고침"
                  disabled={refreshing}
                  onClick={() => {
                    void handleRefreshReports();
                  }}
                >
                  <RefreshCw
                    className={cn("size-3.5", refreshing && "animate-spin")}
                  />
                </Button>
              </div>
            </div>

            {reportCount === 0 ? (
              <EmptyState
                title="아직 기록이 없습니다."
                description="이 장소에 다녀온 경험을 남겨 주세요."
                className="py-8"
              />
            ) : (
              <div className="divide-y">
                {place.reports.map((report) => (
                  <PlaceReportItem
                    key={report.id}
                    report={report}
                    onEdit={(entry) => onEditReport?.(entry)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
