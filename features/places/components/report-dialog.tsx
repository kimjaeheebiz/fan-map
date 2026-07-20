"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  PlacesStorageError,
  useAddReport,
} from "@/features/places/hooks/use-add-report";
import type { ReportFormValues } from "@/features/places/schema/report-form-schema";
import type { Place } from "@/features/places/types";
import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 기존 Place에 바로 제보할 때 */
  initialPlace?: Place | null;
  onSubmitted?: (place: Place) => void;
};

type Step = "pick" | "form";

function getInitialStep(initialPlace?: Place | null): Step {
  return initialPlace ? "form" : "pick";
}

function getInitialDraft(initialPlace?: Place | null): PlaceDraft | null {
  return initialPlace ? placeDraftFromPlace(initialPlace) : null;
}

export function ReportDialog({
  open,
  onOpenChange,
  initialPlace,
  onSubmitted,
}: ReportDialogProps) {
  const addReportMutation = useAddReport();
  const [step, setStep] = useState<Step>(() => getInitialStep(initialPlace));
  const [placeDraft, setPlaceDraft] = useState<PlaceDraft | null>(() =>
    getInitialDraft(initialPlace),
  );

  /** 열릴 때마다 props 기준으로 세션 리셋 (effect setState 대신) */
  const [session, setSession] = useState<{
    open: boolean;
    placeId: string | null;
  }>(() => ({
    open,
    placeId: initialPlace?.id ?? null,
  }));

  const nextPlaceId = initialPlace?.id ?? null;
  if (open !== session.open || (open && nextPlaceId !== session.placeId)) {
    setSession({ open, placeId: nextPlaceId });
    if (open) {
      setStep(getInitialStep(initialPlace));
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
      const place = await addReportMutation.mutateAsync({
        placeDraft,
        report: {
          sportTeams: values.sportTeams,
          watchedAt: values.watchedAt,
          review: values.review,
          tagIds: values.tagIds,
          images: values.images,
        },
      });

      toast.success("관람 제보가 등록되었습니다.");
      onSubmitted?.(place);
      handleClose(false);
    } catch (error) {
      if (error instanceof PlacesStorageError) {
        toast.error(error.message);
        return;
      }
      toast.error("제보 등록에 실패했습니다.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent layout="scroll" size="md" blur showCloseButton={false}>
        <DialogScrollLayout
          title={<DialogTitle>관람 제보하기</DialogTitle>}
          description={
            <DialogDescription className="mt-1.5">
              {step === "pick"
                ? "네이버 검색으로 장소를 선택한 뒤 관람 경험을 남깁니다."
                : "이 장소에서의 관람 정보를 입력해 주세요."}
            </DialogDescription>
          }
          onClose={() => handleClose(false)}
        >
          {step === "pick" ? (
            <PlacePicker onSelect={handleSelectSearchResult} />
          ) : placeDraft ? (
            <ReportForm
              placeDraft={placeDraft}
              submitting={addReportMutation.isPending}
              onSubmit={handleSubmit}
              onBack={initialPlace ? undefined : () => setStep("pick")}
            />
          ) : null}
        </DialogScrollLayout>
      </DialogContent>
    </Dialog>
  );
}
