"use client";

import type { ReactNode } from "react";
import { useAppConfig } from "@/providers/theme-provider";
import { containerWidthClass } from "@/config/theme-tokens";
import { cn } from "@/lib/utils";

/** 메인 영역 폭·패딩만 담당. 카드는 PageCard가 감싼다. */
export function AppContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { config } = useAppConfig();

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-4 px-4 py-6",
        containerWidthClass[config.containerWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
