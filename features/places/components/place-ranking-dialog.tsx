"use client";

import {
  Dialog,
  DialogContent,
  DialogScrollLayout,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaceRankingPanel } from "@/features/places/components/place-ranking-panel";
import type { Place } from "@/features/places/types";

type PlaceRankingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace: (placeId: string) => void;
};

/** 모바일 랭킹 시트 */
export function PlaceRankingDialog({
  open,
  onOpenChange,
  places,
  selectedPlaceId = null,
  onSelectPlace,
}: PlaceRankingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent layout="scroll" size="md" blur showCloseButton={false}>
        <DialogScrollLayout
          title={<DialogTitle>이 지역 랭킹</DialogTitle>}
          showCloseButton
          onClose={() => onOpenChange(false)}
          bodyClassName="p-0"
        >
          <PlaceRankingPanel
            places={places}
            selectedPlaceId={selectedPlaceId}
            compact
            className="h-[22rem]"
            onSelectPlace={(placeId) => {
              onSelectPlace(placeId);
              onOpenChange(false);
            }}
          />
        </DialogScrollLayout>
      </DialogContent>
    </Dialog>
  );
}
