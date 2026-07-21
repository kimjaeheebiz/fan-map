"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string; // 스크롤 트랙(가로 flex 영역) 클래스
  scrollRatio?: number; // 한 번 이동 시 스크롤 비율 (뷰포트 대비). 기본 0.75
};

type ScrollNavButtonProps = {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
};

function ScrollNavButton({ direction, visible, onClick }: ScrollNavButtonProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-y-0 z-10 hidden items-center md:flex",
        direction === "left" ? "left-0" : "right-0",
      )}
    >
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className="opacity-70 hover:opacity-100"
        aria-label={direction === "left" ? "왼쪽으로 이동" : "오른쪽으로 이동"}
        onClick={onClick}
      >
        {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </div>
  );
}

/**
 * 가로 스크롤 영역 + PC용 좌우 이동 버튼.
 * 모바일은 드래그, PC(md+)는 오버플로 시 화살표 버튼 표시.
 */
export function HorizontalScroll({
  children,
  className,
  contentClassName,
  scrollRatio = 0.75,
}: HorizontalScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    for (const child of el.children) {
      observer.observe(child);
    }

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, children]);

  function scrollByDirection(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const delta = Math.max(el.clientWidth * scrollRatio, 120) * direction;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      <ScrollNavButton
        direction="left"
        visible={canScrollLeft}
        onClick={() => scrollByDirection(-1)}
      />

      <div
        ref={trackRef}
        role="group"
        className={cn(
          "flex gap-2 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          contentClassName,
        )}
      >
        {children}
      </div>

      <ScrollNavButton
        direction="right"
        visible={canScrollRight}
        onClick={() => scrollByDirection(1)}
      />
    </div>
  );
}
