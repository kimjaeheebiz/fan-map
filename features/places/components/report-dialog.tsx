"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogScrollLayout,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlacePicker } from "@/features/places/components/place-picker";
import { ReportForm } from "@/features/places/components/report-form";
import {
  placeDraftFromPlace,
  placeDraftFromSearch,
  type PlaceDraft,
} from "@/features/places/data/place-storage";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  PlacesStorageError,
  useAddReport,
  useUpdateReport,
} from "@/features/places/hooks/use-report-mutations";
import type { ReportFormValues } from "@/features/places/schema/report-form-schema";
import type { Place, ViewingReport } from "@/features/places/types";
import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";
import {
  dateTimeLocalToIso,
  toDateTimeLocalValue,
} from "@/lib/format-date";

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlace?: Place | null;
  /** 있으면 수정 모드 */
  editReport?: ViewingReport | null;
  onSubmitted?: (place: Place) => void;
};

type Step = "pick" | "form";

function getInitialStep(
  initialPlace?: Place | null,
  editReport?: ViewingReport | null,
): Step {
  return initialPlace || editReport ? "form" : "pick";
}

function getInitialDraft(initialPlace?: Place | null): PlaceDraft | null {
  return initialPlace ? placeDraftFromPlace(initialPlace) : null;
}

function reportToFormValues(report: ViewingReport): ReportFormValues {
  return {
    sportTeams: report.sportTeams.map((set) => ({
      sportId: set.sportId,
      teamIds: set.teamIds ?? [],
    })),
    watchedAt: toDateTimeLocalValue(report.watchedAt),
    review: report.review,
    tagIds: report.tagIds ?? [],
    images: report.images ?? [],
  };
}

export function ReportDialog({
  open,
  onOpenChange,
  initialPlace,
  editReport = null,
  onSubmitted,
}: ReportDialogProps) {
  const { user } = useAuth();
  const addReportMutation = useAddReport();
  const updateReportMutation = useUpdateReport();
  const isEdit = editReport != null;

  const [step, setStep] = useState<Step>(() =>
    getInitialStep(initialPlace, editReport),
  );
  const [placeDraft, setPlaceDraft] = useState<PlaceDraft | null>(() =>
    getInitialDraft(initialPlace),
  );

  const [session, setSession] = useState<{
    open: boolean;
    placeId: string | null;
    reportId: string | null;
  }>(() => ({
    open,
    placeId: initialPlace?.id ?? null,
    reportId: editReport?.id ?? null,
  }));

  const nextPlaceId = initialPlace?.id ?? null;
  const nextReportId = editReport?.id ?? null;
  if (
    open !== session.open ||
    (open &&
      (nextPlaceId !== session.placeId || nextReportId !== session.reportId))
  ) {
    setSession({ open, placeId: nextPlaceId, reportId: nextReportId });
    if (open) {
      setStep(getInitialStep(initialPlace, editReport));
      setPlaceDraft(getInitialDraft(initialPlace));
    }
  }

  function handleClose(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function handleSelectSearchResult(result: PlaceSearchResult) {
    setPlaceDraft(placeDraftFromSearch(result));
    setStep("form");
  }

  async function handleSubmit(values: ReportFormValues) {
    if (!placeDraft) return;

    try {
      if (isEdit && editReport) {
        if (!user) {
          toast.message("수정은 로그인 후 이용할 수 있습니다.");
          return;
        }
        if (editReport.authorId !== user.id) {
          toast.error("본인이 남긴 기록만 수정할 수 있습니다.");
          return;
        }

        const place = await updateReportMutation.mutateAsync({
          placeId: editReport.placeId,
          reportId: editReport.id,
          editorId: user.id,
          report: {
            sportTeams: values.sportTeams,
            watchedAt: dateTimeLocalToIso(values.watchedAt),
            review: values.review,
            tagIds: values.tagIds,
            images: values.images,
          },
        });
        toast.success("방문 경험을 수정했습니다.");
        onSubmitted?.(place);
        handleClose(false);
        return;
      }

      if (!user) {
        toast.message("방문 경험은 로그인 후 이용할 수 있습니다.");
        return;
      }

      const place = await addReportMutation.mutateAsync({
        placeDraft,
        report: {
          authorId: user.id,
          authorNickname: user.nickname,
          sportTeams: values.sportTeams,
          watchedAt: dateTimeLocalToIso(values.watchedAt),
          review: values.review,
          tagIds: values.tagIds,
          images: values.images,
        },
      });

      toast.success("방문 경험을 남겼습니다.");
      onSubmitted?.(place);
      handleClose(false);
    } catch (error) {
      if (error instanceof PlacesStorageError) {
        toast.error(error.message);
        return;
      }
      toast.error(
        isEdit ? "수정에 실패했습니다." : "등록에 실패했습니다.",
      );
    }
  }

  const submitting =
    addReportMutation.isPending || updateReportMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent layout="scroll" size="md" blur showCloseButton={false}>
        <DialogScrollLayout
          title={
            <DialogTitle>
              {isEdit
                ? "경험을 수정해 주세요"
                : step === "pick"
                  ? "장소를 선택해 주세요"
                  : "경험을 남겨 주세요"}
            </DialogTitle>
          }
          onClose={() => handleClose(false)}
        >
          {step === "pick" && !isEdit ? (
            <PlacePicker onSelect={handleSelectSearchResult} />
          ) : placeDraft ? (
            <ReportForm
              key={editReport?.id ?? "create"}
              placeDraft={placeDraft}
              defaultValues={
                editReport ? reportToFormValues(editReport) : undefined
              }
              submitLabel={isEdit ? "수정 저장" : "남기기"}
              submitting={submitting}
              onSubmit={handleSubmit}
              onBack={
                isEdit || initialPlace ? undefined : () => setStep("pick")
              }
            />
          ) : null}
        </DialogScrollLayout>
      </DialogContent>
    </Dialog>
  );
}
