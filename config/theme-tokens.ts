import type { PrimaryColor, RadiusSize, ContainerWidth } from "@/config/app";

type ColorPair = {
  primary: string;
  primaryForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
};

/**
 * Primary Color → CSS 변수 값 (hex).
 * light / dark 각각 --primary, --sidebar-primary 계열만 교체한다.
 */
export const primaryColorTokens: Record<
  PrimaryColor,
  { light: ColorPair; dark: ColorPair }
> = {
  blue: {
    light: {
      primary: "#1447e6",
      primaryForeground: "#eff6ff",
      sidebarPrimary: "#155dfc",
      sidebarPrimaryForeground: "#eff6ff",
    },
    dark: {
      primary: "#193cb8",
      primaryForeground: "#eff6ff",
      sidebarPrimary: "#2b7fff",
      sidebarPrimaryForeground: "#eff6ff",
    },
  },
  green: {
    light: {
      primary: "#008236",
      primaryForeground: "#f0fdf4",
      sidebarPrimary: "#008236",
      sidebarPrimaryForeground: "#f0fdf4",
    },
    dark: {
      primary: "#5ea500",
      primaryForeground: "#0f1c0f",
      sidebarPrimary: "#5ea500",
      sidebarPrimaryForeground: "#0f1c0f",
    },
  },
  orange: {
    light: {
      primary: "#f54900",
      primaryForeground: "#fff9eb",
      sidebarPrimary: "#f54900",
      sidebarPrimaryForeground: "#fff9eb",
    },
    dark: {
      primary: "#ff8904",
      primaryForeground: "#441b06",
      sidebarPrimary: "#ff8904",
      sidebarPrimaryForeground: "#441b06",
    },
  },
  red: {
    light: {
      primary: "#e7000b",
      primaryForeground: "#fef2f2",
      sidebarPrimary: "#e7000b",
      sidebarPrimaryForeground: "#fef2f2",
    },
    dark: {
      primary: "#fb2c36",
      primaryForeground: "#fef2f2",
      sidebarPrimary: "#fb2c36",
      sidebarPrimaryForeground: "#fef2f2",
    },
  },
  violet: {
    light: {
      primary: "#7f22fe",
      primaryForeground: "#f5f3ff",
      sidebarPrimary: "#7f22fe",
      sidebarPrimaryForeground: "#f5f3ff",
    },
    dark: {
      primary: "#a684ff",
      primaryForeground: "#231b3b",
      sidebarPrimary: "#a684ff",
      sidebarPrimaryForeground: "#231b3b",
    },
  },
  rose: {
    light: {
      primary: "#f11650",
      primaryForeground: "#fff5f7",
      sidebarPrimary: "#f11650",
      sidebarPrimaryForeground: "#fff5f7",
    },
    dark: {
      primary: "#ff4d78",
      primaryForeground: "#2c0610",
      sidebarPrimary: "#ff4d78",
      sidebarPrimaryForeground: "#2c0610",
    },
  },
  zinc: {
    light: {
      primary: "#18181b",
      primaryForeground: "#fafafa",
      sidebarPrimary: "#18181b",
      sidebarPrimaryForeground: "#fafafa",
    },
    dark: {
      primary: "#e4e4e7",
      primaryForeground: "#18181b",
      sidebarPrimary: "#e4e4e7",
      sidebarPrimaryForeground: "#18181b",
    },
  },
};

export const radiusTokens: Record<RadiusSize, string> = {
  none: "0rem",
  sm: "0.45rem",
  md: "0.65rem",
  lg: "0.85rem",
  xl: "1.15rem",
};

export const containerWidthClass: Record<ContainerWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-none",
};

export const layoutTokens = {
  sidebarExpanded: "16rem",
  sidebarCollapsed: "4.5rem",
  headerHeight: "3.5rem",
} as const;
