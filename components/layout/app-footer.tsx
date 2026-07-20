"use client";

import { useAppConfig } from "@/providers/theme-provider";

export function AppFooter() {
  const { config } = useAppConfig();

  if (!config.footer) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-border text-muted-foreground border-t px-4 py-4 text-center">
      © {year} {config.name}. All rights reserved.
    </footer>
  );
}
