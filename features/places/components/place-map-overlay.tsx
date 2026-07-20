import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlaceMapOverlayProps = {
  children: ReactNode;
  className?: string;
};

/** 지도 영역 하단 중앙에 띄우는 공통 래퍼 */
export function PlaceMapOverlay({ children, className }: PlaceMapOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 pb-4 md:p-4">
      <div
        className={cn(
          "pointer-events-auto w-full transition-[max-width,opacity,transform] duration-300 ease-out",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
