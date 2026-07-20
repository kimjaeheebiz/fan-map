"use client";

import type { ReactNode } from "react";
import { useAppConfig } from "@/providers/theme-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { AppContainer } from "@/components/layout/app-container";
import { cn } from "@/lib/utils";

export function MainShell({ children }: { children: ReactNode }) {
  const { config } = useAppConfig();
  const isVertical = config.layout === "vertical";

  return (
    <div
      className={cn(
        "bg-canvas flex min-h-svh w-full",
        isVertical ? "flex-row" : "flex-col",
      )}
    >
      {isVertical && (
        <div className="sticky top-0 hidden h-svh shrink-0 lg:block">
          <AppSidebar />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1">
          <AppContainer>{children}</AppContainer>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
