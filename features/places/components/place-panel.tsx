"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { PlaceDetail } from "@/features/places/components/place-detail";
import { PlaceImageGallery } from "@/features/places/components/place-image-gallery";
import {
  getCoverImageUrl,
  getLatestReport,
  getPlaceGalleryImages,
  getPrimarySportId,
  getReportCount,
  getSportEmoji,
  getTeamDistribution,
} from "@/features/places/lib/place-helpers";
import { getTeamName, teams } from "@/features/catalog/constants";
import type { Place } from "@/features/places/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const COMPACT_HEIGHT = 170;
const EXPANDED_MAX_HEIGHT = 560;
const PANEL_TRANSITION_MS = 300;

export type PlacePanelSnap = "compact" | "expanded";

type PlacePanelProps = {
  place: Place;
  onClose: () => void;
  onSnapChange?: (snap: PlacePanelSnap) => void;
  className?: string;
};

function getTeamShortName(teamId: string) {
  return teams.find((team) => team.id === teamId)?.shortName ?? getTeamName(teamId);
}

function getExpandedHeight() {
  if (typeof window === "undefined") return EXPANDED_MAX_HEIGHT;
  return Math.min(EXPANDED_MAX_HEIGHT, Math.round(window.innerHeight * 0.72));
}

export function PlacePanel({
  place,
  onClose,
  onSnapChange,
  className,
}: PlacePanelProps) {
  const [snap, setSnap] = useState<PlacePanelSnap>("compact");
  const [height, setHeight] = useState(COMPACT_HEIGHT);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const dragRef = useRef({ startY: 0, startHeight: COMPACT_HEIGHT });

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSnap("compact");
    setHeight(COMPACT_HEIGHT);
    setClosing(false);
    onSnapChange?.("compact");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place 변경 시에만 초기화
  }, [place.id]);

  useEffect(() => {
    function handleResize() {
      const nextExpanded = getExpandedHeight();
      setHeight((current) =>
        snap === "expanded" ? nextExpanded : Math.min(current, nextExpanded),
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [snap]);

  function applySnap(next: PlacePanelSnap) {
    setSnap(next);
    setHeight(next === "expanded" ? getExpandedHeight() : COMPACT_HEIGHT);
    onSnapChange?.(next);
  }

  function animateClose() {
    if (closing) return;
    setClosing(true);
    setHeight(0);
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, PANEL_TRANSITION_MS);
  }

  function snapFromHeight(value: number) {
    const expanded = getExpandedHeight();
    const closeThreshold = 96;
    const midPoint = (COMPACT_HEIGHT + expanded) / 2;

    if (value < closeThreshold) {
      animateClose();
      return;
    }
    if (value < midPoint) {
      applySnap("compact");
      return;
    }
    applySnap("expanded");
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = { startY: event.clientY, startHeight: height };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const deltaY = dragRef.current.startY - event.clientY;
    const next = Math.max(0, Math.min(getExpandedHeight(), dragRef.current.startHeight + deltaY));
    setHeight(next);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    snapFromHeight(height);
  }

  function handlePeekClick() {
    if (snap === "compact") {
      applySnap("expanded");
    }
  }

  const cover = getCoverImageUrl(place);
  const galleryImages = getPlaceGalleryImages(place);
  const previewImages = galleryImages.length > 0 ? galleryImages : cover ? [cover] : [];
  const reportCount = getReportCount(place);
  const primarySport = getPrimarySportId(place);
  const sportEmoji = primarySport ? getSportEmoji(primarySport) : "🏟️";
  const teamDistribution = getTeamDistribution(place);
  const latest = getLatestReport(place);
  const expandedHeight = getExpandedHeight();
  const showCompact = height < (COMPACT_HEIGHT + expandedHeight) / 2;
  const isAnimating = !dragging;

  return (
    <div
      className={cn(
        "bg-popover flex flex-col overflow-hidden rounded-2xl border shadow-xl ring-border/20",
        isAnimating &&
          "transition-[height,opacity,transform] duration-300 ease-out",
        closing
          ? "pointer-events-none opacity-0 translate-y-3"
          : "animate-in slide-in-from-bottom-4 fade-in duration-300",
        className,
      )}
      style={{ height }}
    >
      <div
        className="flex h-4 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="bg-muted h-1 w-10 rounded-full" aria-hidden="true" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {showCompact ? (
          <div
            role="button"
            tabIndex={0}
            className="flex min-h-0 flex-1 cursor-pointer gap-3 px-3 py-2"
            onClick={handlePeekClick}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                applySnap("expanded");
              }
            }}
          >
            <div className="size-24 shrink-0 overflow-hidden rounded-xl">
              {previewImages.length > 0 ? (
                <PlaceImageGallery
                  images={previewImages}
                  className="h-full gap-0"
                  imageClassName="size-24 shrink-0 rounded-none object-cover"
                />
              ) : null}
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col pt-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="닫기"
                className="absolute top-0 right-0"
                onClick={(event) => {
                  event.stopPropagation();
                  animateClose();
                }}
              >
                <X />
              </Button>

              <p className="truncate pr-8 font-medium">{place.name}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {sportEmoji} 경기 봤어요 {reportCount}명
              </p>

              {teamDistribution.length > 0 ? (
                <p className="text-muted-foreground mt-2 truncate text-xs">
                  {teamDistribution
                    .map(({ teamId, count }) => `${getTeamShortName(teamId)} ${count}`)
                    .join(" · ")}
                </p>
              ) : (
                <p className="text-muted-foreground mt-2 text-xs">응원팀 정보 없음</p>
              )}

              {latest ? (
                <p className="text-muted-foreground mt-2 line-clamp-1 text-sm leading-snug">
                  “{latest.review}”
                </p>
              ) : (
                <p className="text-muted-foreground mt-2 text-sm">
                  아직 관람 후기가 없어요.
                </p>
              )}

              <p className="text-muted-foreground shrink-0 pt-2 text-xs">
                탭하거나 위로 드래그해 상세 보기
              </p>
            </div>
          </div>
        ) : (
          <PlaceDetail place={place} onClose={animateClose} />
        )}
      </div>
    </div>
  );
}
