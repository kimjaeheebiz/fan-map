"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { appConfig } from "@/config/app";
import { Button } from "@/components/ui/button";

type RegisterReport = (handler: (() => void) | null) => void;

const MapShellReportContext = createContext<RegisterReport | null>(null);

/**
 * 지도 홈에서 제보 버튼을 MapShell 헤더에 연결한다.
 */
export function useMapShellReportAction(onReport: () => void) {
  const register = useContext(MapShellReportContext);
  const onReportRef = useRef(onReport);
  onReportRef.current = onReport;

  useLayoutEffect(() => {
    if (!register) return;
    register(() => onReportRef.current());
    return () => register(null);
  }, [register]);
}

type MapShellProps = {
  children: ReactNode;
};

/**
 * Fan Map 지도 전용 레이아웃.
 * 사이드바·푸터 없이 뷰포트 전체 지도를 우선한다.
 */
export function MapShell({ children }: MapShellProps) {
  const reportHandlerRef = useRef<(() => void) | null>(null);
  const [hasReportAction, setHasReportAction] = useState(false);

  const registerReport = useCallback<RegisterReport>((handler) => {
    reportHandlerRef.current = handler;
    setHasReportAction(handler != null);
  }, []);

  return (
    <MapShellReportContext.Provider value={registerReport}>
      <div className="bg-canvas flex h-dvh w-full flex-col overflow-hidden">
        <header className="border-border bg-card flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold"
          >
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">
              F
            </span>
            <span>{appConfig.name}</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {hasReportAction ? (
              <Button
                type="button"
                size="sm"
                onClick={() => reportHandlerRef.current?.()}
              >
                <Plus data-icon="inline-start" />
                제보
              </Button>
            ) : null}
          </div>
        </header>
        <main className="relative min-h-0 flex-1">{children}</main>
      </div>
    </MapShellReportContext.Provider>
  );
}
