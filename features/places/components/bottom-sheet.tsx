"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type SheetSnap = "peek" | "half" | "full";

const TRANSITION_MS = 300;
const DISMISS_THRESHOLD = 72;

type SheetDragHandlers = {
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
};

const SheetDragContext = createContext<SheetDragHandlers | null>(null);

/** 시트 드래그 스냅 영역. 뒤로/닫기 등 버튼은 밖에 두고 이 컴포넌트로 감싸세요. */
export function SheetDragArea({
  children,
  className,
  asHandle = false,
}: {
  children?: ReactNode;
  className?: string;
  asHandle?: boolean; // 얇은 핸들 바용
}) {
  const drag = useContext(SheetDragContext);

  if (!drag) {
    return asHandle ? null : <div className={className}>{children}</div>;
  }

  return (
    <div
      role={asHandle ? "button" : undefined}
      tabIndex={asHandle ? 0 : undefined}
      aria-label={asHandle ? "시트를 위아래로 드래그" : undefined}
      className={cn(
        "cursor-grab touch-none select-none active:cursor-grabbing",
        asHandle && "flex h-5 shrink-0 items-center justify-center",
        className,
      )}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
      onPointerCancel={drag.onPointerCancel}
      onDoubleClick={drag.onDoubleClick}
    >
      {asHandle ? (
        <span className="bg-muted h-1 w-10 rounded-full" aria-hidden="true" />
      ) : (
        children
      )}
    </div>
  );
}

export function getSheetSnapHeights() {
  if (typeof window === "undefined") {
    return { peek: 160, half: 420, full: 620 };
  }
  const vh = window.innerHeight;
  return {
    peek: Math.round(Math.min(168, vh * 0.22)),
    half: Math.round(Math.min(440, vh * 0.48)),
    full: Math.round(Math.min(720, vh * 0.88)),
  };
}

function heightForSnap(snap: SheetSnap) {
  return getSheetSnapHeights()[snap];
}

function nearestSnap(height: number, dismissible: boolean): SheetSnap | "dismiss" {
  const { peek, half, full } = getSheetSnapHeights();
  if (dismissible && height < DISMISS_THRESHOLD) return "dismiss";

  const candidates: { snap: SheetSnap; value: number }[] = [
    { snap: "peek", value: peek },
    { snap: "half", value: half },
    { snap: "full", value: full },
  ];
  let best = candidates[0];
  let bestDist = Math.abs(height - best.value);
  for (const candidate of candidates.slice(1)) {
    const dist = Math.abs(height - candidate.value);
    if (dist < bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best.snap;
}

type BottomSheetProps = {
  children: ReactNode;
  defaultSnap?: SheetSnap;
  dismissible?: boolean;
  onDismiss?: () => void;
  onSnapChange?: (snap: SheetSnap) => void;
  onHeightChange?: (height: number) => void;
  className?: string;
};

export function BottomSheet({
  children,
  defaultSnap = "half",
  dismissible = false,
  onDismiss,
  onSnapChange,
  onHeightChange,
  className,
}: BottomSheetProps) {
  const [snap, setSnap] = useState<SheetSnap>(defaultSnap);
  const [height, setHeight] = useState(() => heightForSnap(defaultSnap));
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragRef = useRef({ startY: 0, startHeight: height });
  const heightRef = useRef(height);
  const snapRef = useRef(snap);

  useLayoutEffect(() => {
    heightRef.current = height;
    onHeightChange?.(height);
  }, [height, onHeightChange]);

  useEffect(() => {
    snapRef.current = snap;
  }, [snap]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      setHeight(heightForSnap(snapRef.current));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function applySnap(next: SheetSnap) {
    setSnap(next);
    setHeight(heightForSnap(next));
    onSnapChange?.(next);
  }

  function animateDismiss() {
    if (!dismissible || closing) return;
    setClosing(true);
    setHeight(0);
    closeTimerRef.current = window.setTimeout(() => {
      onDismiss?.();
    }, TRANSITION_MS);
  }

  const dragHandlers = useMemo<SheetDragHandlers>(
    () => ({
      onPointerDown(event) {
        if (event.button !== 0) return;
        dragRef.current = {
          startY: event.clientY,
          startHeight: heightRef.current,
        };
        draggingRef.current = true;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event) {
        if (!draggingRef.current) return;
        const deltaY = dragRef.current.startY - event.clientY;
        const max = getSheetSnapHeights().full;
        const next = Math.max(
          0,
          Math.min(max, dragRef.current.startHeight + deltaY),
        );
        setHeight(next);
      },
      onPointerUp() {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setDragging(false);
        const result = nearestSnap(heightRef.current, dismissible);
        if (result === "dismiss") {
          animateDismiss();
          return;
        }
        applySnap(result);
      },
      onPointerCancel() {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setDragging(false);
        applySnap(snapRef.current);
      },
      onDoubleClick() {
        const current = snapRef.current;
        if (current === "full") applySnap("half");
        else if (current === "half") applySnap("full");
        else applySnap("half");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers read latest via refs
    [dismissible, closing, onDismiss, onSnapChange],
  );

  return (
    <SheetDragContext.Provider value={dragHandlers}>
      <div
        className={cn(
          "bg-popover flex flex-col overflow-hidden rounded-t-lg border border-b-0 shadow-xl ring-1 ring-foreground/5 dark:ring-foreground/10",
          !dragging &&
            "transition-[height,opacity,transform] duration-300 ease-out",
          closing
            ? "pointer-events-none translate-y-2 opacity-0"
            : "animate-in slide-in-from-bottom-4 fade-in duration-300",
          className,
        )}
        style={{ height }}
      >
        <SheetDragArea asHandle />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </SheetDragContext.Provider>
  );
}
