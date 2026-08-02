"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  PlacesStorageError,
  useDeleteReport,
} from "@/features/places/hooks/use-report-mutations";
import { usePlaces } from "@/features/places/hooks/use-places";
import { RelativeTime } from "@/features/places/components/relative-time";
import { getSportName } from "@/features/catalog/constants";
import type { Place, ViewingReport } from "@/features/places/types";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { Loading } from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { formatDateTimeMinute } from "@/lib/format-date";
import { Card } from "@/components/ui/card";

type AuthorReportRow = {
  place: Place;
  report: ViewingReport;
};

export default function MyReportsPage() {
  const { user } = useAuth();
  const { data: places = [], isLoading } = usePlaces();
  const deleteMutation = useDeleteReport();
  const [pendingDelete, setPendingDelete] = useState<AuthorReportRow | null>(
    null,
  );

  const myReports = useMemo(() => {
    if (!user) return [];
    return places
      .flatMap((place) =>
        place.reports
          .filter((report) => report.authorId === user.id)
          .map((report) => ({ place, report })),
      )
      .sort(
        (a, b) =>
          new Date(b.report.createdAt).getTime() -
          new Date(a.report.createdAt).getTime(),
      );
  }, [places, user]);

  async function handleDelete() {
    if (!user || !pendingDelete) return;
    try {
      await deleteMutation.mutateAsync({
        placeId: pendingDelete.place.id,
        reportId: pendingDelete.report.id,
        editorId: user.id,
      });
      toast.success("방문 경험을 삭제했습니다.");
      setPendingDelete(null);
    } catch (error) {
      if (error instanceof PlacesStorageError) {
        toast.error(error.message);
        return;
      }
      toast.error("삭제에 실패했습니다.");
    }
  }

  return (
    <AccountPageShell
      title="방문 기록"
      description="남긴 방문 기록을 모아서 봅니다."
    >
      {isLoading ? (
        <Loading label="불러오는 중..." />
      ) : myReports.length === 0 ? (
        <EmptyState
          title="아직 기록이 없습니다."
          description="지도에서 장소를 고른 뒤 방문 경험을 남겨 보세요."
          className="py-12"
          action={
            <Button render={<Link href="/" />} nativeButton={false}>
              지도에서 남기기
            </Button>
          }
        />
      ) : (
        <Card className="gap-0 divide-y py-0" size="sm">
          {myReports.map(({ place, report }) => {
            const sportsLabel = (report.sportTeams ?? [])
              .map((set) => getSportName(set.sportId))
              .join(" · ");
            return (
              <div
                key={report.id}
                className="flex items-start gap-3 px-(--card-spacing) py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{place.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    방문 {formatDateTimeMinute(report.watchedAt)}
                    {sportsLabel ? ` · ${sportsLabel}` : ""}
                    {" · "}
                    <RelativeTime value={report.createdAt} />
                  </p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {report.review}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive shrink-0"
                  aria-label="삭제"
                  onClick={() => setPendingDelete({ place, report })}
                >
                  <Trash2 />
                </Button>
              </div>
            );
          })}
        </Card>
      )}

      <ConfirmDialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="이 기록을 삭제할까요?"
        description="삭제하면 되돌릴 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </AccountPageShell>
  );
}
