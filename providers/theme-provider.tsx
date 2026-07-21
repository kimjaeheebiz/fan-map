"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { appConfig, type AppConfig } from "@/config/app";
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

export function useAppConfig() {
  const ctx = React.useContext(AppConfigContext);
  if (!ctx) {
    throw new Error("useAppConfig must be used within ThemeProvider");
  }
  return ctx;
}

function ThemeConfigBridge({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [config, setConfigState] = React.useState<AppConfig>(appConfig);
  const didApplyAppTheme = React.useRef(false);

  // app.ts 기본 테마를 최초 1회 반영 (localStorage보다 config 우선)
  React.useEffect(() => {
    if (didApplyAppTheme.current) return;
    didApplyAppTheme.current = true;
    setTheme(appConfig.theme);
    setConfigState((prev) =>
      prev.theme === appConfig.theme ? prev : { ...prev, theme: appConfig.theme },
    );
  }, [setTheme]);

  const setConfig = React.useCallback(
    (patch: Partial<AppConfig>) => {
      if (patch.theme != null) {
        setTheme(patch.theme);
      }
      setConfigState((prev) => ({ ...prev, ...patch }));
    },
    [setTheme],
  );

  const resetConfig = React.useCallback(() => {
    setTheme(appConfig.theme);
    setConfigState(appConfig);
  }, [setTheme]);

  React.useEffect(() => {
    applyThemeTokens({
      primaryColor: config.primaryColor,
      radius: config.radius,
      scheme: config.theme,
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
  }, [config]);

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
      enableSystem={false}
      disableTransitionOnChange
      storageKey="fan-map-theme"
    >
      <ThemeConfigBridge>{children}</ThemeConfigBridge>
    </NextThemesProvider>
  );
}
