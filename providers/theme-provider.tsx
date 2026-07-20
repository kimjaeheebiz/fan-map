"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { appConfig, type AppConfig, type ThemeMode } from "@/config/app";
import { layoutTokens } from "@/config/theme-tokens";
import { applyThemeTokens } from "@/lib/apply-theme";

type AppConfigContextValue = {
  config: AppConfig;
  setConfig: (patch: Partial<AppConfig>) => void;
  resetConfig: () => void;
};

const AppConfigContext = React.createContext<AppConfigContextValue | null>(
  null,
);

function resolveScheme(
  theme: ThemeMode,
  resolvedTheme: string | undefined,
): "light" | "dark" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return resolvedTheme === "dark" ? "dark" : "light";
}

export function useAppConfig() {
  const ctx = React.useContext(AppConfigContext);
  if (!ctx) {
    throw new Error("useAppConfig must be used within ThemeProvider");
  }
  return ctx;
}

function ThemeConfigBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [config, setConfigState] = React.useState<AppConfig>(appConfig);

  const setConfig = React.useCallback((patch: Partial<AppConfig>) => {
    setConfigState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetConfig = React.useCallback(() => {
    setConfigState(appConfig);
  }, []);

  React.useEffect(() => {
    setTheme(config.theme);
  }, [config.theme, setTheme]);

  React.useEffect(() => {
    const scheme = resolveScheme(config.theme, resolvedTheme);
    applyThemeTokens({
      primaryColor: config.primaryColor,
      radius: config.radius,
      scheme,
    });

    const root = document.documentElement;
    root.style.setProperty(
      "--app-sidebar-width",
      config.sidebar === "collapsed"
        ? layoutTokens.sidebarCollapsed
        : layoutTokens.sidebarExpanded,
    );
    root.style.setProperty("--app-header-height", layoutTokens.headerHeight);
    root.dataset.layout = config.layout;
    root.dataset.sidebar = config.sidebar;
    root.dataset.header = config.header;
  }, [config, resolvedTheme]);

  const value = React.useMemo(
    () => ({ config, setConfig, resetConfig }),
    [config, setConfig, resetConfig],
  );

  return (
    <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={appConfig.theme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeConfigBridge>{children}</ThemeConfigBridge>
    </NextThemesProvider>
  );
}
