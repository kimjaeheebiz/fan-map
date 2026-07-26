"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flag, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authNav } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  getSportName,
  getTagLabel,
  getTeamName,
} from "@/features/catalog/constants";
import { SportIcon } from "@/features/catalog/sport-icons";
import { PlaceImageGallery } from "@/features/places/components/place-image-gallery";
import {
  PlacesStorageError,
  useDeleteReport,
} from "@/features/places/hooks/use-report-mutations";
import { formatRelativeTime } from "@/features/places/lib/place-helpers";
import type { ViewingReport } from "@/features/places/types";
import { cn } from "@/lib/utils";

type PlaceReportItemProps = {
  report: ViewingReport;
  onEdit: (report: ViewingReport) => void;
  className?: string;
};

function nicknameInitial(nickname: string) {
  const trimmed = nickname.trim();
  return trimmed ? trimmed.slice(0, 1) : "?";
}

/** 제보 리스트 행 — 카드가 아닌 라인 아이템 */
export function PlaceReportItem({
  report,
  onEdit,
  className,
}: PlaceReportItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isReady } = useAuth();
  const deleteMutation = useDeleteReport();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = Boolean(user && report.authorId === user.id);

  function requireLogin() {
    toast.message("로그인 후 이용할 수 있습니다.");
    const returnUrl = pathname || "/";
    router.push(
      `${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`,
    );
  }

  function handleEdit() {
    if (!isReady) return;
    if (!isAuthenticated) {
      requireLogin();
      return;
    }
    if (!isOwner) {
      toast.error("본인이 남긴 기록만 수정할 수 있습니다.");
      return;
    }
    onEdit(report);
  }

  function handleReportAbuse() {
    if (!isReady) return;
    if (!isAuthenticated) {
      requireLogin();
      return;
    }
    toast.success("신고가 접수되었습니다. (PoC)");
  }

  async function handleDelete() {
    if (!user) {
      requireLogin();
      return;
    }
    try {
      await deleteMutation.mutateAsync({
        placeId: report.placeId,
        reportId: report.id,
        editorId: user.id,
      });
      toast.success("방문 경험을 삭제했습니다.");
      setDeleteOpen(false);
    } catch (error) {
      if (error instanceof PlacesStorageError) {
        toast.error(error.message);
        return;
      }
      toast.error("삭제에 실패했습니다.");
    }
  }

  return (
    <>
      <article
        className={cn(
          "relative min-w-0 space-y-2 py-3 pr-11 pl-4",
          className,
        )}
      >
        <div className="absolute top-2.5 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  aria-label="방문 기록 메뉴"
                  onPointerDown={(event) => event.stopPropagation()}
                />
              }
            >
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              {isOwner ? (
                <>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 />
                    삭제
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleReportAbuse}>
                  <Flag />
                  신고
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {(report.sportTeams ?? []).map((set) => {
            const teamNames = (set.teamIds ?? [])
              .map((teamId) => getTeamName(teamId))
              .filter(Boolean);
            return (
              <span
                key={set.sportId}
                className="text-foreground inline-flex min-w-0 items-center gap-1.5 text-sm font-medium"
              >
                <SportIcon
                  sportId={set.sportId}
                  className="size-3.5 shrink-0"
                  aria-label={getSportName(set.sportId)}
                />
                {teamNames.length > 0 ? (
                  <span className="min-w-0">{teamNames.join(" · ")}</span>
                ) : null}
              </span>
            );
          })}
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Avatar size="sm" className="size-6">
            <AvatarFallback className="text-[10px] font-semibold">
              {nicknameInitial(report.authorNickname)}
            </AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground min-w-0 truncate text-xs">
            {report.authorNickname}
            <span className="text-muted-foreground/70">
              {" "}
              · {formatRelativeTime(report.createdAt)}
            </span>
          </p>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">
          {report.review}
        </p>

        {report.tagIds && report.tagIds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {report.tagIds.map((tagId) => (
              <Badge
                key={tagId}
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
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
      </article>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="이 기록을 삭제할까요?"
        description="삭제하면 되돌릴 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </>
  );
}

/** @deprecated PlaceReportItem 사용 */
export const PlaceReportCard = PlaceReportItem;
