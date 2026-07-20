import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlaceMapOverlayProps = {
  children: ReactNode;
  className?: string;
};

/** 지도 영역 하단에 띄우는 모바일 상세 시트 래퍼 */
export function PlaceMapOverlay({ children, className }: PlaceMapOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center",
        className,
      )}
    >
      <div className="pointer-events-auto w-full max-w-lg">{children}</div>
    </div>
  );
}
