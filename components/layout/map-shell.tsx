"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Map, PenLine } from "lucide-react";
import { appConfig } from "@/config/app";
import { MoreMenu } from "@/components/common/more-menu";
import { ServiceModeSwitcher } from "@/components/common/service-mode-switcher";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { UserMenu } from "@/components/common/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegisterReport = (handler: (() => void) | null) => void;

const MapShellReportContext = createContext<RegisterReport | null>(null);

/**
 * 지도 홈에서 다녀왔어요 버튼을 MapShell 헤더에 연결한다.
 */
export function useMapShellReportAction(onReport: () => void) {
  const register = useContext(MapShellReportContext);
  const onReportRef = useRef(onReport);

  useLayoutEffect(() => {
    onReportRef.current = onReport;
  });

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
 * Fan Map 공통 레이아웃 (지도·마이페이지 등).
 * 헤더에 다녀왔어요는 상시 노출, 지도가 아닌 화면에서는 지도 버튼도 표시.
 */
export function MapShell({ children }: MapShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reportHandlerRef = useRef<(() => void) | null>(null);
  const isMapHome = pathname === "/";

  const registerReport = useCallback<RegisterReport>((handler) => {
    reportHandlerRef.current = handler;
  }, []);

  function handleReportClick() {
    if (reportHandlerRef.current) {
      reportHandlerRef.current();
      return;
    }
    router.push("/?report=1");
  }

  return (
    <MapShellReportContext.Provider value={registerReport}>
      <div className="bg-canvas flex h-dvh w-full flex-col overflow-hidden">
        <header className="border-border bg-card flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold"
          >
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">
              F
            </span>
            <span>{appConfig.name}</span>
          </Link>
          <ServiceModeSwitcher />
          <div className="ml-auto flex items-center gap-1">
            {!isMapHome ? (
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
                aria-label="지도"
                render={<Link href="/" />}
                nativeButton={false}
              >
                <Map className="size-4" />
                <span className="hidden sm:inline">지도</span>
              </Button>
            ) : null}
            <Button
              type="button"
              size="icon-sm"
              className={cn(
                "bg-report text-report-foreground hover:bg-report/90",
                "sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3",
              )}
              aria-label="다녀왔어요"
              onClick={handleReportClick}
            >
              <PenLine className="size-4" />
              <span className="hidden sm:inline">다녀왔어요</span>
            </Button>
            <ThemeSwitcher />
            <UserMenu />
            <MoreMenu />
          </div>
        </header>
        <main className="relative min-h-0 flex-1">{children}</main>
      </div>
    </MapShellReportContext.Provider>
  );
}
