import type { ReactNode } from "react";
import Link from "next/link";
import { appConfig } from "@/config/app";

type MapShellProps = {
  children: ReactNode;
};

/**
 * Fan Map 지도 전용 레이아웃.
 * 사이드바·푸터 없이 뷰포트 전체 지도를 우선한다.
 */
export function MapShell({ children }: MapShellProps) {
  return (
    <div className="bg-canvas flex h-dvh w-full flex-col overflow-hidden">
      <header className="border-border bg-card flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">
            F
          </span>
          <span>{appConfig.name}</span>
        </Link>
      </header>
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  );
}
